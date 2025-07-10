import { useState } from "react";
import { useTodos } from "@/contexts/TodoContext";
import { useSettings } from "@/contexts/SettingsContext";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { TodoFilters } from "@/components/TodoFilters";
import { TodoStats } from "@/components/TodoStats";
import { SearchBar } from "@/components/SearchBar";
import { Todo, TodoFilter } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Download, Upload } from "lucide-react";

export const HomePage = () => {
  const { todos, toggleComplete, deleteTodo, clearCompleted, importTodos, exportTodos } = useTodos();
  const { settings } = useSettings();
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

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (Array.isArray(data)) {
          const importedTodos = data.map((todo: any) => ({
            ...todo,
            id: crypto.randomUUID(), // Generate new IDs to avoid conflicts
            createdAt: new Date(todo.createdAt),
            dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
          }));
          importTodos(importedTodos);
        }
      } catch (error) {
        console.error("Failed to import todos:", error);
      }
    };
    reader.readAsText(file);
    event.target.value = ""; // Reset input
  };

  // Filter todos based on current filter and search query
  const filteredTodos = todos.filter(todo => {
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
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">
              {searchQuery ? "🔍" : filter === "completed" ? "✅" : "📝"}
            </div>
            <h3 className="text-lg font-medium mb-2">
              {searchQuery ? "No tasks found" : 
               filter === "completed" ? "No completed tasks" :
               filter === "active" ? "No active tasks" : "No tasks yet"}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? "Try adjusting your search query"
                : filter === "completed" 
                ? "Complete some tasks to see them here"
                : filter === "active"
                ? "All your tasks are completed!"
                : "Click the Quick Add button to create your first task"
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};