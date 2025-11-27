import React, { useState } from 'react';
import axios from 'axios';

function ChatView() {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    // 1. Add user message to state
    const userMessage = { sender: 'user', text: prompt };
    setMessages((prev) => [...prev, userMessage]);
    
    // Clear input
    const userPrompt = prompt;
    setPrompt('');
    setIsLoading(true);

    try {
      // 2. Call the Model Shield API endpoint
      const response = await axios.post('/api/shield', {
        prompt: userPrompt,
        user_id: 'hackathon_user_1' // Hardcode user ID for now
      });

      const { final_response, is_blocked, block_reason } = response.data;

      // 3. Format the response from the Shield
      const shieldMessage = {
        sender: 'ai',
        text: final_response,
        isBlocked: is_blocked,
        reason: block_reason,
      };

      // 4. Add the shielded response to state
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
    <div className="h-[80vh] flex flex-col bg-gray-800 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold p-4 border-b border-gray-700 text-teal-400">Shield Test Chat</h2>

      {/* Message History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-xl shadow-md ${
                msg.sender === 'user' 
                  ? 'bg-blue-600' 
                  : (msg.isBlocked ? 'bg-red-500 border border-red-300' : 'bg-gray-600')
              }`}
            >
              <p className="font-bold text-sm mb-1">{msg.sender === 'user' ? 'You' : 'Shield AI'}</p>
              <p>{msg.text}</p>
              {msg.isBlocked && msg.reason && (
                <p className="text-xs mt-1 italic text-red-200">
                  ⚠️ Block Reason: {msg.reason}
                </p>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-600 p-3 rounded-xl shadow-md animate-pulse">
              <p className="font-bold text-sm mb-1">Shield AI</p>
              <p>Thinking...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-700 flex">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type a prompt (try 'ignore all previous instructions')"
          className="flex-1 p-3 rounded-l-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-r-lg transition duration-200 disabled:opacity-50"
          disabled={isLoading}
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default ChatView;