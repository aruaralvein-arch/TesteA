
import { GoogleGenAI, GenerateContentResponse, Part, Modality } from "@google/genai";
import { BotConfig, KnowledgeFile } from "../types";

// Utilitários para processamento de áudio PCM (conforme diretrizes Google GenAI)
export function decodeBase64(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export class GeminiService {
  async generateAutoReply(
    userMessage: string,
    config: BotConfig,
    attachment?: { base64: string; mimeType: string },
    knowledgeBase: KnowledgeFile[] = []
  ): Promise<{ text: string; audioBlob?: Blob }> {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const parts: Part[] = [];

      parts.push({ text: `SYSTEM_INSTRUCTION: ${config.prompt}` });

      if (knowledgeBase.length > 0) {
        knowledgeBase.forEach(file => {
          parts.push({ inlineData: { data: file.base64, mimeType: file.mimeType } });
          parts.push({ text: `[Contexto extraído do arquivo: ${file.name}]` });
        });
      }

      if (attachment) {
        parts.push({ inlineData: { data: attachment.base64, mimeType: attachment.mimeType } });
      }

      parts.push({ text: userMessage || "Analise o arquivo acima e responda adequadamente." });

      const modelName = config.voiceResponse ? 'gemini-2.5-flash-preview-tts' : config.model;

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: modelName,
        contents: { parts },
        config: {
          temperature: 0.8,
          responseModalities: config.voiceResponse ? [Modality.AUDIO] : undefined,
          speechConfig: config.voiceResponse ? {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
          } : undefined
        }
      });

      let text = "";
      let audioBlob: Blob | undefined = undefined;

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.text) text += part.text;
          if (part.inlineData?.data) {
            // O áudio vem em PCM puro (raw), precisamos converter para algo tocável via Blob/WAV no browser
            // Para simplicidade no simulador web, convertemos a base64 em Blob de áudio
            const audioData = decodeBase64(part.inlineData.data);
            audioBlob = new Blob([audioData], { type: 'audio/pcm' });
          }
        }
      }

      return { text: text || "Processado.", audioBlob };
    } catch (error: any) {
      console.error("OpenSource Gemini Engine Error:", error);
      return { text: "⚠️ Erro na API. Verifique sua chave nos Ajustes." };
    }
  }
}

export const geminiService = new GeminiService();
