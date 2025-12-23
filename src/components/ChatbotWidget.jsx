import React, { useState, useRef, useEffect } from 'react';

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10zm-9-4h2v2h-2v-2zm-4 0h2v2H8v-2zm-4 0h2v2H4v-2z"/>
  </svg>
);

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const chatboxRef = useRef(null);
  const SESSION_STORAGE_KEY = 'chatbot_session_id';

  // Effect to manage session and load initial messages
  useEffect(() => {
    const storedSessionId = localStorage.getItem(SESSION_STORAGE_KEY);

    const initializeChat = async () => {
      let currentSessionId = storedSessionId;
      
      if (currentSessionId) {
        // Session exists, fetch history
        setSessionId(currentSessionId);
        setIsLoading(true);
        try {
          const response = await fetch(`/api/chatbot/session/${currentSessionId}`);
          if (response.ok) {
            const history = await response.json();
            // The API returns messages with `content` and `from`
            setMessages(history.map(msg => ({ text: msg.content, from: msg.from })));
          } else {
            // If session is invalid on server, create a new one
            localStorage.removeItem(SESSION_STORAGE_KEY);
            await createNewSession();
          }
        } catch (error) {
          console.error("Error fetching history:", error);
          // Handle error, maybe start a new session
        } finally {
          setIsLoading(false);
        }
      } else {
        // No session, create one
        await createNewSession();
      }
    };

    const createNewSession = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/chatbot/session', { method: 'POST' });
        const data = await response.json();
        const newSessionId = data.sessionId;
        
        localStorage.setItem(SESSION_STORAGE_KEY, newSessionId);
        setSessionId(newSessionId);
        
        // The first message is now handled by the backend after the first user message.
        // We can add a non-persistent welcome message on the frontend.
        setMessages([{ from: 'bot', text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte?' }]);

      } catch (error) {
        console.error("Error creating session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeChat();
  }, []);

  // Effect to scroll down when messages change
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (inputText.trim() === '' || isLoading || !sessionId) return;

    const userMessage = { from: 'user', text: inputText };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    const currentInput = inputText;
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput, sessionId: sessionId }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const botMessage = { from: 'bot', text: data.response };
      setMessages(prevMessages => [...prevMessages, botMessage]);

    } catch (error) {
      console.error("Error fetching bot response:", error);
      const errorMessage = { from: 'bot', text: 'Lo siento, tuve un problema para conectarme. Por favor, intenta de nuevo.' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col mb-4">
          <div className="bg-blue-600 text-white p-3 rounded-t-lg">
            <h3 className="font-semibold text-lg">Asistente Darmax</h3>
          </div>

          <div ref={chatboxRef} className="flex-1 p-4 overflow-y-auto bg-slate-100">
            {messages.map((msg, index) => (
              <div key={index} className={`my-2 flex items-end gap-1 ${msg.from === 'bot' ? 'justify-start' : 'justify-end'}`}>
                {msg.from === 'bot' && (
                  <img src="/img/iconos/mascota.png" alt="Mascota" className="w-7 h-5 rounded-full" />
                )}
                <div 
                  className={`px-3 py-2 rounded-xl max-w-xs shadow ${
                    msg.from === 'bot' 
                      ? 'bg-white text-gray-800 rounded-bl-none' 
                      : 'bg-cyan-500 text-white rounded-br-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="my-2 flex items-end gap-1 justify-start">
                <img src="/img/iconos/mascota.png" alt="Mascota" className="w-7 h-5 rounded-full" />
                <div className="px-3 py-2 rounded-xl max-w-xs shadow bg-white text-gray-800 rounded-bl-none">
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-2 border-t">
            <form onSubmit={handleSendMessage} className="flex">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button type="submit" className="bg-blue-600 text-white px-4 rounded-r-md hover:bg-blue-700 disabled:bg-gray-400" disabled={isLoading}>
                Enviar
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={toggleChat}
        className="bg-blue-600 text-white w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110"
        aria-label="Abrir chat"
      >
        <ChatIcon />
      </button>
    </div>
  );
}

