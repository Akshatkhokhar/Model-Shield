import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

function ChatView() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: prompt };
    setMessages((prev) => [...prev, userMessage]);

    const userPrompt = prompt;
    setPrompt('');
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/api/shield`, {
        prompt: userPrompt,
        user_id: 'hackathon_user_1',
      });

      const { final_response, is_blocked, block_reason } = response.data;

      const shieldMessage = {
        sender: 'ai',
        text: final_response,
        isBlocked: is_blocked,
        reason: block_reason,
      };

      setMessages((prev) => [...prev, shieldMessage]);
    } catch (error) {
      console.error("Shield API Error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'Error: Could not connect to the Model Shield API.', isBlocked: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[80vh] flex flex-col bg-white rounded-lg shadow-xl border border-gray-200">
      <h2 className="text-xl font-semibold p-4 border-b border-gray-200 text-gray-900">
        Shield Test Chat
      </h2>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-md border ${
                msg.sender === 'user'
                  ? 'bg-gray-100 border-gray-200 text-gray-800'
                  : msg.isBlocked
                  ? 'bg-red-50 border-red-200 text-red-800'
                  : 'bg-green-50 border-green-200 text-green-800'
              }`}
            >
              <p className="font-bold text-sm mb-1">
                {msg.sender === 'user' ? 'You' : 'Shield AI'}
              </p>
              <p>{msg.text}</p>
              {msg.isBlocked && msg.reason && (
                <p className="text-xs mt-1 italic">
                  ⚠️ Block Reason: {msg.reason}
                </p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-50 border border-gray-200 text-gray-800 p-3 rounded-xl shadow-md animate-pulse">
              <p className="font-bold text-sm mb-1">Shield AI</p>
              <p>Thinking...</p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 flex">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type a prompt (try 'ignore all previous instructions')"
          className="flex-1 p-3 rounded-l-lg bg-white text-gray-900 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-r-lg transition duration-200 disabled:opacity-50"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatView;
