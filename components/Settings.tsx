
import React from 'react';
import { BotConfig } from '../types';

interface SettingsProps {
  config: BotConfig;
  setConfig: React.Dispatch<React.SetStateAction<BotConfig>>;
}

const Settings: React.FC<SettingsProps> = ({ config, setConfig }) => {
  const handleSelectKey = async () => {
    // @ts-ignore
    if (window.aistudio?.openSelectKey) await window.aistudio.openSelectKey();
    else alert("Ambiente de desenvolvimento detectado. Certifique-se de que a API_KEY está configurada.");
  };

  return (
    <div className="p-4 space-y-6 pb-24">
      <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xs font-black text-[#128c7e] uppercase tracking-widest mb-4 flex items-center gap-2">
          <i className="fa-solid fa-code"></i> Projeto Open Source
        </h3>
        <p className="text-xs text-gray-600 mb-4 leading-relaxed">
          Este é um projeto de código aberto sob licença MIT. Você pode clonar, modificar e usar comercialmente.
        </p>
        <div className="flex gap-2">
          <a href="#" className="flex-1 py-2 bg-gray-900 text-white rounded-xl text-[10px] font-bold uppercase text-center flex items-center justify-center gap-2">
            <i className="fa-brands fa-github text-sm"></i> GitHub Repo
          </a>
          <a href="#" className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-bold uppercase text-center flex items-center justify-center gap-2">
            <i className="fa-solid fa-book text-sm"></i> Wiki
          </a>
        </div>
      </section>

      <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Acesso à API</h3>
        <button onClick={handleSelectKey} className="w-full py-3 bg-[#075e54] text-white rounded-xl font-bold text-xs uppercase shadow-md active:scale-95 transition-transform">
          Configurar Chave Google
        </button>
        <p className="text-[10px] text-gray-400 mt-3 text-center">
          Chave armazenada de forma segura em <code className="bg-gray-100 px-1 rounded">process.env.API_KEY</code>
        </p>
      </section>

      <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Comportamento da IA</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-700">Respostas em Áudio (TTS)</span>
            <button 
              onClick={() => setConfig(prev => ({ ...prev, voiceResponse: !prev.voiceResponse }))}
              className={`w-12 h-6 rounded-full transition-colors relative ${config.voiceResponse ? 'bg-[#128c7e]' : 'bg-gray-300'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${config.voiceResponse ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          <textarea
            className="w-full h-32 p-3 bg-gray-50 rounded-xl text-xs border-none focus:ring-1 focus:ring-[#128c7e]"
            value={config.prompt}
            onChange={(e) => setConfig(prev => ({ ...prev, prompt: e.target.value }))}
            placeholder="System Instructions..."
          />
        </div>
      </section>

      <div className="text-center opacity-30 py-4">
        <p className="text-[9px] font-bold uppercase tracking-widest">Narrativa Artificial Open Source v1.6.5</p>
      </div>
    </div>
  );
};

export default Settings;
