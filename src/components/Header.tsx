import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BarChart3, Settings, Home, Plus } from "lucide-react";
import { useState } from "react";
import { TodoForm } from "@/components/TodoForm";
import { useTodos } from "@/contexts/TodoContext";
import { useSettings } from "@/contexts/SettingsContext";

export const Header = () => {
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const { addTodo } = useTodos();
  const { settings } = useSettings();

  const navItems = [
    { to: "/", icon: Home, label: "Tasks" },
    { to: "/stats", icon: BarChart3, label: "Stats" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  const handleQuickAdd = (todo: any) => {
    addTodo({
      ...todo,
      priority: settings.defaultPriority,
      category: settings.defaultCategory,
    });
    setShowQuickAdd(false);
  };

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">T</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              TodoMaster
            </h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Quick Add Button */}
          <Button 
            onClick={() => setShowQuickAdd(true)}
            size="sm"
            className="shadow-md"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Quick Add</span>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <nav className="md:hidden flex items-center justify-around pb-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span className="text-xs font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Quick Add Form */}
      {showQuickAdd && (
        <div className="border-t bg-background p-4">
          <div className="container mx-auto max-w-2xl">
            <TodoForm
              onSubmit={handleQuickAdd}
              onCancel={() => setShowQuickAdd(false)}
              isEditing={false}
            />
          </div>
        </div>
      )}
    </header>
  );
};