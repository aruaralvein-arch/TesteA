
import React from 'react';
import { BotConfig, Message } from '../types';

interface DashboardProps {
  config: BotConfig;
  setConfig: React.Dispatch<React.SetStateAction<BotConfig>>;
  messages: Message[];
}

const Dashboard: React.FC<DashboardProps> = ({ config, setConfig, messages }) => {
  const botReplies = messages.filter(m => m.sender === 'bot');
  const totalReplies = botReplies.length;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Narrativa Artificial - Meu Bot Gemini',
        text: 'Confira meu assistente inteligente de WhatsApp!',
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado! Abra em uma nova aba para instalar.');
    }
  };

  const showInstallInstructions = () => {
    alert(
      "PASSO A PASSO PARA INSTALAR:\n\n" +
      "1. Clique no ícone de 'Nova Aba' (seta no topo direito) para sair do editor.\n" +
      "2. Na página limpa, clique nos 3 pontos do Chrome.\n" +
      "3. Selecione 'Instalar Aplicativo'.\n\n" +
      "Isso garantirá que o ícone do App apareça corretamente sem o Google AI Studio."
    );
  };

  return (
    <div className="p-4 space-y-4 animate-fadeIn">
      {/* Bot Status Card */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${config.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <div>
              <h2 className="text-lg font-bold text-gray-800">Serviço Auto</h2>
              <p className="text-[11px] text-gray-500 uppercase tracking-widest font-bold">
                {config.isActive ? 'Monitorando Notificações' : 'Serviço Pausado'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setConfig(prev => ({ ...prev, isActive: !prev.isActive }))}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              config.isActive ? 'bg-[#25d366]' : 'bg-gray-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${config.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-[#e7f3ff] p-4 rounded-xl border border-blue-100">
            <p className="text-[10px] font-bold text-blue-600 uppercase mb-1">Respondidas</p>
            <p className="text-2xl font-black text-blue-900">{totalReplies}</p>
          </div>
          <div className="bg-[#f0fff4] p-4 rounded-xl border border-green-100">
            <p className="text-[10px] font-bold text-green-600 uppercase mb-1">IA Ativa</p>
            <p className="text-sm font-bold text-green-900 truncate">GEMINI FLASH</p>
          </div>
        </div>
      </div>

      {/* Quick Access Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={handleShare}
          className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-center gap-2 text-gray-700 text-xs font-bold active:scale-95 transition-transform"
        >
          <i className="fa-solid fa-share-nodes text-[#128c7e]"></i>
          Compartilhar Link
        </button>
        <button 
          onClick={showInstallInstructions}
          className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-center gap-2 text-gray-700 text-xs font-bold active:scale-95 transition-transform"
        >
          <i className="fa-brands fa-android text-[#3ddc84]"></i>
          Instalar App
        </button>
      </div>

      {/* Activity Log */}
      <div className="space-y-2">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2">Logs de Automação</h3>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {botReplies.length === 0 ? (
            <div className="p-10 text-center">
              <i className="fa-solid fa-robot text-gray-200 text-4xl mb-3"></i>
              <p className="text-xs text-gray-400">Aguardando primeira interação...</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {botReplies.slice(-3).reverse().map((log, i) => (
                <div key={i} className="p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                  <div className="bg-green-100 text-green-600 w-8 h-8 rounded-full flex items-center justify-center shrink-0">
                    <i className="fa-brands fa-whatsapp text-sm"></i>
                  </div>
                  <div className="overflow-hidden flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="text-[11px] font-bold text-gray-700">Resposta Enviada</span>
                      <span className="text-[9px] text-gray-400">{log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-[10px] text-gray-500 truncate italic">"{log.text}"</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Important Instruction Alert */}
      <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl">
        <h4 className="text-amber-800 text-xs font-bold flex items-center gap-2 mb-1">
          <i className="fa-solid fa-circle-info"></i> Dica de Instalação
        </h4>
        <p className="text-[10px] text-amber-700 leading-tight">
          Para que o ícone do App não seja o do "Google AI Studio", use o botão <strong>"Abrir em nova aba"</strong> no topo direito da tela de visualização antes de instalar.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
