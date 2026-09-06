export const fontConsts = {
  appName: 'Contexta',
  techName: 'Powered by Contexta AI',
  tagline: 'Learn Beyond Answers. Powered by Context.',
  version: 'v0.1.0',
};

export const DEFAULT_AI_CONFIG = {
  mode: 'auto' as 'auto' | 'online' | 'offline',
  onlineModel: 'gemini-2.5-flash',
  offlineModel: 'gemma3:4b',
  temperature: 0.7,
  streaming: true,
  enableCitation: true,
};
