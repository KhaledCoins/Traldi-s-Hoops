import React, { useState } from 'react';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Mail, MapPin, Send, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { Phone } from 'lucide-react';
import { useContactForm } from '../hooks/useContactForm';
import { isSupabaseConfigured } from '../lib/supabase';
import { motion, AnimatePresence } from 'motion/react';

export function Contato() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const { sendMessage, loading, error, success, reset } = useContactForm();
  const supabaseConfigured = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await sendMessage(formData);
      
      // Limpar formulário após sucesso
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });

      // Auto-reset do sucesso após 5 segundos
      setTimeout(() => {
        reset();
      }, 5000);
      
    } catch (err) {
      // Erro já tratado pelo hook
      console.error('Erro ao enviar:', err);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'traldishoops@gmail.com',
      link: 'mailto:traldishoops@gmail.com'
    },
    {
      icon: Phone,
      title: 'Telefone',
      content: '+55 (12) 98151-7649',
      link: 'tel:+5512981517649'
    },
    {
      icon: MapPin,
      title: 'Localização',
      content: 'São José dos Campos, SP',
      link: null
    }
  ];

  const reasons = [
    'Dúvidas sobre eventos',
    'Parcerias e patrocínios',
    'Imprensa',
    'Levar o sistema para minha cidade',
    'Outro assunto'
  ];

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container-main">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-white mb-6">Contato</h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            Tire suas dúvidas, proponha parcerias ou traga o Traldi's Hoops 
            para sua cidade.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div>
            <Card className="p-8">
              <h3 className="text-white mb-6">Envie uma mensagem</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <Input
                  label="Nome"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />

                <Input
                  label="E-mail"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />

                <div>
                  <label className="input-label">Assunto</label>
                  <select
                    className="input-text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  >
                    <option value="">Selecione um assunto</option>
                    {reasons.map((reason, index) => (
                      <option key={index} value={reason}>
                        {reason}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="input-label">Mensagem</label>
                  <textarea
                    className="input-text min-h-[150px] resize-y"
                    placeholder="Descreva sua mensagem..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                  />
                </div>

                <Button 
                  type="submit"
                  variant="accent" 
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Enviar mensagem
                    </>
                  )}
                </Button>
              </form>

              {/* Feedback Messages */}
              <AnimatePresence mode="wait">
                {success && (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 p-4 bg-green-500/10 border-2 border-green-500 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-green-500 font-semibold mb-1">
                          Mensagem enviada com sucesso!
                        </p>
                        <p className="text-green-400 text-sm">
                          Recebemos sua mensagem e responderemos em até 48 horas úteis 
                          para o email <strong>{formData.email || 'fornecido'}</strong>.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {error && (
                  <motion.div
                    key="error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-6 p-4 bg-red-500/10 border-2 border-red-500 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-red-500 font-semibold mb-1">
                          Erro ao enviar mensagem
                        </p>
                        <p className="text-red-400 text-sm">
                          {error}
                        </p>
                        <button
                          onClick={reset}
                          className="text-red-400 text-xs underline mt-2 hover:text-red-300"
                        >
                          Tentar novamente
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <div className="space-y-4">
              {contactInfo.map((method, index) => {
                const Icon = method.icon;
                return (
                  <Card key={index} className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-black" />
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-500 text-sm mb-1">{method.title}</div>
                        {method.link ? (
                          <a
                            href={method.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white font-semibold hover:text-gray-300 transition-colors"
                          >
                            {method.content}
                          </a>
                        ) : (
                          <div className="text-white font-semibold">{method.content}</div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>

            {/* FAQ */}
            <Card className="p-8">
              <h4 className="text-white mb-4">Perguntas frequentes</h4>
              
              <div className="space-y-4">
                <div>
                  <h5 className="text-white mb-2 text-sm">Como participar dos eventos?</h5>
                  <p className="text-gray-400 text-sm">
                    Acesse a página de Eventos, escolha um evento ativo e faça o check-in 
                    presencial via QR Code.
                  </p>
                </div>

                <div>
                  <h5 className="text-white mb-2 text-sm">Como ser parceiro?</h5>
                  <p className="text-gray-400 text-sm">
                    Entre em contato conosco descrevendo seu interesse. Temos diferentes 
                    pacotes de parceria.
                  </p>
                </div>

                <div>
                  <h5 className="text-white mb-2 text-sm">Posso levar para minha cidade?</h5>
                  <p className="text-gray-400 text-sm">
                    Sim! Estamos abertos a expandir o projeto. Entre em contato para conversarmos.
                  </p>
                </div>
              </div>
            </Card>

            {/* Response Time */}
            <Card className="p-6 bg-gray-900 border-gray-700">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-2 h-2 bg-green-500 rounded-full mt-2" />
                <div>
                  <p className="text-white font-semibold mb-1">Tempo de resposta</p>
                  <p className="text-gray-400 text-sm">
                    Respondemos todas as mensagens em até 48 horas úteis.
                  </p>
                </div>
              </div>
            </Card>

            {/* Email Info */}
            <Card className="p-6 bg-blue-500/5 border-blue-500/30">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-blue-400 font-semibold mb-1">Mensagem salva com segurança</p>
                  <p className="text-blue-300/70 text-sm">
                    Sua mensagem é enviada diretamente para nossa equipe em{' '}
                    <strong className="text-blue-400">traldishoops@gmail.com</strong> e 
                    armazenada de forma segura em nosso sistema.
                  </p>
                </div>
              </div>
            </Card>

            {/* Supabase Info */}
            {!supabaseConfigured && (
              <Card className="p-6 bg-red-500/5 border-red-500/30">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-red-400 font-semibold mb-1">Configuração do Supabase</p>
                    <p className="text-red-300/70 text-sm">
                      A configuração do Supabase não está completa. Por favor, verifique as configurações para garantir que o sistema de contato funcione corretamente.
                    </p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}