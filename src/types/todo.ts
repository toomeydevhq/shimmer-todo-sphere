export type TodoPriority = "low" | "medium" | "high";
export type TodoCategory = "work" | "personal" | "shopping" | "health" | "other";
export type TodoFilter = "all" | "active" | "completed";

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: TodoPriority;
  category: TodoCategory;
  dueDate?: Date;
  createdAt: Date;
}