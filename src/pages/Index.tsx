import { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TodoProvider } from "@/contexts/TodoContext";
import { SettingsProvider } from "@/contexts/SettingsContext";
import { AccessibilityProvider } from "@/components/AccessibilityProvider";
import { Header } from "@/components/Header";
import { HomePage } from "@/pages/HomePage";
import { StatsPage } from "@/pages/StatsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Toaster } from "@/components/ui/toaster";

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <LoadingSpinner size="lg" />
  </div>
);

const Index = () => {
  return (
    <ErrorBoundary>
      <AccessibilityProvider>
        <BrowserRouter>
          <SettingsProvider>
            <TodoProvider>
              <div className="min-h-screen bg-background">
                <Header />
                <main className="container mx-auto px-4 py-8 max-w-6xl">
                  <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/stats" element={<StatsPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </main>
                <Toaster />
              </div>
            </TodoProvider>
          </SettingsProvider>
        </BrowserRouter>
      </AccessibilityProvider>
    </ErrorBoundary>
  );
};

export default Index;