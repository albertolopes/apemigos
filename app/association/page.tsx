'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Notification from '../components/Notification/Notification';
import api from '../../services/api-service';
import { associadosService } from '@services';
import { buildAssociateEmail } from '../utils/email-template';

export default function AssociesePage() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<
    'idle' | 'sending' | 'success' | 'error'
  >('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [hasConvenio, setHasConvenio] = useState<boolean>(false);

  // previews
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [laudoName, setLaudoName] = useState<string | null>(null);
  const [docName, setDocName] = useState<string | null>(null);

  const maxFileSize = 5 * 1024 * 1024; // 5MB

  // --- validações utilitárias ---
  function onlyDigits(s: string) {
    return s ? String(s).replace(/\D/g, '') : '';
  }

  function validateCPF(cpf?: string) {
    if (!cpf) return false;
    const v = onlyDigits(cpf);
    if (v.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(v)) return false; // todos iguais

    const calc = (digits: string, factor: number) => {
      let total = 0;
      for (let i = 0; i < digits.length; i++) {
        total += parseInt(digits.charAt(i), 10) * (factor - i);
      }
      const mod = total % 11;
      return mod < 2 ? 0 : 11 - mod;
    };

    const d1 = calc(v.substr(0, 9), 10);
    const d2 = calc(v.substr(0, 9) + String(d1), 11);

    return (
      d1 === parseInt(v.charAt(9), 10) && d2 === parseInt(v.charAt(10), 10)
    );
  }

  function validatePhone(phone?: string) {
    if (!phone) return false;
    const v = onlyDigits(phone);
    // aceitar números com 10 ou 11 dígitos (DDD + número)
    return v.length === 10 || v.length === 11;
  }

  function validateEmail(email?: string) {
    if (!email) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // --- máscaras simples (sem dependências) ---
  function formatCPF(value: string) {
    const v = onlyDigits(value).slice(0, 11);
    if (!v) return '';
    if (v.length <= 3) return v;
    if (v.length <= 6) return `${v.slice(0, 3)}.${v.slice(3)}`;
    if (v.length <= 9) return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6)}`;
    return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}`;
  }

  function formatPhone(value: string) {
    const v = onlyDigits(value).slice(0, 11);
    if (!v) return '';
    if (v.length <= 2) return `(${v}`;
    if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
    if (v.length <= 10)
      return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
    return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`;
  }

  function formatCEP(value: string) {
    const v = onlyDigits(value).slice(0, 8);
    if (!v) return '';
    if (v.length <= 5) return v;
    return `${v.slice(0, 5)}-${v.slice(5)}`;
  }

  function readFileAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(String(fr.result));
      fr.onerror = () => reject(new Error('Erro ao ler arquivo'));
      fr.readAsDataURL(file);
    });
  }

  // ler arquivo como ArrayBuffer (fallback para FileReader quando necessário)
  function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    if (file.arrayBuffer) return file.arrayBuffer();
    return new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.onload = () => resolve(fr.result as ArrayBuffer);
      fr.onerror = () => reject(new Error('Erro ao ler arquivo'));
      fr.readAsArrayBuffer(file);
    });
  }

  // calcula hash SHA-256 do arquivo e retorna hex, ou null se falhar
  async function hashFile(file: File): Promise<string | null> {
    try {
      const buf = await readFileAsArrayBuffer(file);
      const cryptoObj =
        typeof window !== 'undefined' && (window as any).crypto
          ? (window as any).crypto
          : (globalThis as any).crypto;
      if (!cryptoObj || !cryptoObj.subtle) return null;
      const h = await cryptoObj.subtle.digest('SHA-256', buf);
      const bytes = new Uint8Array(h);
      return Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    } catch (err) {
      console.warn('Erro ao gerar hash do arquivo', err);
      return null;
    }
  }

  function mapFieldToLabel(field: string) {
    switch (field) {
      case 'foto3x4':
        return 'Foto 3x4';
      case 'laudo':
        return 'Laudo G35';
      case 'documento':
        return 'Documento (RG/CPF/Habilitação)';
      default:
        return field;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === 'sending') return;

    const form = formRef.current;
    if (!form) return;

    const fd = new FormData(form);
    const nome = String(fd.get('nome') || '').trim();
    const sobrenome = String(fd.get('sobrenome') || '').trim();
    const email = String(fd.get('email') || '').trim();
    const telefoneContato = String(fd.get('telefoneContato') || '').trim();
    // endereço
    const cidade = String(fd.get('cidade') || '').trim();
    const estado = String(fd.get('estado') || '').trim();
    const bairro = undefined; // removed field
    const numero = undefined; // removed field
    const logradouro = String(fd.get('logradouro') || '').trim();
    const complemento = String(fd.get('complemento') || '').trim();
    const cep = String(fd.get('cep') || '').trim();
    const telefoneEmergencia = String(
      fd.get('telefoneEmergencia') || ''
    ).trim();
    const nomeContatoEmergencia = String(
      fd.get('nomeContatoEmergencia') || ''
    ).trim();
    const medicoResponsavel = String(fd.get('medicoResponsavel') || '').trim();
    const telefoneMedico = String(fd.get('telefoneMedico') || '').trim();
    const rg = String(fd.get('rg') || '').trim();
    const cpf = String(fd.get('cpf') || '').trim();
    const dataNascimento = String(fd.get('dataNascimento') || '').trim();
    const convenio = String(fd.get('convenio') || '').trim();
    const convenioNome = String(fd.get('convenioNome') || '').trim();
    const observacoes = String(fd.get('observacoes') || '').trim();

    // validações
    const newErrors: Record<string, string> = {};
    // obrigatórios conforme pedido
    if (!nome) newErrors.nome = 'Nome é obrigatório.';
    if (!sobrenome) newErrors.sobrenome = 'Sobrenome é obrigatório.';
    if (!dataNascimento)
      newErrors.dataNascimento = 'Data de nascimento é obrigatória.';
    if (!cpf) newErrors.cpf = 'CPF é obrigatório.';
    else if (!validateCPF(cpf)) newErrors.cpf = 'CPF inválido.';
    if (!rg) newErrors.rg = 'RG é obrigatório.';
    if (!email || !validateEmail(email))
      newErrors.email = 'Email é obrigatório e deve ser válido.';
    if (!telefoneContato)
      newErrors.telefoneContato = 'Telefone de contato é obrigatório.';
    else if (!validatePhone(telefoneContato))
      newErrors.telefoneContato = 'Telefone inválido.';
    // endereço: todos os campos são obrigatórios agora
    if (!cidade) newErrors.cidade = 'Cidade é obrigatória.';
    if (!estado) newErrors.estado = 'Estado é obrigatório.';
    if (!logradouro) newErrors.logradouro = 'Logradouro é obrigatório.';
    if (!cep) newErrors.cep = 'CEP é obrigatório.';
    else if (onlyDigits(cep).length !== 8)
      newErrors.cep = 'CEP inválido. Deve conter 8 dígitos.';
    // telefones opcionais: valida se preenchidos
    if (telefoneEmergencia && !validatePhone(telefoneEmergencia))
      newErrors.telefoneEmergencia = 'Telefone inválido.';
    if (telefoneMedico && !validatePhone(telefoneMedico))
      newErrors.telefoneMedico = 'Telefone inválido.';

    // arquivos obrigatórios: laudo, foto, documento
    const laudoFile = fd.get('laudo') as File | null;
    const fotoFile = fd.get('foto3x4') as File | null;
    const docFile = fd.get('documento') as File | null;
    if (!laudoFile || laudoFile.size === 0)
      newErrors.laudo = 'Laudo G35 é obrigatório.';
    if (!fotoFile || fotoFile.size === 0)
      newErrors.foto3x4 = 'Foto 3x4 é obrigatória.';
    if (!docFile || docFile.size === 0)
      newErrors.documento = 'Documento é obrigatório.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setStatus('error');
      const fields = Object.keys(newErrors).join(', ');
      setMessage(`Corrija os campos em destaque: ${fields}`);
      console.warn('Validação falhou:', newErrors);
      return;
    }
    setErrors({});

    setStatus('sending');
    setMessage(null);

    try {
      // processar arquivos para enviar no corpo do email (embed imagens pequenas)
      const files: any[] = [];

      // Build list of file candidates (field -> File)
      const fileEntries: { field: string; file: File }[] = [];
      if (fotoFile && fotoFile.size > 0)
        fileEntries.push({ field: 'foto3x4', file: fotoFile });
      if (laudoFile && laudoFile.size > 0)
        fileEntries.push({ field: 'laudo', file: laudoFile });
      if (docFile && docFile.size > 0)
        fileEntries.push({ field: 'documento', file: docFile });

      // compute hashes in parallel (SHA-256) and detect duplicates by hash
      const hashes = await Promise.all(
        fileEntries.map((fe) => hashFile(fe.file))
      );

      const hashMap = new Map<string, { field: string; name: string }>();
      for (let i = 0; i < fileEntries.length; i++) {
        const { field, file } = fileEntries[i];
        const h = hashes[i];

        if (!h) {
          // fallback: use name-size signature
          const sig = `${file.name}-${file.size}`;
          if (hashMap.has(sig)) {
            const other = hashMap.get(sig)!;
            const msg = `Arquivo duplicado: '${file.name}' e '${other.name}'. Remova um dos anexos.`;
            setStatus('error');
            setMessage(msg);
            setErrors((s) => ({
              ...s,
              [field]: 'Arquivo duplicado',
              [other.field]: 'Arquivo duplicado',
            }));
            const el = document.getElementById(
              field
            ) as HTMLInputElement | null;
            if (el) {
              el.focus();
              el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
          }
          // ok, adicionar novo signature
          hashMap.set(sig, { field, name: file.name });
          // push metadata (no dataUrl embedding for fallback)
          files.push({
            field: mapFieldToLabel(field),
            name: file.name,
            size: file.size,
            type: file.type,
          });
          continue;
        }

        // h exists: check duplicates by hash
        if (hashMap.has(h)) {
          const other = hashMap.get(h)!;
          const msg = `Arquivos duplicados detectados: '${file.name}' e '${other.name}' (mesmo conteúdo). Remova um dos anexos.`;
          setStatus('error');
          setMessage(msg);
          setErrors((s) => ({
            ...s,
            [field]: 'Arquivo duplicado',
            [other.field]: 'Arquivo duplicado',
          }));
          const el = document.getElementById(field) as HTMLInputElement | null;
          if (el) {
            el.focus();
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          return;
        }

        // add hash entry and metadata (embed small images)
        hashMap.set(h, { field, name: file.name });
        const dataUrl =
          file.type.startsWith('image/') && file.size <= 100 * 1024
            ? await readFileAsDataUrl(file)
            : undefined;
        files.push({
          field: mapFieldToLabel(field),
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl,
        });
      }

      const subject = `Novo cadastro: ${nome} ${sobrenome}`;

      // DEBUG: log valores antes de gerar o email para ajudar a diagnosticar problemas
      console.debug(
        '[Cartão da pessoa com EM] Valores antes de buildAssociateEmail:',
        {
          nome,
          sobrenome,
          logradouro,
          complemento,
          cidade,
          estado,
          cep,
        }
      );

      const body = buildAssociateEmail({
        nome: String(fd.get('nome') || '').trim(),
        sobrenome: String(fd.get('sobrenome') || '').trim(),
        email: String(fd.get('email') || '').trim(),
        telefoneContato: String(fd.get('telefoneContato') || '').trim(),
        telefoneEmergencia: String(fd.get('telefoneEmergencia') || '').trim(),
        nomeContatoEmergencia: String(
          fd.get('nomeContatoEmergencia') || ''
        ).trim(),
        medicoResponsavel: String(fd.get('medicoResponsavel') || '').trim(),
        telefoneMedico: String(fd.get('telefoneMedico') || '').trim(),
        rg: String(fd.get('rg') || '').trim(),
        cpf: String(fd.get('cpf') || '').trim(),
        dataNascimento: String(fd.get('dataNascimento') || '').trim(),
        cidade: String(fd.get('cidade') || '').trim(),
        estado: String(fd.get('estado') || '').trim(),
        logradouro: String(fd.get('logradouro') || '').trim(),
        complemento: String(fd.get('complemento') || '').trim(),
        cep: String(fd.get('cep') || '').trim(),
        convenioSaude: convenio === 'sim' ? 'Sim' : 'Não',
        convenioNome: convenio === 'sim' ? convenioNome || '' : '',
        observacoes: String(fd.get('observacoes') || '').trim(),
        files,
      });

      // DEBUG: log snippet of generated body to confirm address line appears
      console.debug(
        '[Cartão da pessoa com EM] bodyHtml snippet:',
        body.replace(/\s+/g, ' ').slice(0, 400)
      );

      try {
        // montar multipart/form-data
        const multipart = new FormData();
        const appendIf = (key: string, value: any) => {
          if (value === undefined || value === null) return;
          if (typeof value === 'string' && value.trim() === '') return;
          multipart.append(key, String(value));
        };

        appendIf('nome', nome);
        appendIf('sobrenome', sobrenome);
        appendIf('dataNascimento', dataNascimento);
        appendIf('cpf', cpf);
        appendIf('rg', rg);
        appendIf('email', email);
        appendIf('telefoneContato', telefoneContato);
        appendIf('telefoneEmergencia', telefoneEmergencia);
        appendIf('nomeContatoEmergencia', nomeContatoEmergencia);
        appendIf('medicoResponsavel', medicoResponsavel);
        appendIf('cidade', cidade);
        appendIf('estado', estado);
        appendIf('logradouro', logradouro);
        appendIf('complemento', complemento);
        appendIf('cep', cep);
        appendIf('telefoneMedico', telefoneMedico);
        appendIf('observacoes', observacoes);
        appendIf('convenioNome', convenioNome);

        // anexar arquivos
        // safe append: only append Blob/File or convert dataURL to Blob
        function dataURLtoBlob(dataurl: string) {
          const arr = dataurl.split(',');
          const mime =
            arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
          const bstr = atob(arr[1]);
          let n = bstr.length;
          const u8arr = new Uint8Array(n);
          while (n--) u8arr[n] = bstr.charCodeAt(n);
          return new Blob([u8arr], { type: mime });
        }

        const safeAppendFile = (fieldName: string, fileOrData: any) => {
          if (!fileOrData) return;
          try {
            if (
              fileOrData instanceof File ||
              (typeof Blob !== 'undefined' && fileOrData instanceof Blob)
            ) {
              const f = fileOrData as File;
              multipart.append(fieldName, f, (f as any).name || `${fieldName}`);
              return;
            }

            // object with dataUrl + name => convert
            if (
              fileOrData &&
              typeof fileOrData === 'object' &&
              typeof fileOrData.dataUrl === 'string'
            ) {
              try {
                const blob = dataURLtoBlob(fileOrData.dataUrl);
                const filename = fileOrData.name || `${fieldName}.png`;
                multipart.append(fieldName, blob, filename);
                return;
              } catch (err) {
                console.warn(
                  'Erro ao converter dataUrl do objeto para Blob',
                  err
                );
                return;
              }
            }

            if (
              typeof fileOrData === 'string' &&
              fileOrData.startsWith('data:')
            ) {
              try {
                const blob = dataURLtoBlob(fileOrData);
                multipart.append(fieldName, blob, `${fieldName}.png`);
                return;
              } catch (err) {
                console.warn('Erro ao converter dataURL para Blob', err);
                return;
              }
            }

            // plain metadata object (no content) — skip attaching but keep metadata
            if (
              fileOrData &&
              typeof fileOrData === 'object' &&
              fileOrData.name
            ) {
              console.warn(
                'Campo informado como metadata apenas, sem conteúdo:',
                fieldName,
                fileOrData.name
              );
              return;
            }

            console.warn(
              'Não foi possível anexar campo - tipo não suportado:',
              fieldName,
              fileOrData
            );
          } catch (err) {
            console.error('Erro ao anexar arquivo no FormData', err);
          }
        };

        safeAppendFile('laudo', laudoFile);
        safeAppendFile('foto3x4', fotoFile);
        safeAppendFile('documento', docFile);

        // files metadata
        const filesMeta = (files || []).map((f) => ({
          field: f.field,
          name: f.name,
          contentType: f.type,
          size: f.size,
        }));
        multipart.append('files', JSON.stringify(filesMeta));

        // incluir o corpo do email (HTML) para o backend usar ao enviar
        multipart.append('bodyHtml', body);

        // enviar para o backend (usa instância api que adiciona Authorization)
        // DEBUG: log do FormData para depuração (mostra chaves e tipos de valores)
        try {
          // log FormData raw values for key 'logradouro' to ensure it's appended
          try {
            const rawLog = multipart.get('logradouro');
            console.debug(
              '[Cartão da pessoa com EM] multipart.logradouro:',
              rawLog
            );
          } catch (e) {
            console.warn(
              '[Cartão da pessoa com EM] não foi possível ler multipart.logradouro',
              e
            );
          }
          for (const entry of multipart.entries()) {
            const [k, v] = entry as [string, any];
            if (v instanceof File) {
              console.debug(
                '[FormData] field:',
                k,
                'fileName:',
                v.name,
                'type:',
                v.type,
                'size:',
                v.size
              );
            } else {
              console.debug('[FormData] field:', k, 'value:', v);
            }
          }
        } catch (err) {
          console.error('Erro ao iterar FormData:', err);
        }

        const response = await associadosService.createAssociado(multipart);

        if (
          response.status === 204 ||
          (response.status >= 200 && response.status < 300)
        ) {
          setStatus('success');
          setMessage('Cadastro enviado com sucesso. Obrigado!');
          form.reset();
          setFotoPreview(null);
          setLaudoName(null);
          setDocName(null);
        } else {
          throw new Error('Resposta inesperada do servidor');
        }
      } catch (apiErr: any) {
        console.error('Erro ao enviar para /api/associados:', apiErr);
        setStatus('error');
        setMessage(apiErr?.message || 'Erro ao enviar cadastro');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err?.message || 'Erro ao processar o formulário');
    }
  }

  async function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setMessage('Foto 3x4 precisa ser uma imagem');
      setStatus('error');
      return;
    }
    if (f.size > maxFileSize) {
      setMessage('Foto 3x4 excede 5MB');
      setStatus('error');
      return;
    }

    const dataUrl = await readFileAsDataUrl(f);
    setFotoPreview(dataUrl);
    // clear any previous file errors for foto3x4
    setErrors((s) => {
      const copy = { ...s };
      delete copy.foto3x4;
      return copy;
    });
  }

  function handleLaudoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setLaudoName(f.name);
    setErrors((s) => {
      const copy = { ...s };
      delete copy.laudo;
      return copy;
    });
  }

  function handleDocChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setDocName(f.name);
    setErrors((s) => {
      const copy = { ...s };
      delete copy.documento;
      return copy;
    });
  }

  function handleCPFInput(e: React.ChangeEvent<HTMLInputElement>) {
    const el = e.target;
    const formatted = formatCPF(el.value);
    el.value = formatted;
    setErrors((s) => {
      const copy = { ...s };
      delete copy.cpf;
      return copy;
    });
  }

  function handlePhoneInput(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const el = e.target;
      const formatted = formatPhone(el.value);
      el.value = formatted;
      setErrors((s) => {
        const copy = { ...s };
        delete copy[field];
        return copy;
      });
    };
  }

  function handleCEPInput(e: React.ChangeEvent<HTMLInputElement>) {
    const el = e.target;
    const formatted = formatCEP(el.value);
    el.value = formatted;
    setErrors((s) => {
      const copy = { ...s };
      delete copy.cep;
      return copy;
    });
  }

  return (
    <div className="relative">
      <div className="w-full h-[320px] relative">
        <Image
          src="https://i.imgur.com/ZN56KWD.png"
          alt="Cartão da pessoa com EM - Apemigos"
          fill
          style={{ objectFit: 'cover' }}
          unoptimized
        />
      </div>

      <div className="max-w-7xl mx-auto mt-[-50px] sm:mt-[-100px] relative bg-white px-4 sm:px-20 pb-12">
        <h1 className="text-center py-8 text-orange-500 font-site text-3xl">
          Cartão da pessoa com EM
        </h1>

        <div className="max-w-3xl mx-auto text-center mb-6">
          <p className="text-slate-600 mt-3">
            O Cartão da Pessoa com Esclerose Múltipla é um instrumento que
            auxilia na identificação da condição em estabelecimentos públicos e
            privados. Para sua validade, é necessário apresentá-lo juntamente
            com um documento oficial com foto.
          </p>

          <p className="text-slate-600 mt-2">
            Além disso, o cartão pode garantir benefícios como descontos ou
            condições especiais para acesso a shows, cinemas, parques e outros
            eventos, conforme a legislação vigente do estado em que você
            estiver.
          </p>

          <p className="text-slate-600 mt-4">
            Preencha o formulário abaixo para se associar à Apemigos. Campos com
            <span className="text-orange-500"> *</span> são obrigatórios.
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16 px-2 sm:px-0">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="border-2 text-slate-500 p-6 sm:p-8 rounded-lg bg-white shadow-sm w-full max-w-4xl"
            aria-labelledby="associe-title"
          >
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    className="text-xs text-slate-500 font-semibold"
                    htmlFor="nome"
                  >
                    Nome{' '}
                    <span className="text-orange-500" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    aria-required="true"
                    className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    type="text"
                    name="nome"
                    id="nome"
                    required
                  />
                  {errors.nome && (
                    <div className="text-xs text-red-600 mt-1">
                      {errors.nome}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    className="text-xs text-slate-500 font-semibold"
                    htmlFor="sobrenome"
                  >
                    Sobrenome{' '}
                    <span className="text-orange-500" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    aria-required="true"
                    className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    type="text"
                    name="sobrenome"
                    id="sobrenome"
                    required
                  />
                  {errors.sobrenome && (
                    <div className="text-xs text-red-600 mt-1">
                      {errors.sobrenome}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    className="text-xs text-slate-500 font-semibold"
                    htmlFor="dataNascimento"
                  >
                    Data de nascimento{' '}
                    <span className="text-orange-500" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    aria-required="true"
                    className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    type="date"
                    name="dataNascimento"
                    id="dataNascimento"
                    required
                  />
                  {errors.dataNascimento && (
                    <div className="text-xs text-red-600 mt-1">
                      {errors.dataNascimento}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    className="text-xs text-slate-500 font-semibold"
                    htmlFor="cpf"
                  >
                    CPF{' '}
                    <span className="text-orange-500" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    aria-required="true"
                    onInput={handleCPFInput}
                    placeholder="000.000.000-00"
                    inputMode="numeric"
                    className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    type="text"
                    name="cpf"
                    id="cpf"
                    required
                    aria-describedby="cpfHelp"
                  />
                  {errors.cpf && (
                    <div className="text-xs text-red-600 mt-1">
                      {errors.cpf}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    className="text-xs text-slate-500 font-semibold"
                    htmlFor="rg"
                  >
                    RG{' '}
                    <span className="text-orange-500" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    aria-required="true"
                    className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    type="text"
                    name="rg"
                    id="rg"
                    required
                  />
                  {errors.rg && (
                    <div className="text-xs text-red-600 mt-1">{errors.rg}</div>
                  )}
                </div>

                <div>
                  <label
                    className="text-xs text-slate-500 font-semibold"
                    htmlFor="email"
                  >
                    Email{' '}
                    <span className="text-orange-500" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <input
                    aria-required="true"
                    className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    type="email"
                    name="email"
                    id="email"
                    required
                  />
                  {errors.email && (
                    <div className="text-xs text-red-600 mt-1">
                      {errors.email}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    className="text-xs text-slate-500 font-semibold"
                    htmlFor="telefoneContato"
                  >
                    Telefone de contato *
                  </label>
                  <input
                    onInput={handlePhoneInput('telefoneContato')}
                    placeholder="(61) 99999-9999"
                    inputMode="tel"
                    className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    type="tel"
                    name="telefoneContato"
                    id="telefoneContato"
                    required
                    aria-describedby="telHelp"
                  />
                  {errors.telefoneContato && (
                    <div className="text-xs text-red-600 mt-1">
                      {errors.telefoneContato}
                    </div>
                  )}
                </div>

                {/* Endereço: cidade / estado */}
              </div>

              <fieldset className="border border-slate-300 rounded-lg p-4">
                <legend className="text-sm font-site text-slate-700 px-1">
                  Endereço
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="text-xs text-slate-500 font-semibold"
                      htmlFor="cidade"
                    >
                      Cidade <span className="text-orange-500">*</span>
                    </label>
                    <input
                      aria-required="true"
                      required
                      onInput={() =>
                        setErrors((s) => {
                          const c = { ...s };
                          delete c.cidade;
                          return c;
                        })
                      }
                      className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      type="text"
                      name="cidade"
                      id="cidade"
                    />
                    {errors.cidade && (
                      <div className="text-xs text-red-600 mt-1">
                        {errors.cidade}
                      </div>
                    )}
                  </div>
                  <div>
                    <label
                      className="text-xs text-slate-500 font-semibold"
                      htmlFor="estado"
                    >
                      Estado <span className="text-orange-500">*</span>
                    </label>
                    <input
                      aria-required="true"
                      required
                      onInput={() =>
                        setErrors((s) => {
                          const c = { ...s };
                          delete c.estado;
                          return c;
                        })
                      }
                      className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      type="text"
                      name="estado"
                      id="estado"
                    />
                    {errors.estado && (
                      <div className="text-xs text-red-600 mt-1">
                        {errors.estado}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                  <div className="col-span-1 sm:col-span-2">
                    <label
                      className="text-xs text-slate-500 font-semibold"
                      htmlFor="logradouro"
                    >
                      Logradouro <span className="text-orange-500">*</span>
                    </label>
                    <input
                      aria-required="true"
                      onInput={() =>
                        setErrors((s) => {
                          const c = { ...s };
                          delete c.logradouro;
                          return c;
                        })
                      }
                      required
                      className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      type="text"
                      name="logradouro"
                      id="logradouro"
                    />
                    {errors.logradouro && (
                      <div className="text-xs text-red-600 mt-1">
                        {errors.logradouro}
                      </div>
                    )}
                  </div>

                  <div>
                    <label
                      className="text-xs text-slate-500 font-semibold"
                      htmlFor="complemento"
                    >
                      Complemento
                    </label>
                    <input
                      onInput={() =>
                        setErrors((s) => {
                          const c = { ...s };
                          delete c.complemento;
                          return c;
                        })
                      }
                      className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      type="text"
                      name="complemento"
                      id="complemento"
                    />
                  </div>

                  <div className="mt-4">
                    <label
                      className="text-xs text-slate-500 font-semibold"
                      htmlFor="cep"
                    >
                      CEP <span className="text-orange-500">*</span>
                    </label>
                    <input
                      aria-required="true"
                      required
                      onInput={handleCEPInput}
                      placeholder="00000-000"
                      inputMode="numeric"
                      className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      type="text"
                      name="cep"
                      id="cep"
                      aria-describedby="cepHelp"
                    />
                    <div id="cepHelp" className="text-xs text-slate-400 mt-1">
                      Informe o CEP no formato 00000-000
                    </div>
                    {errors.cep && (
                      <div className="text-xs text-red-600 mt-1">
                        {errors.cep}
                      </div>
                    )}
                  </div>
                </div>
              </fieldset>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                <div>
                  <label
                    className="text-xs text-slate-500 font-semibold flex items-center gap-2"
                    htmlFor="nomeContatoEmergencia"
                  >
                    <span>Nome do contato de emergência</span>
                    <span className="text-xs text-slate-400">(opcional)</span>
                  </label>
                  <input
                    onInput={() =>
                      setErrors((s) => {
                        const c = { ...s };
                        delete c.nomeContatoEmergencia;
                        return c;
                      })
                    }
                    className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    type="text"
                    name="nomeContatoEmergencia"
                    id="nomeContatoEmergencia"
                  />
                  {errors.nomeContatoEmergencia && (
                    <div className="text-xs text-red-600 mt-1">
                      {errors.nomeContatoEmergencia}
                    </div>
                  )}
                </div>

                <div>
                  <label
                    className="text-xs text-slate-500 font-semibold"
                    htmlFor="telefoneEmergencia"
                  >
                    Telefone de emergência
                  </label>
                  <input
                    onInput={handlePhoneInput('telefoneEmergencia')}
                    placeholder="(61) 99999-9999"
                    inputMode="tel"
                    className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    type="tel"
                    name="telefoneEmergencia"
                    id="telefoneEmergencia"
                    aria-describedby="telEmergHelp"
                  />
                  {/* helper moved next to name label - remove duplicate under phone */}
                  {errors.telefoneEmergencia && (
                    <div className="text-xs text-red-600 mt-1">
                      {errors.telefoneEmergencia}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label
                    className="text-xs text-slate-500 font-semibold"
                    htmlFor="medicoResponsavel"
                  >
                    Médico responsável
                  </label>
                  <input
                    className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    type="text"
                    name="medicoResponsavel"
                    id="medicoResponsavel"
                  />
                </div>

                <div>
                  <label
                    className="text-xs text-slate-500 font-semibold"
                    htmlFor="telefoneMedico"
                  >
                    Telefone do médico
                  </label>
                  <input
                    onInput={handlePhoneInput('telefoneMedico')}
                    placeholder="(61) 99999-9999"
                    inputMode="tel"
                    className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                    type="tel"
                    name="telefoneMedico"
                    id="telefoneMedico"
                    aria-describedby="telMedHelp"
                  />
                  {errors.telefoneMedico && (
                    <div className="text-xs text-red-600 mt-1">
                      {errors.telefoneMedico}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
                <div>
                  <label className="text-xs text-slate-500 font-semibold">
                    Possui convênio?
                  </label>
                  <div className="mt-1 flex items-center gap-4">
                    <label className="inline-flex items-center gap-2">
                      <input
                        onChange={() => {
                          setHasConvenio(true);
                          setErrors((s) => {
                            const copy = { ...s };
                            delete copy.convenio;
                            return copy;
                          });
                        }}
                        type="radio"
                        name="convenio"
                        value="sim"
                        className="form-radio"
                      />
                      <span className="text-sm">Sim</span>
                    </label>

                    <label className="inline-flex items-center gap-2">
                      <input
                        onChange={() => {
                          setHasConvenio(false);
                        }}
                        type="radio"
                        name="convenio"
                        value="nao"
                        className="form-radio"
                        defaultChecked
                      />
                      <span className="text-sm">Não</span>
                    </label>
                  </div>
                </div>

                {hasConvenio && (
                  <div>
                    <label
                      className="text-xs text-slate-500 font-semibold"
                      htmlFor="convenioNome"
                    >
                      Nome do convênio (se aplicável)
                    </label>
                    <input
                      className="input mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                      type="text"
                      name="convenioNome"
                      id="convenioNome"
                    />
                  </div>
                )}
              </div>

              <fieldset className="border border-slate-300 rounded-lg p-4">
                <legend className="text-sm font-site text-slate-700 px-1">
                  Documentos
                </legend>
                <div>
                  <label
                    className="text-xs text-slate-500 font-semibold"
                    htmlFor="laudo"
                  >
                    Laudo PDF / JPG / PNG){' '}
                    <span className="text-orange-500">*</span>
                  </label>
                  <input
                    onChange={handleLaudoChange}
                    className="mt-1 w-full"
                    type="file"
                    name="laudo"
                    id="laudo"
                    accept="application/pdf,image/jpeg,image/png"
                    required
                  />
                  {laudoName && (
                    <div className="text-xs text-slate-500 mt-1">
                      Arquivo: {laudoName}
                    </div>
                  )}
                  {errors.laudo && (
                    <div className="text-xs text-red-600 mt-1">
                      {errors.laudo}
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <label
                    className="text-xs text-slate-500 font-semibold"
                    htmlFor="foto3x4"
                  >
                    Foto 3x4 (imagem) <span className="text-orange-500">*</span>
                  </label>
                  <input
                    onChange={handleFotoChange}
                    className="mt-1 w-full"
                    type="file"
                    name="foto3x4"
                    id="foto3x4"
                    accept="image/*"
                    required
                  />
                  {fotoPreview && (
                    <div className="mt-2 w-28 h-36 relative">
                      <Image
                        src={fotoPreview}
                        alt="Preview foto 3x4"
                        width={112}
                        height={144}
                        className="object-cover rounded"
                        unoptimized
                      />
                    </div>
                  )}
                  {errors.foto3x4 && (
                    <div className="text-xs text-red-600 mt-1">
                      {errors.foto3x4}
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <label
                    className="text-xs text-slate-500 font-semibold"
                    htmlFor="documento"
                  >
                    Documento (RG / CPF / CNH){' '}
                    <span className="text-orange-500">*</span>
                  </label>
                  <input
                    onChange={handleDocChange}
                    className="mt-1 w-full"
                    type="file"
                    name="documento"
                    id="documento"
                    accept="image/*,application/pdf"
                    required
                  />
                  {docName && (
                    <div className="text-xs text-slate-500 mt-1">
                      Arquivo: {docName}
                    </div>
                  )}
                  {errors.documento && (
                    <div className="text-xs text-red-600 mt-1">
                      {errors.documento}
                    </div>
                  )}
                </div>
              </fieldset>

              <div>
                <label
                  className="text-xs text-slate-500 font-semibold"
                  htmlFor="observacoes"
                >
                  Observações
                </label>
                <textarea
                  name="observacoes"
                  id="observacoes"
                  rows={4}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 resize-vertical"
                  placeholder="Informações adicionais que julgar relevantes"
                />
              </div>
            </div>

            <button
              className="btn-main w-full mt-6 bg-orange-500 text-white py-3 rounded hover:bg-orange-600 transition-colors font-semibold"
              type="submit"
              aria-disabled={status === 'sending'}
              disabled={status === 'sending'}
            >
              {status === 'sending' ? 'Enviando...' : 'Enviar cadastro'}
            </button>
            <Notification
              open={status === 'success' || status === 'error'}
              type={
                status === 'success'
                  ? 'success'
                  : status === 'error'
                  ? 'error'
                  : 'info'
              }
              message={message}
              onClose={() => {
                setStatus('idle');
                setMessage(null);
              }}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
