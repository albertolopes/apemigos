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

function escapeHtml(str: string | undefined | null) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function nl2br(s: string) {
  return s.replace(/\r?\n/g, '<br/>');
}
