export type VolunteerData = {
  nome: string;
  sobrenome?: string;
  email: string;
  telefone?: string;
  endereco?: string;
  mensagem?: string;
};

export function buildVolunteerEmail(data: VolunteerData) {
  const { nome, sobrenome, email, telefone, endereco, mensagem } = data;

  const fullName = [nome, sobrenome].filter(Boolean).join(' ');

  const eFullName = escapeHtml(fullName);
  const eEmail = escapeHtml(email);
  const eTelefone = escapeHtml(telefone || '-');
  const eEndereco = escapeHtml(endereco || '-');
  const eMensagem = mensagem ? nl2br(escapeHtml(mensagem)) : '';

  // Minimal, robust HTML email with inline styles for good client compatibility
  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Contato - Apemigos</title>
  </head>
  <body style="margin:0;padding:0;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color:#f7fafc; color:#111827;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7fafc;padding:24px 0;">
      <tr>
        <td align="center">
          <table
            role="presentation"
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.08);"
          >
            <tr>
              <td style="padding:20px 28px;background:linear-gradient(90deg,#ffedd5,#fff7ed);">
                <h1 style="margin:0;font-size:20px;color:#c2410c">Novo contato</h1>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 28px;">
                <p style="margin:0 0 12px 0;">Olá equipe Apemigos,</p>
                <p style="margin:0 0 18px 0;">Uma nova mensagem foi enviada pelo site com os dados abaixo:</p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:18px;">
                  <tr>
                    <td style="padding:6px 0;font-weight:600;width:140px;color:#374151;">Nome</td>
                    <td style="padding:6px 0;color:#374151;">
                      ${eFullName}
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:6px 0;font-weight:600;color:#374151;">Email</td>
                    <td style="padding:6px 0;color:#374151;">
                      <a href="mailto:${eEmail}" style="color:#2563eb;text-decoration:none;">
                        ${eEmail}
                      </a>
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:6px 0;font-weight:600;color:#374151;">Telefone</td>
                    <td style="padding:6px 0;color:#374151;">
                      ${eTelefone}
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:6px 0;font-weight:600;color:#374151;">Endereço</td>
                    <td style="padding:6px 0;color:#374151;">
                      ${eEndereco}
                    </td>
                  </tr>
                </table>

                ${
                  eMensagem
                    ? `
                <div style="margin-bottom:18px;">
                  <div style="font-weight:600;color:#374151;margin-bottom:6px;">Mensagem</div>
                  <div style="color:#374151;font-size:14px;line-height:1.4;">${eMensagem}</div>
                </div>
                `
                    : ''
                }

                <p style="margin:0 0 8px 0;color:#374151;">Você pode responder a este contato pelo email acima ou gerenciar no painel administrativo.</p>

                <div style="margin-top:18px;padding:12px;border-radius:6px;background:#f8fafc;border:1px solid #e6edf3;color:#111827;font-size:13px;">
                  <strong>Observação:</strong> caso precise de mais informações, entre em contato diretamente com o remetente.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 28px;background:#f9fafb;border-top:1px solid #eef2f7;text-align:center;font-size:13px;color:#6b7280;">
                <div>Enviado por <strong>Avocado Desenvolvimento de Software</strong></div>
                <div style="margin-top:6px;color:#9ca3af;font-size:12px;">Apemigos • Associação de pessoas com Esclerose Múltipla</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export type AssociateData = {
  nome: string;
  sobrenome?: string;
  email: string;
  telefoneContato?: string;
  telefoneEmergencia?: string;
  medicoResponsavel?: string;
  telefoneMedico?: string;
  rg?: string;
  cpf?: string;
  dataNascimento?: string;
  convenioSaude?: string;
  convenioNome?: string;
  observacoes?: string;
  files?: {
    field: string;
    name: string;
    type?: string;
    size?: number;
    dataUrl?: string; // opcional, usado para imagens pequenas embutidas
  }[];
  // endereço (opcionais)
  logradouro?: string;
  cidade?: string;
  estado?: string;
  complemento?: string;
  cep?: string;
  // mantemos campos antigos por segurança (não utilizados em template, mas podem vir do formulário)
  bairro?: string;
  numero?: string;
  nomeContatoEmergencia?: string;
};

export function buildAssociateEmail(data: AssociateData) {
  const {
    nome,
    sobrenome,
    email,
    telefoneContato,
    telefoneEmergencia,
    medicoResponsavel,
    telefoneMedico,
    rg,
    cpf,
    dataNascimento,
    convenioSaude,
    convenioNome,
    observacoes,
    files,
    // address fields
    logradouro,
    cidade,
    estado,
    complemento,
    cep,
    nomeContatoEmergencia,
  } = data;

  // helper to normalize values: accept plain strings or DOM elements (extract .value)
  function normalizeVal(v: any): string {
    if (v === undefined || v === null) return '';
    // If it's an HTML input element (or other with 'value'), prefer its value
    if (typeof v === 'object') {
      try {
        if ('value' in v && typeof (v as any).value !== 'undefined') {
          const val = String((v as any).value).trim();
          if (!val || /^-+$/.test(val)) return '';
          if (/^\[object\s+/.test(val)) return '';
          return val;
        }
      } catch (e) {
        // fallback to string conversion
      }
      const s = String(v).trim();
      if (!s || /^-+$/.test(s)) return '';
      if (/^\[object\s+/.test(s)) return '';
      return s;
    }
    const s = String(v).trim();
    if (!s || /^-+$/.test(s)) return '';
    if (/^\[object\s+/.test(s)) return '';
    return s;
  }

  const fullName = [nome, sobrenome].filter(Boolean).join(' ');
  const eFullName = escapeHtml(fullName);
  const eEmail = escapeHtml(email || '-');
  const eTelefoneContato = escapeHtml(telefoneContato || '-');
  const eTelefoneEmergencia = escapeHtml(telefoneEmergencia || '-');
  const eMedico = escapeHtml(medicoResponsavel || '-');
  const eTelefoneMedico = escapeHtml(telefoneMedico || '-');
  const eRg = escapeHtml(rg || '-');
  const eCpf = escapeHtml(cpf || '-');
  const eDataNascimento = escapeHtml(dataNascimento || '-');
  const eConvenio = escapeHtml(convenioSaude || 'Não informado');
  const eConvenioNome = escapeHtml(convenioNome || '');
  // Preferir mostrar o nome do convênio quando disponível
  const eDisplayConvenio = eConvenioNome ? eConvenioNome : eConvenio;
  // Texto final para exibir: "Convênio <nome>" ou "Convênio Sim/Não"
  const displayConvenioLine = eDisplayConvenio
    ? `Convênio ${eDisplayConvenio}`
    : 'Convênio Não';
  const eObs = observacoes ? nl2br(escapeHtml(observacoes)) : '';
  // escaped address pieces
  const nLogradouro = normalizeVal(logradouro);
  const nComplemento = normalizeVal(complemento);
  const nCidade = normalizeVal(cidade);
  const nEstado = normalizeVal(estado);
  const nCep = normalizeVal(cep);
  const nNomeContatoEmergencia = normalizeVal(nomeContatoEmergencia);

  const eLogradouro = nLogradouro ? escapeHtml(nLogradouro) : '';
  const eComplemento = nComplemento ? escapeHtml(nComplemento) : '';
  const eCidade = nCidade ? escapeHtml(nCidade) : '';
  const eEstado = nEstado ? escapeHtml(nEstado) : '';
  const eCep = nCep ? escapeHtml(nCep) : '';
  const eNomeContatoEmergencia = nNomeContatoEmergencia
    ? escapeHtml(nNomeContatoEmergencia)
    : '';

  // Build address line from available parts, avoid showing '-' when some parts are missing
  const addressParts: string[] = [];
  // Prefer logradouro; fallback to complemento if logradouro is empty (some forms fill the field differently)
  let complementoAlreadyUsed = false;
  if (eLogradouro) {
    addressParts.push(eLogradouro);
  } else if (eComplemento) {
    // if no logradouro but complemento exists, treat complemento as main part
    addressParts.push(eComplemento);
    complementoAlreadyUsed = true;
  }
  // only add complemento again if it wasn't used as fallback
  if (eComplemento && !complementoAlreadyUsed) addressParts.push(eComplemento);
  if (eCidade) addressParts.push(eCidade);
  if (eEstado) addressParts.push(eEstado);
  let addressLine = addressParts.length ? addressParts.join(' • ') : '';
  if (eCep) {
    addressLine = addressLine ? `${addressLine} • CEP ${eCep}` : `CEP ${eCep}`;
  }
  // remove accidental leading separators or dashes
  addressLine = addressLine.replace(/^[\s\-•]+/, '');
  if (!addressLine) addressLine = '-';

  // Não exibir detalhes dos arquivos (nomes/tamanhos) — apenas indicar se houve anexos
  const hasFiles = (files || []).length > 0;

  return `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Associe-se - Apemigos</title>
  </head>
  <body style="margin:0;padding:0;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color:#f7fafc; color:#111827;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7fafc;padding:24px 0;">
      <tr>
        <td align="center">
          <table role="presentation" width="700" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.08);">
            <tr>
              <td style="padding:20px 28px;background:linear-gradient(90deg,#ffedd5,#fff7ed);">
                <h1 style="margin:0;font-size:20px;color:#c2410c">Nova solicitação</h1>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 28px;">
                <p style="margin:0 0 12px 0;">Um novo formulário de associação foi enviado com os dados abaixo:</p>

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:18px;">
                  <tr>
                    <td style="padding:6px 0;font-weight:600;width:180px;color:#374151;">Nome</td>
                    <td style="padding:6px 0;color:#374151;">${eFullName}</td>
                  </tr>

                  <tr>
                    <td style="padding:6px 0;font-weight:600;color:#374151;">Data de Nascimento</td>
                    <td style="padding:6px 0;color:#374151;">${eDataNascimento}</td>
                  </tr>

                  <tr>
                    <td style="padding:6px 0;font-weight:600;color:#374151;">CPF</td>
                    <td style="padding:6px 0;color:#374151;">${eCpf}</td>
                  </tr>

                  <tr>
                    <td style="padding:6px 0;font-weight:600;color:#374151;">RG</td>
                    <td style="padding:6px 0;color:#374151;">${eRg}</td>
                  </tr>

                  <tr>
                    <td style="padding:6px 0;font-weight:600;color:#374151;">Email</td>
                    <td style="padding:6px 0;color:#374151;"><a href="mailto:${eEmail}" style="color:#2563eb;text-decoration:none;">${eEmail}</a></td>
                  </tr>

                  <tr>
                    <td style="padding:6px 0;font-weight:600;color:#374151;">Telefone de contato</td>
                    <td style="padding:6px 0;color:#374151;">${eTelefoneContato}</td>
                  </tr>

                  <tr>
                    <td style="padding:6px 0;font-weight:600;color:#374151;">Telefone de emergência</td>
                    <td style="padding:6px 0;color:#374151;">${eTelefoneEmergencia}</td>
                  </tr>

                  ${
                    eNomeContatoEmergencia
                      ? `
                  <tr>
                    <td style="padding:6px 0;font-weight:600;color:#374151;">Contato de emergência</td>
                    <td style="padding:6px 0;color:#374151;">${eNomeContatoEmergencia}</td>
                  </tr>
                  `
                      : ''
                  }

                  <tr>
                    <td style="padding:6px 0;font-weight:600;color:#374151;">Médico responsável</td>
                    <td style="padding:6px 0;color:#374151;">${eMedico}</td>
                  </tr>

                  <tr>
                    <td style="padding:6px 0;font-weight:600;color:#374151;">Telefone do médico</td>
                    <td style="padding:6px 0;color:#374151;">${eTelefoneMedico}</td>
                  </tr>

                  <tr>
                    <td colspan="2" style="padding:6px 0;color:#374151;font-weight:600;">${escapeHtml(
                      displayConvenioLine
                    )}</td>
                  </tr>

                  <tr>
                    <td style="padding:6px 0;font-weight:600;color:#374151;">Endereço</td>
                    <td style="padding:6px 0;color:#374151;">${addressLine}</td>
                  </tr>

                  ${
                    eObs
                      ? `
                  <tr>
                    <td style="padding:6px 0;font-weight:600;color:#374151;vertical-align:top;">Observações</td>
                    <td style="padding:6px 0;color:#374151;">${eObs}</td>
                  </tr>
                  `
                      : ''
                  }
                </table>

                ${
                  hasFiles
                    ? `<div style="margin-bottom:12px;color:#374151;font-size:14px;">Arquivos anexados: Laudo G35, Foto 3x4 e Documento.</div>`
                    : ''
                }

                <div style="margin-top:18px;padding:12px;border-radius:6px;background:#f8fafc;border:1px solid #e6edf3;color:#111827;font-size:13px;">
                  <strong>Observação:</strong> arquivos pequenos de imagem (3x4) são embutidos no email quando possível.
                </div>
              </td>
            </tr>

            <tr>
              <td style="padding:16px 28px;background:#f9fafb;border-top:1px solid #eef2f7;text-align:center;font-size:13px;color:#6b7280;">
                <div>Enviado por <strong>Avocado Desenvolvimento de Software</strong></div>
                <div style="margin-top:6px;color:#9ca3af;font-size:12px;">Apemigos • Associação de pessoas com Esclerose Múltipla</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function escapeHtml(str: string | undefined | null) {
  if (str === undefined || str === null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function nl2br(s: string) {
  return String(s).replace(/\r?\n/g, '<br/>');
}
