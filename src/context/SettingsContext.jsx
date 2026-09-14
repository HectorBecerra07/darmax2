import React, { createContext, useContext, useState, useEffect } from 'react';

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
      } else {
        setIsChatbotActive(false);
      }
    } catch {
      // Mantener chatbot inactivo por defecto si el servidor no esta disponible
      setIsChatbotActive(false);
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
