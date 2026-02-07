import { useState } from 'react';
import { supabase, isSupabaseConfigured, type ContactMessage } from '../lib/supabase';

export function useContactForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const sendMessage = async (data: Omit<ContactMessage, 'id' | 'created_at' | 'read'>) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validação básica
      if (!data.name || !data.email || !data.subject || !data.message) {
        throw new Error('Todos os campos são obrigatórios');
      }

      // Validar email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        throw new Error('Email inválido');
      }

      // Verificar se o Supabase está configurado
      if (!isSupabaseConfigured() || !supabase) {
        console.warn('⚠️ Supabase não configurado. Mostrando preview da mensagem:');
        console.log('📧 Mensagem que seria enviada para traldishoops@gmail.com:');
        console.log('Nome:', data.name);
        console.log('Email:', data.email);
        console.log('Assunto:', data.subject);
        console.log('Mensagem:', data.message);
        console.log('\n👉 Configure as variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY');
        
        // Simular sucesso em modo demo
        setSuccess(true);
        return { ...data, id: 'demo-' + Date.now() };
      }

      // Inserir no Supabase
      const { data: result, error: supabaseError } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
          }
        ])
        .select()
        .single();

      if (supabaseError) {
        console.error('Erro do Supabase:', supabaseError);
        throw new Error('Erro ao enviar mensagem. Tente novamente.');
      }

      console.log('✅ Mensagem salva no Supabase:', result);
      
      // O Database Webhook do Supabase vai disparar automaticamente
      // a Edge Function para enviar o email para traldishoops@gmail.com
      
      setSuccess(true);
      return result;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido';
      setError(errorMessage);
      console.error('❌ Erro ao enviar mensagem:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setError(null);
    setSuccess(false);
  };

  return {
    sendMessage,
    loading,
    error,
    success,
    reset,
  };
}