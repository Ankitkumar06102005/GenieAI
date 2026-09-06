import { useState } from 'react';
import { DEFAULT_AI_CONFIG } from '../constants';

export function useAiConfig() {
  const [mode, setMode] = useState<'auto' | 'online' | 'offline'>(DEFAULT_AI_CONFIG.mode);
  const [onlineModel, setOnlineModel] = useState<string>(DEFAULT_AI_CONFIG.onlineModel);
  const [offlineModel, setOfflineModel] = useState<string>(DEFAULT_AI_CONFIG.offlineModel);
  const [temperature, setTemperature] = useState<number>(DEFAULT_AI_CONFIG.temperature);
  const [streaming, setStreaming] = useState<boolean>(DEFAULT_AI_CONFIG.streaming);
  const [enableCitation, setEnableCitation] = useState<boolean>(DEFAULT_AI_CONFIG.enableCitation);

  return {
    mode,
    setMode,
    onlineModel,
    setOnlineModel,
    offlineModel,
    setOfflineModel,
    temperature,
    setTemperature,
    streaming,
    setStreaming,
    enableCitation,
    setEnableCitation,
  };
}
