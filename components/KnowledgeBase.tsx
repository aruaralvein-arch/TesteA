
import React, { useRef } from 'react';
import { KnowledgeFile } from '../types';

interface KnowledgeBaseProps {
  files: KnowledgeFile[];
  setFiles: React.Dispatch<React.SetStateAction<KnowledgeFile[]>>;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ files, setFiles }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    Array.from(uploadedFiles).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        let type: 'image' | 'pdf' | 'audio' = 'image';
        
        if (file.type.includes('pdf')) type = 'pdf';
        else if (file.type.includes('audio')) type = 'audio';

        const newFile: KnowledgeFile = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          type: type,
          base64,
          mimeType: file.type
        };
        setFiles(prev => [...prev, newFile]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = '';
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div className="p-4 space-y-4 animate-fadeIn">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
        <div className="w-16 h-16 bg-[#e7f3ff] rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
          <i className="fa-solid fa-brain text-2xl"></i>
        </div>
        <h2 className="text-lg font-bold text-gray-800">Cérebro do Bot</h2>
        <p className="text-xs text-gray-500 mb-6 px-4 leading-relaxed">
          Arquivos de áudio, imagens e PDFs carregados aqui servem como a memória de longo prazo do seu assistente.
        </p>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          multiple 
          className="hidden" 
          accept="image/*,application/pdf,audio/*"
          onChange={handleFileUpload}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="bg-[#128c7e] text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
        >
          Carregar Conhecimento
        </button>
      </div>

      <div className="space-y-3">
        <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] px-2">
          Memória Atual ({files.length})
        </h3>
        
        {files.length === 0 ? (
          <div className="text-center py-16 text-gray-300 bg-white rounded-3xl border border-gray-100">
            <i className="fa-solid fa-folder-open text-4xl mb-4 opacity-20"></i>
            <p className="text-xs font-medium uppercase tracking-widest">Sem arquivos carregados</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2">
            {files.map(file => (
              <div key={file.id} className="bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-100 shadow-sm hover:border-blue-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    file.type === 'pdf' ? 'bg-red-50 text-red-500' : 
                    file.type === 'audio' ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-blue-500'
                  }`}>
                    <i className={`fa-solid ${
                      file.type === 'pdf' ? 'fa-file-pdf' : 
                      file.type === 'audio' ? 'fa-microphone' : 'fa-image'
                    } text-lg`}></i>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-sm font-bold text-gray-700 truncate max-w-[180px]">{file.name}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-black">{file.type} • Referência</p>
                  </div>
                </div>
                <button 
                  onClick={() => removeFile(file.id)}
                  className="w-10 h-10 flex items-center justify-center text-gray-200 hover:text-red-500 transition-colors"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default KnowledgeBase;
