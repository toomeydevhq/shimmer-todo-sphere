import { useSettings } from "@/contexts/SettingsContext";
import { useTodos } from "@/contexts/TodoContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, 
  Palette, 
  Bell, 
  Database, 
  Trash2, 
  Download, 
  Upload,
  RotateCcw,
  Shield,
  Zap
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const SettingsPage = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { todos, clearCompleted, importTodos, exportTodos } = useTodos();
  const { toast } = useToast();
  const [showDangerZone, setShowDangerZone] = useState(false);

  const handleExportData = () => {
    const exportData = {
      todos: exportTodos(),
      settings,
      exportDate: new Date().toISOString(),
      version: "1.0"
    };
    
    const data = JSON.stringify(exportData, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `todomaster-backup-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported",
      description: "Your data has been exported successfully.",
    });
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string);
        
        if (importData.todos) {
          const todosWithDates = importData.todos.map((todo: any) => ({
            ...todo,
            id: crypto.randomUUID(),
            createdAt: new Date(todo.createdAt),
            dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
          }));
          importTodos(todosWithDates);
        }
        
        if (importData.settings) {
          updateSettings(importData.settings);
        }
        
        toast({
          title: "Data imported",
          description: "Your data has been imported successfully.",
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Failed to import data. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const handleResetSettings = () => {
    resetSettings();
    toast({
      title: "Settings reset",
      description: "All settings have been reset to defaults.",
    });
  };

  const handleClearAllData = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Customize your TodoMaster experience
        </p>
      </div>

      {/* Appearance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Appearance & Defaults
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <Select 
                value={settings.theme} 
                onValueChange={(value: "light" | "dark" | "system") => 
                  updateSettings({ theme: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultPriority">Default Priority</Label>
              <Select 
                value={settings.defaultPriority} 
                onValueChange={(value: "low" | "medium" | "high") => 
                  updateSettings({ defaultPriority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultCategory">Default Category</Label>
              <Select 
                value={settings.defaultCategory} 
                onValueChange={(value: "work" | "personal" | "shopping" | "health" | "other") => 
                  updateSettings({ defaultCategory: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">💼 Work</SelectItem>
                  <SelectItem value="personal">👤 Personal</SelectItem>
                  <SelectItem value="shopping">🛒 Shopping</SelectItem>
                  <SelectItem value="health">🏥 Health</SelectItem>
                  <SelectItem value="other">📝 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-medium">Display Options</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compactView">Compact View</Label>
                  <p className="text-sm text-muted-foreground">
                    Show tasks in a more condensed layout
                  </p>
                </div>
                <Switch
                  id="compactView"
                  checked={settings.compactView}
                  onCheckedChange={(checked) => updateSettings({ compactView: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showCompletedTasks">Show Completed</Label>
                  <p className="text-sm text-muted-foreground">
                    Display completed tasks in lists
                  </p>
                </div>
                <Switch
                  id="showCompletedTasks"
                  checked={settings.showCompletedTasks}
                  onCheckedChange={(checked) => updateSettings({ showCompletedTasks: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showDueDates">Show Due Dates</Label>
                  <p className="text-sm text-muted-foreground">
                    Display due dates on task cards
                  </p>
                </div>
                <Switch
                  id="showDueDates"
                  checked={settings.showDueDates}
                  onCheckedChange={(checked) => updateSettings({ showDueDates: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="showPriorities">Show Priorities</Label>
                  <p className="text-sm text-muted-foreground">
                    Display priority badges on tasks
                  </p>
                </div>
                <Switch
                  id="showPriorities"
                  checked={settings.showPriorities}
                  onCheckedChange={(checked) => updateSettings({ showPriorities: checked })}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automation Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Automation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="autoDeleteCompleted">Auto-delete Completed Tasks</Label>
              <p className="text-sm text-muted-foreground">
                Automatically remove old completed tasks
              </p>
            </div>
            <Switch
              id="autoDeleteCompleted"
              checked={settings.autoDeleteCompleted}
              onCheckedChange={(checked) => updateSettings({ autoDeleteCompleted: checked })}
            />
          </div>

          {settings.autoDeleteCompleted && (
            <div className="space-y-2 pl-4 border-l-2 border-border">
              <Label htmlFor="autoDeleteDays">Delete after (days)</Label>
              <Input
                id="autoDeleteDays"
                type="number"
                min="1"
                max="365"
                value={settings.autoDeleteDays}
                onChange={(e) => updateSettings({ autoDeleteDays: parseInt(e.target.value) || 30 })}
                className="w-32"
              />
              <p className="text-xs text-muted-foreground">
                Completed tasks older than this will be automatically deleted
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notificationsEnabled">Enable Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about due dates and reminders
              </p>
            </div>
            <Switch
              id="notificationsEnabled"
              checked={settings.notificationsEnabled}
              onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="soundEnabled">Sound Effects</Label>
              <p className="text-sm text-muted-foreground">
                Play sounds for task completion and alerts
              </p>
            </div>
            <Switch
              id="soundEnabled"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={handleExportData}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Export All Data
            </Button>

            <Button
              variant="outline"
              onClick={() => document.getElementById("import-data")?.click()}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              Import Data
            </Button>
            <input
              id="import-data"
              type="file"
              accept=".json"
              onChange={handleImportData}
              className="hidden"
            />

            <Button
              variant="outline"
              onClick={clearCompleted}
              disabled={!todos.some(todo => todo.completed)}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Clear Completed
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="font-medium">Storage Usage</p>
              <p className="text-sm text-muted-foreground">
                {todos.length} tasks stored locally
              </p>
            </div>
            <Badge variant="outline">
              {Math.round(JSON.stringify({ todos, settings }).length / 1024)}KB
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* System Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            onClick={handleResetSettings}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset Settings to Default
          </Button>

          <Separator />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-red-500" />
              <span className="font-medium text-red-600">Danger Zone</span>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowDangerZone(!showDangerZone)}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              {showDangerZone ? "Hide" : "Show"} Danger Zone
            </Button>

            {showDangerZone && (
              <div className="p-4 border border-red-200 bg-red-50 rounded-lg space-y-4">
                <div>
                  <h4 className="font-medium text-red-800 mb-2">Clear All Data</h4>
                  <p className="text-sm text-red-700 mb-3">
                    This will permanently delete all your tasks and settings. This action cannot be undone.
                  </p>
                  <Button
                    variant="destructive"
                    onClick={handleClearAllData}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Everything
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};