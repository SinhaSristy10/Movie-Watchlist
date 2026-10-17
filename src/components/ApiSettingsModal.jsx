import React, { useState, useEffect } from "react";
import { X, Key, CheckCircle2, Globe, Database, ExternalLink, RefreshCw } from "lucide-react";
import { getApiConfig, saveApiConfig } from "../services/storage";

export const ApiSettingsModal = ({ onClose, onSaved }) => {
  const currentConfig = getApiConfig();
  const [omdbKey, setOmdbKey] = useState(currentConfig.omdbKey || "");
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState(null); // { success: boolean, message: string }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleTestKey = async () => {
    if (!omdbKey.trim()) {
      setTestResult({ success: false, message: "Please enter an OMDb API key first." });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${encodeURIComponent(omdbKey.trim())}&s=Batman`);
      const data = await res.json();
      if (data.Response === "True") {
        setTestResult({ success: true, message: "API Key verified! Live OMDb search is working." });
      } else {
        setTestResult({ success: false, message: data.Error || "Invalid API key response." });
      }
    } catch (err) {
      setTestResult({ success: false, message: "Network error connecting to OMDb API." });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = () => {
    saveApiConfig({ omdbKey: omdbKey.trim() });
    if (onSaved) onSaved();
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
            <Key className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-heading text-xl font-bold text-white">
              Movie API & Data Sources
            </h2>
            <p className="text-xs text-slate-400">
              Configure data providers and custom live API keys.
            </p>
          </div>
        </div>

        {/* Active Providers Status */}
        <div className="space-y-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="text-xs font-bold text-white">Curated Offline Catalog</h4>
                <p className="text-[11px] text-slate-400">22+ blockbusters with trailers & high-res backdrops</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800">
              Active
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-sky-400" />
              <div>
                <h4 className="text-xs font-bold text-white">TVMaze Live Search API</h4>
                <p className="text-[11px] text-slate-400">Free global search without key requirement</p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-950 text-sky-400 border border-sky-800">
              Active
            </span>
          </div>
        </div>

        {/* OMDb Custom Key Configuration */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Custom OMDb API Key (Optional)
              </label>
              <a
                href="https://www.omdbapi.com/apikey.aspx"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
              >
                <span>Get Free Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={omdbKey}
                onChange={(e) => setOmdbKey(e.target.value)}
                placeholder="e.g. 5a1b2c3d"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-rose-500 font-mono"
              />
              <button
                type="button"
                onClick={handleTestKey}
                disabled={isTesting || !omdbKey.trim()}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-300 text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? "animate-spin" : ""}`} />
                <span>Test</span>
              </button>
            </div>
          </div>

          {testResult && (
            <div
              className={`p-3 rounded-xl text-xs font-medium border flex items-center gap-2 ${
                testResult.success
                  ? "bg-emerald-950/60 border-emerald-800/80 text-emerald-300"
                  : "bg-rose-950/60 border-rose-800/80 text-rose-300"
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              ) : (
                <X className="w-4 h-4 shrink-0 text-rose-400" />
              )}
              <span>{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-slate-400 hover:text-white font-semibold text-xs sm:text-sm"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/30 transition-transform hover:scale-105 active:scale-95"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
