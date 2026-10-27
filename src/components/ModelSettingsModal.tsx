import React, { useState, useEffect } from 'react';
import { X, Cpu, CheckCircle2, AlertCircle, RefreshCw, Server, ShieldAlert, ExternalLink, HelpCircle } from 'lucide-react';
import { ModelSettingsState } from '../types/archive';

interface ModelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelSettingsModal: React.FC<ModelSettingsModalProps> = ({ isOpen, onClose }) => {
  const [provider, setProvider] = useState<'google_ai_studio' | 'ollama_local' | 'huggingface' | 'custom_endpoint'>('google_ai_studio');
  const [modelId, setModelId] = useState('google/gemma-2-9b-it');
  const [endpointUrl, setEndpointUrl] = useState('https://api-inference.huggingface.co/models/google/gemma-2-9b-it');
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [lastTestedAt, setLastTestedAt] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    fetch('/api/model/status')
      .then(res => res.json())
      .then(data => {
        if (data.provider) setProvider(data.provider);
        if (data.modelId) setModelId(data.modelId);
        if (data.endpointUrl) setEndpointUrl(data.endpointUrl);
        setIsConnected(data.isConnected);
        setLatencyMs(data.latencyMs);
        setLastTestedAt(data.lastTestedAt);
        setErrorMsg(data.error);
      })
      .catch(() => {
        setIsConnected(false);
        setErrorMsg('Failed to query server model status.');
      });
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/model/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      setIsConnected(data.isConnected);
      setLatencyMs(data.latencyMs);
      setLastTestedAt(new Date().toISOString());

      if (!data.success) {
        setErrorMsg(data.error || 'Connection test failed.');
      }
    } catch (err: any) {
      setIsConnected(false);
      setErrorMsg(err?.message || 'Network error reaching inference test route.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/model/configure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, modelId, endpointUrl })
      });
      setIsConnected(null);
      setErrorMsg(null);
      alert('Configuration saved. Run "Test Connection" to verify endpoint response.');
    } catch (err: any) {
      setErrorMsg('Failed to save configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleClearConfig = () => {
    setEndpointUrl('');
    setModelId('google/gemma-2-9b-it');
    setIsConnected(false);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#0f0b21] border border-[#956BFF]/60 rounded-2xl shadow-2xl p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1 text-[#A8A4B8] hover:text-white transition-colors"
          aria-label="Close settings"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-lg bg-[#17102E] border border-[#30215B] text-[#75D8FF]">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-display text-[#ECEAF5]">
              OPEN-WEIGHT MODEL SETTINGS
            </h2>
            <p className="text-xs text-[#A8A4B8] font-mono">
              Modular Gemma 2 Inference Engine Architecture
            </p>
          </div>
        </div>

        {/* Real Status Banner */}
        <div
          className={`p-4 rounded-xl border mb-6 flex items-start justify-between gap-4 ${
            isConnected === true
              ? 'bg-emerald-950/40 border-emerald-500/40'
              : isConnected === false
              ? 'bg-red-950/40 border-red-500/40'
              : 'bg-[#17102E] border-[#30215B]'
          }`}
        >
          <div className="flex items-start gap-3">
            {isConnected === true ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : isConnected === false ? (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            ) : (
              <Server className="w-5 h-5 text-[#956BFF] shrink-0 mt-0.5" />
            )}
            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#ECEAF5]">
                {isConnected === true
                  ? 'MODEL CONNECTED & VERIFIED'
                  : isConnected === false
                  ? 'MODEL NOT CONNECTED — Sample cases remain available.'
                  : 'STATUS UNVERIFIED — Run Connection Test'}
              </div>
              <div className="text-xs text-[#A8A4B8] mt-1">
                {isConnected === true && latencyMs && (
                  <span>Round-trip latency: <strong className="text-emerald-400">{latencyMs}ms</strong> · Verified online.</span>
                )}
                {errorMsg && (
                  <span className="text-red-300 block">{errorMsg}</span>
                )}
                {lastTestedAt && (
                  <span className="text-[11px] font-mono text-[#A8A4B8]/60 block mt-0.5">
                    Last tested: {new Date(lastTestedAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={handleTestConnection}
            disabled={isTesting}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-semibold uppercase text-white bg-[#956BFF] hover:bg-[#8555f5] rounded transition-colors shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
            <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
          </button>
        </div>

        {/* Configuration Form */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="text-xs font-mono text-[#A8A4B8] block mb-1">Inference Provider</label>
            <select
              value={provider}
              onChange={e => setProvider(e.target.value as any)}
              className="w-full bg-[#080712] border border-[#30215B] rounded-lg p-2.5 text-xs font-mono text-[#ECEAF5] focus:outline-none focus:border-[#956BFF]"
            >
              <option value="google_ai_studio">Google AI Studio (Gemini SDK / Gemma Adapter)</option>
              <option value="ollama_local">Ollama Local Instance (http://localhost:11434)</option>
              <option value="huggingface">HuggingFace Inference API</option>
              <option value="custom_endpoint">Custom vLLM / Open-Weight OpenAI-Compatible Endpoint</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-mono text-[#A8A4B8] block mb-1">Model Identifier</label>
            <input
              type="text"
              value={modelId}
              onChange={e => setModelId(e.target.value)}
              placeholder="google/gemma-2-9b-it"
              className="w-full bg-[#080712] border border-[#30215B] rounded-lg p-2.5 text-xs font-mono text-[#ECEAF5] focus:outline-none focus:border-[#956BFF]"
            />
            <span className="text-[11px] font-mono text-[#A8A4B8]/70 block mt-1">
              Supports: google/gemma-2-9b-it, google/gemma-2-27b-it, or custom local tags.
            </span>
          </div>

          {provider !== 'google_ai_studio' && (
            <div>
              <label className="text-xs font-mono text-[#A8A4B8] block mb-1">Inference Endpoint URL</label>
              <input
                type="text"
                value={endpointUrl}
                onChange={e => setEndpointUrl(e.target.value)}
                placeholder="http://localhost:11434/api/generate"
                className="w-full bg-[#080712] border border-[#30215B] rounded-lg p-2.5 text-xs font-mono text-[#ECEAF5] focus:outline-none focus:border-[#956BFF]"
              />
            </div>
          )}

          {/* Security Guarantee Note */}
          <div className="p-3.5 rounded bg-[#080712] border border-[#30215B] text-xs font-mono text-[#A8A4B8] flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-[#75D8FF] shrink-0 mt-0.5" />
            <div>
              <strong className="text-[#ECEAF5]">Security Guarantee:</strong> API keys remain stored exclusively in server-side process environment variables. Keys are never rendered into browser HTML or client JavaScript.
            </div>
          </div>

          {/* Vercel Environment Variables Guide */}
          <div className="p-3.5 rounded bg-[#17102E]/60 border border-[#956BFF]/40 text-xs font-mono space-y-2">
            <div className="text-[#ECEAF5] font-semibold flex items-center gap-1.5">
              <span>▲ Vercel Production Environment Variables</span>
            </div>
            <p className="text-[11px] text-[#A8A4B8]">
              In your Vercel Dashboard (<strong className="text-[#ECEAF5]">Project Settings → Environment Variables</strong>), configure:
            </p>
            <div className="bg-[#080712] p-2.5 rounded border border-[#30215B] text-[11px] space-y-1 text-[#ECEAF5]">
              <div><code className="text-[#75D8FF]">GEMINI_API_KEY</code>: Your Google AI Studio API key</div>
              <div><code className="text-[#A8A4B8]">GEMMA_API_ENDPOINT</code>: (Optional) Custom endpoint (vLLM / HuggingFace)</div>
              <div><code className="text-[#A8A4B8]">GEMMA_MODEL_ID</code>: (Optional) e.g. <code className="text-[#ECEAF5]">google/gemma-2-9b-it</code></div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#17102E]">
          <button
            onClick={handleClearConfig}
            className="text-xs font-mono text-[#A8A4B8] hover:text-red-400 transition-colors"
          >
            Clear Configuration
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-mono text-[#A8A4B8] hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveConfig}
              disabled={isSaving}
              className="px-5 py-2 text-xs font-mono font-semibold uppercase tracking-wider text-white bg-[#956BFF] hover:bg-[#8555f5] rounded-md transition-colors shadow-md"
            >
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
