import React, { createContext, useContext, useState, useEffect } from "react";
import { Todo, TodoPriority, TodoCategory } from "@/types/todo";
import { useToast } from "@/hooks/use-toast";
import { useSettings } from "./SettingsContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { offlineStorage } from "@/utils/offline";

interface TodoContextType {
  todos: Todo[];
  addTodo: (todo: Omit<Todo, "id" | "createdAt">) => void;
  updateTodo: (id: string, updates: Partial<Todo>) => void;
  deleteTodo: (id: string) => void;
  toggleComplete: (id: string) => void;
  clearCompleted: () => void;
  importTodos: (todos: Todo[]) => void;
  exportTodos: () => Todo[];
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos, isLoaded] = useLocalStorage<Todo[]>("todos", []);
  const { toast } = useToast();
  const { settings } = useSettings();

  // Auto-delete completed tasks based on settings
  useEffect(() => {
    if (!isLoaded || !settings.autoDeleteCompleted || settings.autoDeleteDays <= 0) return;
    
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - settings.autoDeleteDays);
    
    setTodos(prev => {
      const filtered = prev.filter(todo => 
        !todo.completed || todo.createdAt > cutoffDate
      );
      
      if (filtered.length < prev.length) {
        toast({
          title: "Auto-cleanup completed",
          description: `Removed ${prev.length - filtered.length} old completed tasks.`,
        });
      }
      
      return filtered;
    });
  }, [isLoaded, settings.autoDeleteCompleted, settings.autoDeleteDays, setTodos, toast]);

  const addTodo = (todo: Omit<Todo, "id" | "createdAt">) => {
    const newTodo: Todo = {
      ...todo,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    
    setTodos(prev => [newTodo, ...prev]);
    
    // Handle offline storage
    if (!offlineStorage.isOnline()) {
      offlineStorage.addOfflineTodo('create', newTodo);
    }
    
    toast({
      title: "Task added",
      description: "Your new task has been created successfully.",
    });
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
    
    // Handle offline storage
    if (!offlineStorage.isOnline()) {
      offlineStorage.addOfflineTodo('update', { id, updates });
    }
    
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    });
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    
    // Handle offline storage
    if (!offlineStorage.isOnline()) {
      offlineStorage.addOfflineTodo('delete', { id });
    }
    
    toast({
      title: "Task deleted",
      description: "Your task has been removed.",
      variant: "destructive",
    });
  };

  const toggleComplete = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const clearCompleted = () => {
    const completedCount = todos.filter(todo => todo.completed).length;
    setTodos(prev => prev.filter(todo => !todo.completed));
    
    if (completedCount > 0) {
      toast({
        title: "Completed tasks cleared",
        description: `Removed ${completedCount} completed tasks.`,
      });
    }
  };

  const importTodos = (importedTodos: Todo[]) => {
    setTodos(prev => [...importedTodos, ...prev]);
    
    toast({
      title: "Tasks imported",
      description: `Successfully imported ${importedTodos.length} tasks.`,
    });
  };

  const exportTodos = () => {
    return todos;
  };

  return (
    <TodoContext.Provider value={{
      todos,
      addTodo,
      updateTodo,
      deleteTodo,
      toggleComplete,
      clearCompleted,
      importTodos,
      exportTodos,
    }}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
};