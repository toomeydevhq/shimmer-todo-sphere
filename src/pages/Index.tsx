import { useState, useEffect } from "react";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { TodoFilters } from "@/components/TodoFilters";
import { TodoStats } from "@/components/TodoStats";
import { SearchBar } from "@/components/SearchBar";
import { Todo, TodoFilter, TodoPriority, TodoCategory } from "@/types/todo";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const { toast } = useToast();

  // Load todos from localStorage on mount
  useEffect(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (todo: Omit<Todo, "id" | "createdAt">) => {
    const newTodo: Todo = {
      ...todo,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setTodos(prev => [newTodo, ...prev]);
    setShowForm(false);
    toast({
      title: "Task added",
      description: "Your new task has been created successfully.",
    });
  };

  const updateTodo = (id: string, updates: Partial<Todo>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
    setEditingTodo(null);
    setShowForm(false);
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    });
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
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

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingTodo(null);
    setShowForm(false);
  };

  // Filter todos based on current filter and search query
  const filteredTodos = todos.filter(todo => {
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Advanced Todo
          </h1>
          <p className="text-muted-foreground">
            Organize your tasks with style and efficiency
          </p>
        </div>

        {/* Stats */}
        <TodoStats todos={todos} />

        {/* Search and Add Button */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar 
              searchQuery={searchQuery} 
              onSearchChange={setSearchQuery} 
            />
          </div>
          <Button 
            onClick={() => setShowForm(true)}
            className="shrink-0"
            size="lg"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Filters */}
        <TodoFilters 
          currentFilter={filter} 
          onFilterChange={setFilter} 
        />

        {/* Todo Form */}
        {showForm && (
          <div className="mb-6">
            <TodoForm
              onSubmit={editingTodo ? 
                (todo) => updateTodo(editingTodo.id, todo) : 
                addTodo
              }
              onCancel={handleCancelEdit}
              initialTodo={editingTodo}
              isEditing={!!editingTodo}
            />
          </div>
        )}

        {/* Todo List */}
        <TodoList
          todos={filteredTodos}
          onToggleComplete={toggleComplete}
          onDelete={deleteTodo}
          onEdit={handleEdit}
        />

        {filteredTodos.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium mb-2">
              {searchQuery ? "No tasks found" : "No tasks yet"}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery 
                ? "Try adjusting your search query"
                : "Add your first task to get started"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;