import React from 'react';

export default function LGPDPage() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 sm:px-8 bg-white">
      <h1 className="text-3xl font-site text-orange-500 mb-8 text-center">
        Termos de Uso e Privacidade de Dados (LGPD)
      </h1>

      <div className="text-slate-600 space-y-6 text-justify leading-relaxed">
        <p>
          A <strong>Apemigos - Associação de Pessoas com Esclerose Múltipla</strong> está comprometida com a proteção da sua privacidade e de seus dados pessoais. Em conformidade com a <strong>Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 - LGPD)</strong>, apresentamos a seguir como coletamos, utilizamos e protegemos as informações fornecidas por você ao se cadastrar para obter o Cartão da Pessoa com Esclerose Múltipla.
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8">1. Coleta de Dados</h2>
        <p>
          Para a emissão do Cartão da Pessoa com Esclerose Múltipla e para o cadastro em nossa associação, coletamos os seguintes dados pessoais:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Dados de Identificação:</strong> Nome completo, data de nascimento, RG, CPF.</li>
          <li><strong>Dados de Contato:</strong> Endereço completo, e-mail, telefone celular e telefone de emergência.</li>
          <li><strong>Dados de Saúde (Dados Sensíveis):</strong> Laudo médico (G35), nome do médico responsável, telefone do médico e informações sobre convênio de saúde.</li>
          <li><strong>Documentos:</strong> Cópia digitalizada de documento oficial com foto e foto 3x4.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-800 mt-8">2. Finalidade do Uso dos Dados</h2>
        <p>
          Os dados coletados têm como finalidade exclusiva:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Emissão do Cartão:</strong> Confeccionar e enviar o Cartão da Pessoa com Esclerose Múltipla, que serve como instrumento de identificação e acesso a direitos previstos em lei.</li>
          <li><strong>Cadastro Associativo:</strong> Manter um registro atualizado dos associados para comunicação sobre atividades, eventos, assembleias e benefícios da Apemigos.</li>
          <li><strong>Estatísticas:</strong> Gerar dados estatísticos anonimizados para fins de pesquisa e melhoria das políticas públicas voltadas para pessoas com Esclerose Múltipla.</li>
          <li><strong>Emergência:</strong> Utilizar os contatos de emergência e médicos apenas em situações de necessidade comprovada durante eventos ou atividades da associação.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-800 mt-8">3. Compartilhamento de Dados</h2>
        <p>
          A Apemigos <strong>não comercializa</strong> seus dados pessoais. O compartilhamento de informações ocorrerá apenas:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Quando exigido por lei ou por determinação judicial.</li>
          <li>Com prestadores de serviço estritamente necessários para a confecção e entrega do cartão (ex: gráficas e correios), mediante contrato de confidencialidade.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-800 mt-8">4. Armazenamento e Segurança</h2>
        <p>
          Seus dados serão armazenados em ambiente seguro, com controle de acesso restrito a pessoas autorizadas da diretoria e administração da Apemigos. Adotamos medidas técnicas e administrativas aptas a proteger os dados pessoais de acessos não autorizados e de situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão.
        </p>

        <h2 className="text-xl font-bold text-slate-800 mt-8">5. Seus Direitos</h2>
        <p>
          Conforme previsto no Art. 18 da LGPD, você tem direito a, a qualquer momento e mediante requisição:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Confirmar a existência de tratamento de seus dados.</li>
          <li>Acessar seus dados.</li>
          <li>Corrigir dados incompletos, inexatos ou desatualizados.</li>
          <li>Solicitar a anonimização, bloqueio ou eliminação de dados desnecessários, excessivos ou tratados em desconformidade com a lei.</li>
          <li>Revogar o seu consentimento.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-800 mt-8">6. Contato</h2>
        <p>
          Para exercer seus direitos ou esclarecer dúvidas sobre o tratamento de seus dados, entre em contato conosco através do e-mail: <a href="mailto:apemigos.em@gmail.com" className="text-orange-500 hover:underline">apemigos.em@gmail.com</a>.
        </p>

        <div className="mt-10 p-6 bg-slate-50 border border-slate-200 rounded-lg text-sm">
          <p>
            Ao prosseguir com o cadastro, você declara estar ciente e de acordo com os termos aqui apresentados, autorizando a Apemigos a realizar o tratamento dos seus dados pessoais para as finalidades descritas.
          </p>
        </div>
      </div>
    </div>
  );
}
