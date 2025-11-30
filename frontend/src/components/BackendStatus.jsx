import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

function BackendStatus() {
  const [status, setStatus] = useState('checking'); // 'ok' | 'error' | 'checking'
  const [message, setMessage] = useState('');

  const checkBackend = async () => {
    setStatus('checking');
    setMessage('');
    try {
      const res = await axios.post(`${API}/api/shield`, {
        prompt: 'status check',
        user_id: 'status_probe',
      });

      if (res?.status === 200 && typeof res.data?.final_response === 'string') {
        setStatus('ok');
        setMessage('Backend responded successfully');
      } else {
        setStatus('error');
        setMessage('Unexpected response format');
      }
    } catch (err) {
      setStatus('error');
      setMessage(err?.message || 'Request failed');
    }
  };

  useEffect(() => {
    checkBackend();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const color = status === 'ok' ? '#10B981' : status === 'error' ? '#EF4444' : '#F59E0B';
  const text = status === 'ok' ? 'Backend: OK' : status === 'error' ? 'Backend: Error' : 'Backend: Checking…';

  return (
    <button
      onClick={checkBackend}
      title={message || 'Click to re-check backend'}
      style={{
        backgroundColor: color,
        color: '#fff',
        padding: '6px 10px',
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {text}
    </button>
  );
}

export default BackendStatus;
