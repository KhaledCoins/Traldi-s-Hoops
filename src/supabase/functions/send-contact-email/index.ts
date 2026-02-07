// Supabase Edge Function para enviar email quando uma mensagem de contato é criada
// Esta função será chamada via Database Webhook/Trigger

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
const TO_EMAIL = 'traldishoops@gmail.com';

interface ContactPayload {
  type: 'INSERT';
  table: string;
  record: {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    created_at: string;
  };
}

serve(async (req) => {
  try {
    const payload: ContactPayload = await req.json();
    const { name, email, subject, message, created_at } = payload.record;

    // Se não tiver API key do Resend, apenas loga (modo desenvolvimento)
    if (!RESEND_API_KEY) {
      console.log('📧 Email seria enviado para:', TO_EMAIL);
      console.log('De:', name, email);
      console.log('Assunto:', subject);
      console.log('Mensagem:', message);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email logged (dev mode - no API key)' 
        }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Enviar email via Resend API
    const emailData = {
      from: 'Traldi\'s Hoops <noreply@traldishoops.com>',
      to: TO_EMAIL,
      reply_to: email,
      subject: `[Site] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #000; color: #fff; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">TRALDI'S HOOPS</h1>
            <p style="margin: 5px 0 0 0; color: #999;">Nova mensagem do site</p>
          </div>
          
          <div style="background: #f5f5f5; padding: 30px; border-left: 4px solid #000;">
            <h2 style="margin-top: 0; color: #000;">Contato via Site</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                <strong>Nome:</strong> ${name}
              </p>
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                <strong>Email:</strong> <a href="mailto:${email}">${email}</a>
              </p>
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                <strong>Assunto:</strong> ${subject}
              </p>
              <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">
                <strong>Data:</strong> ${new Date(created_at).toLocaleString('pt-BR')}
              </p>
            </div>
            
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #000;">Mensagem:</h3>
              <p style="color: #333; line-height: 1.6; white-space: pre-wrap;">${message}</p>
            </div>
            
            <p style="margin-top: 30px; font-size: 12px; color: #999;">
              Esta mensagem foi enviada através do formulário de contato do site TRALDI'S HOOPS.
              <br>
              Responda diretamente para o email do remetente: ${email}
            </p>
          </div>
        </div>
      `,
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(emailData),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Resend API error: ${error}`);
    }

    const result = await response.json();
    console.log('✅ Email enviado com sucesso:', result);

    return new Response(
      JSON.stringify({ success: true, emailId: result.id }),
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
});
