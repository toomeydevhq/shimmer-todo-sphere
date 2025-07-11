import { usePWA } from "@/contexts/PWAContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Wifi, WifiOff, Smartphone } from "lucide-react";

export const PWABanner = () => {
  const { isOnline, isInstallable, isInstalled, installPWA } = usePWA();

  if (isInstalled) return null;

  return (
    <>
      {/* Offline Banner */}
      {!isOnline && (
        <Card className="mb-4 border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="flex items-center gap-3 py-3">
            <WifiOff className="w-5 h-5 text-orange-600" />
            <div className="flex-1">
              <p className="font-medium text-orange-800 dark:text-orange-200">
                You're offline
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-300">
                Don't worry, your tasks are saved locally and will sync when you're back online.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Install Banner */}
      {isInstallable && (
        <Card className="mb-4 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="flex items-center gap-3 py-3">
            <Smartphone className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <p className="font-medium text-blue-800 dark:text-blue-200">
                Install TodoMaster
              </p>
              <p className="text-sm text-blue-600 dark:text-blue-300">
                Install our app for a better experience with offline support and quick access.
              </p>
            </div>
            <Button 
              onClick={installPWA}
              size="sm"
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Install
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Online Status Indicator */}
      <div className={`fixed bottom-4 right-4 z-50 transition-opacity duration-300 ${
        isOnline ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}>
        <div className="bg-orange-500 text-white px-3 py-2 rounded-full shadow-lg flex items-center gap-2">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">Offline</span>
        </div>
      </div>
    </>
  );
};