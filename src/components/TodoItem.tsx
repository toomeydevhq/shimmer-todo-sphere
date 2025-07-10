import { Todo } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Calendar, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (todo: Todo) => void;
}

export const TodoItem = ({ todo, onToggleComplete, onDelete, onEdit }: TodoItemProps) => {
  const priorityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-red-100 text-red-800 border-red-200",
  };

  const categoryIcons = {
    work: "💼",
    personal: "👤",
    shopping: "🛒",
    health: "🏥",
    other: "📝",
  };

  const isOverdue = todo.dueDate && new Date() > todo.dueDate && !todo.completed;

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      todo.completed && "opacity-60",
      isOverdue && "border-red-200 bg-red-50"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={todo.completed}
            onCheckedChange={() => onToggleComplete(todo.id)}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className={cn(
                  "font-medium text-sm sm:text-base break-words",
                  todo.completed && "line-through text-muted-foreground"
                )}>
                  {todo.title}
                </h3>
                
                {todo.description && (
                  <p className={cn(
                    "text-sm text-muted-foreground mt-1 break-words",
                    todo.completed && "line-through"
                  )}>
                    {todo.description}
                  </p>
                )}
              </div>
              
              <div className="flex gap-1 shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(todo)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="w-3 h-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(todo.id)}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge variant="outline" className={priorityColors[todo.priority]}>
                {todo.priority}
              </Badge>
              
              <Badge variant="outline">
                {categoryIcons[todo.category]} {todo.category}
              </Badge>
              
              {todo.dueDate && (
                <Badge 
                  variant="outline" 
                  className={cn(
                    "flex items-center gap-1",
                    isOverdue && "bg-red-100 text-red-800 border-red-200"
                  )}
                >
                  <Calendar className="w-3 h-3" />
                  {format(todo.dueDate, "MMM d")}
                </Badge>
              )}
              
              {isOverdue && (
                <Badge variant="destructive" className="text-xs">
                  Overdue
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};