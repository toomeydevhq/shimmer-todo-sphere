import { useState, useMemo } from "react";
import { useTodos } from "@/contexts/TodoContext";
import { useSettings } from "@/contexts/SettingsContext";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { TodoFilters } from "@/components/TodoFilters";
import { TodoStats } from "@/components/TodoStats";
import { SearchBar } from "@/components/SearchBar";
import { EmptyState } from "@/components/EmptyState";
import { Todo, TodoFilter } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Trash2, Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const HomePage = () => {
  const { todos, toggleComplete, deleteTodo, clearCompleted, importTodos, exportTodos } = useTodos();
  const { settings } = useSettings();
  const { toast } = useToast();
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setShowForm(false);
  };

  const handleExport = () => {
    const data = JSON.stringify(exportTodos(), null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `todos-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!Array.isArray(data)) {
        throw new Error("Invalid file format: Expected an array of todos");
      }

      const importedTodos = data.map((todo: any) => ({
        ...todo,
        id: crypto.randomUUID(), // Generate new IDs to avoid conflicts
        createdAt: new Date(todo.createdAt),
        dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
      }));
      
      importTodos(importedTodos);
      toast({
        title: "Import successful",
        description: `Imported ${importedTodos.length} tasks successfully.`,
      });
    } catch (error) {
      console.error("Failed to import todos:", error);
      toast({
        title: "Import failed",
        description: "Failed to import tasks. Please check the file format.",
        variant: "destructive",
      });
    }
    
    event.target.value = ""; // Reset input
  };

  // Optimized filtering with useMemo for better performance
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      // Apply completed task visibility setting
      if (!settings.showCompletedTasks && todo.completed) return false;
      
      // Apply filter
      if (filter === "active" && todo.completed) return false;
      if (filter === "completed" && !todo.completed) return false;
      
      // Apply search
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          todo.title.toLowerCase().includes(query) ||
          todo.description?.toLowerCase().includes(query) ||
          todo.category.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
  }, [todos, settings.showCompletedTasks, filter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Your Tasks
        </h1>
        <p className="text-muted-foreground">
          Stay organized and productive with your personal task manager
        </p>
      </div>

      {/* Stats */}
      <TodoStats todos={todos} />

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <SearchBar 
            searchQuery={searchQuery} 
            onSearchChange={setSearchQuery} 
          />
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={todos.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          
          <Button
            variant="outline"
            onClick={() => document.getElementById("import-file")?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <input
            id="import-file"
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
          
          {todos.some(todo => todo.completed) && (
            <Button
              variant="outline"
              onClick={clearCompleted}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Completed
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <TodoFilters 
        currentFilter={filter} 
        onFilterChange={setFilter} 
      />

      {/* Todo Form */}
      {showForm && (
        <TodoForm
          onSubmit={(todo) => {
            // This will be handled by the quick add in header or dedicated add page
            handleCancelEdit();
          }}
          onCancel={handleCancelEdit}
          initialTodo={editingTodo}
          isEditing={!!editingTodo}
        />
      )}

      {/* Todo List */}
      {filteredTodos.length > 0 ? (
        <TodoList
          todos={filteredTodos}
          onToggleComplete={toggleComplete}
          onDelete={deleteTodo}
          onEdit={handleEdit}
        />
      ) : (
        <EmptyState
          icon={searchQuery ? "🔍" : filter === "completed" ? "✅" : "📝"}
          title={searchQuery ? "No tasks found" : 
                 filter === "completed" ? "No completed tasks" :
                 filter === "active" ? "No active tasks" : "No tasks yet"}
          description={searchQuery 
            ? "Try adjusting your search query"
            : filter === "completed" 
            ? "Complete some tasks to see them here"
            : filter === "active"
            ? "All your tasks are completed!"
            : "Click the Quick Add button to create your first task"
          }
          action={!searchQuery && filter === "all" ? {
            label: "Add Your First Task",
            onClick: () => setShowForm(true)
          } : undefined}
        />
      )}
    </div>
  );
};