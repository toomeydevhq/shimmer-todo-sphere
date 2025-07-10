import React, { createContext, useContext, useState, useEffect } from "react";

export interface AppSettings {
  theme: "light" | "dark" | "system";
  defaultPriority: "low" | "medium" | "high";
  defaultCategory: "work" | "personal" | "shopping" | "health" | "other";
  autoDeleteCompleted: boolean;
  autoDeleteDays: number;
  showCompletedTasks: boolean;
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  compactView: boolean;
  showDueDates: boolean;
  showPriorities: boolean;
  showCategories: boolean;
}

const defaultSettings: AppSettings = {
  theme: "system",
  defaultPriority: "medium",
  defaultCategory: "personal",
  autoDeleteCompleted: false,
  autoDeleteDays: 30,
  showCompletedTasks: true,
  notificationsEnabled: true,
  soundEnabled: true,
  compactView: false,
  showDueDates: true,
  showPriorities: true,
  showCategories: true,
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("todoAppSettings");
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error("Failed to parse settings:", error);
      }
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todoAppSettings", JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};