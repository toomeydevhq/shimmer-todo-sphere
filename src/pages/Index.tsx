import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TodoProvider } from "@/contexts/TodoContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { Header } from "@/components/Header";
import { HomePage } from "@/pages/HomePage";
import { StatsPage } from "@/pages/StatsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { Toaster } from "@/components/ui/toaster";

const Index = () => {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <TodoProvider>
          <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-6xl">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
            <Toaster />
          </div>
        </TodoProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
};

export default Index;