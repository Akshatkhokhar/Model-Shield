import React, { useState } from 'react';
import axios from 'axios';

function ChatInterface({ open, onClose }) {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null); // { text, isBlocked, reason }
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async (e) => {
    e?.preventDefault?.();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setResult(null);
    try {
      const res = await axios.post('/api/shield', {
        prompt,
        user_id: 'landing_modal_user',
      });
      const { final_response, is_blocked, block_reason } = res.data || {};
      setResult({ text: final_response || 'No response', isBlocked: !!is_blocked, reason: block_reason });
    } catch (err) {
      setResult({ text: err?.message || 'Request failed', isBlocked: true, reason: 'Network or server error' });
    } finally {
      setLoading(false);
    }
  };

  const close = () => {
    setPrompt('');
    setResult(null);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={close} />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-2xl rounded-2xl bg-white shadow-2xl border border-gray-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">Prompt Check</h3>
          <button onClick={close} className="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <form onSubmit={submit} className="p-5 space-y-4">
          <label className="block text-sm font-medium text-gray-700">Enter your prompt</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="Type a prompt to evaluate..."
            className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={close} className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={loading} className="px-5 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-semibold disabled:opacity-60">
              {loading ? 'Checking…' : 'Check Prompt'}
            </button>
          </div>

          {result && (
            <div className={`mt-2 rounded-lg border p-4 text-sm ${result.isBlocked ? 'bg-red-50 border-red-200 text-red-800' : 'bg-green-50 border-green-200 text-green-800'}`}>
              <p className="font-semibold mb-1">{result.isBlocked ? 'Malicious / Blocked' : 'Safe / Allowed'}</p>
              <p>{result.text}</p>
              {result.isBlocked && result.reason && (
                <p className="mt-2 italic">Reason: {result.reason}</p>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ChatInterface;

