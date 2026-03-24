import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const SettingsContext = createContext(null);

export const useSettings = () => {
  return useContext(SettingsContext);
};

export const SettingsProvider = ({ children }) => {
  const [isChatbotActive, setIsChatbotActive] = useState(false);
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [brandingMode, setBrandingMode] = useState('agua'); // 'agua' o 'clean'

  const fetchChatbotStatus = async () => {
    setIsLoadingSettings(true);
    try {
      const response = await fetch('/api/configuration/isChatbotActive');
      if (response.ok) {
        const config = await response.json();
        setIsChatbotActive(config.value === 'true');
      } else if (response.status === 404) {
        // Setting not found, likely first load, assume false or create
        setIsChatbotActive(false);
        // Optionally, create the setting with default false
        // await fetch('/api/configuration', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ key: 'isChatbotActive', value: 'false' }),
        // });
      } else {
        throw new Error('Failed to fetch chatbot status');
      }
    } catch (error) {
      console.error("Error fetching chatbot status:", error);
      toast.error('Error al cargar la configuración del chatbot.');
      setIsChatbotActive(false); // Default to inactive on error
    } finally {
      setIsLoadingSettings(false);
    }
  };

  useEffect(() => {
    fetchChatbotStatus();
  }, []);

  return (
    <SettingsContext.Provider value={{ 
      isChatbotActive, 
      isLoadingSettings, 
      fetchChatbotStatus,
      brandingMode,
      setBrandingMode
    }}>
      {children}
    </SettingsContext.Provider>
  );
};
