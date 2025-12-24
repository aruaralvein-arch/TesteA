
export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  attachment?: {
    type: 'image' | 'pdf' | 'audio';
    url: string;
    name: string;
    base64?: string;
    mimeType?: string;
  };
  audioUrl?: string; // Para respostas puramente em áudio do bot
}

export interface BotConfig {
  model: string;
  prompt: string;
  isActive: boolean;
  replyDelay: number;
  voiceResponse: boolean; // Nova opção
}

export interface KnowledgeFile {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'audio';
  base64: string;
  mimeType: string;
}

export enum Tab {
  DASHBOARD = 'dashboard',
  SIMULATOR = 'simulator',
  KNOWLEDGE = 'knowledge',
  SETTINGS = 'settings'
}