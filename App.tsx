
import React, { useState, useEffect } from 'react';
import { Tab, BotConfig, Message, KnowledgeFile } from './types';
import Dashboard from './components/Dashboard';
import Simulator from './components/Simulator';
import KnowledgeBase from './components/KnowledgeBase';
import Settings from './components/Settings';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.DASHBOARD);
  const [config, setConfig] = useState<BotConfig>({
    model: 'gemini-3-flash-preview',
    prompt: 'Você é um assistente virtual prestativo para uma empresa no WhatsApp. Responda de forma educada, curta e direta. Use emojis ocasionalmente. Se receber áudio, responda de acordo com o que ouviu.',
    isActive: true,
    replyDelay: 2,
    voiceResponse: false
  });
  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeFile[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);

  const navItems = [
    { id: Tab.DASHBOARD, label: 'Início', icon: 'fa-house' },
    { id: Tab.SIMULATOR, label: 'Simular', icon: 'fa-comments' },
    { id: Tab.KNOWLEDGE, label: 'Arquivos', icon: 'fa-file-lines' },
    { id: Tab.SETTINGS, label: 'Ajustes', icon: 'fa-gear' },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-white overflow-hidden relative border-x border-gray-200 shadow-2xl">
      <header className="bg-[#075e54] text-white p-4 pt-10 flex justify-between items-center z-10">
        <h1 className="text-xl font-bold tracking-tight">Narrativa Artificial</h1>
        <div className="flex gap-4">
          <i className="fa-solid fa-magnifying-glass opacity-80"></i>
          <i className="fa-solid fa-ellipsis-vertical opacity-80"></i>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-[#f0f2f5] pb-20">
        {activeTab === Tab.DASHBOARD && <Dashboard config={config} setConfig={setConfig} messages={messages} />}
        {activeTab === Tab.SIMULATOR && <Simulator config={config} knowledgeBase={knowledgeBase} messages={messages} setMessages={setMessages} />}
        {activeTab === Tab.KNOWLEDGE && <KnowledgeBase files={knowledgeBase} setFiles={setKnowledgeBase} />}
        {activeTab === Tab.SETTINGS && <Settings config={config} setConfig={setConfig} />}
      </main>

      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3 safe-area-bottom z-10">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 transition-colors ${activeTab === item.id ? 'text-[#128c7e]' : 'text-gray-500'}`}
          >
            <i className={`fa-solid ${item.icon} text-lg`}></i>
            <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default App;