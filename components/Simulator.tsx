
import React, { useState, useRef, useEffect } from 'react';
import { Message, BotConfig, KnowledgeFile } from '../types';
import { geminiService } from '../services/geminiService';

interface SimulatorProps {
  config: BotConfig;
  knowledgeBase: KnowledgeFile[];
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

const Simulator: React.FC<SimulatorProps> = ({ config, knowledgeBase, messages, setMessages }) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [pendingFile, setPendingFile] = useState<{ base64: string; mimeType: string; name: string } | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = (reader.result as string).split(',')[1];
          setPendingFile({ base64, mimeType: 'audio/webm', name: `Voz_${Date.now()}.webm` });
        };
        reader.readAsDataURL(blob);
        stream.getTracks().forEach(t => t.stop());
      };
      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (err) { alert("Permissão de áudio negada."); }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const handleSend = async () => {
    if (!inputText.trim() && !pendingFile) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputText,
      timestamp: new Date(),
      attachment: pendingFile ? {
        type: pendingFile.mimeType.includes('audio') ? 'audio' : pendingFile.mimeType.includes('pdf') ? 'pdf' : 'image',
        url: `data:${pendingFile.mimeType};base64,${pendingFile.base64}`,
        name: pendingFile.name,
        base64: pendingFile.base64,
        mimeType: pendingFile.mimeType
      } : undefined
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setPendingFile(null);

    if (config.isActive) {
      setIsTyping(true);
      const result = await geminiService.generateAutoReply(
        userMsg.text,
        config,
        userMsg.attachment ? { base64: userMsg.attachment.base64!, mimeType: userMsg.attachment.mimeType! } : undefined,
        knowledgeBase
      );

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: result.text,
        timestamp: new Date(),
        audioUrl: result.audioBlob ? URL.createObjectURL(result.audioBlob) : undefined
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#efe7de] relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-3 z-1">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-3 rounded-xl shadow-sm relative ${msg.sender === 'user' ? 'bg-[#dcf8c6] rounded-tr-none' : 'bg-white rounded-tl-none'}`}>
              {msg.attachment?.type === 'image' && <img src={msg.attachment.url} className="rounded-lg mb-2 max-h-60 w-full object-cover" />}
              {msg.attachment?.type === 'pdf' && <div className="p-3 bg-red-50 rounded-lg flex items-center gap-2 text-red-700 mb-2"><i className="fa-solid fa-file-pdf"></i><span className="text-xs truncate">{msg.attachment.name}</span></div>}
              {msg.attachment?.type === 'audio' && <audio controls src={msg.attachment.url} className="w-full h-8 mb-2" />}
              {msg.audioUrl && (
                <div className="flex items-center gap-2 mb-2 p-2 bg-blue-50 rounded-lg">
                  <i className="fa-solid fa-play-circle text-blue-500 text-xl cursor-pointer"></i>
                  <audio controls src={msg.audioUrl} className="w-full h-8" />
                </div>
              )}
              <p className="text-[14.5px] text-gray-800 leading-relaxed pr-8">{msg.text}</p>
              <span className="text-[10px] text-gray-400 absolute bottom-1 right-2">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        ))}
        {isTyping && <div className="text-[11px] text-gray-500 italic bg-white/50 w-fit px-3 py-1 rounded-full animate-pulse">Bot está pensando...</div>}
        <div ref={chatEndRef} />
      </div>

      <div className="p-3 bg-[#f0f2f5] border-t border-gray-200">
        <div className="flex items-center gap-2">
          <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-[#075e54]"><i className="fa-solid fa-plus text-xl"></i></button>
          <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const r = new FileReader();
              r.onload = () => setPendingFile({ base64: (r.result as string).split(',')[1], mimeType: file.type, name: file.name });
              r.readAsDataURL(file);
            }
          }} />
          <div className="flex-1 bg-white rounded-full px-4 py-2 shadow-inner">
            <input 
              className="w-full bg-transparent outline-none text-sm" 
              placeholder="Mensagem"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
          </div>
          {inputText || pendingFile ? (
            <button onClick={handleSend} className="w-12 h-12 bg-[#128c7e] text-white rounded-full flex items-center justify-center shadow-lg"><i className="fa-solid fa-paper-plane"></i></button>
          ) : (
            <button 
              onMouseDown={startRecording} onMouseUp={stopRecording}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${isRecording ? 'bg-red-500 animate-bounce' : 'bg-[#128c7e]'}`}
            >
              <i className={`fa-solid ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulator;
