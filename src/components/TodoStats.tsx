import { Todo } from "@/types/todo";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface TodoStatsProps {
  todos: Todo[];
}

export const TodoStats = ({ todos }: TodoStatsProps) => {
  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => todo.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const overdueTasks = todos.filter(todo => 
    todo.dueDate && new Date() > todo.dueDate && !todo.completed
  ).length;

  const priorityStats = {
    high: todos.filter(todo => todo.priority === "high" && !todo.completed).length,
    medium: todos.filter(todo => todo.priority === "medium" && !todo.completed).length,
    low: todos.filter(todo => todo.priority === "low" && !todo.completed).length,
  };

  if (totalTasks === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-primary">{totalTasks}</div>
          <div className="text-sm text-muted-foreground">Total Tasks</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{activeTasks}</div>
          <div className="text-sm text-muted-foreground">Active</div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{overdueTasks}</div>
          <div className="text-sm text-muted-foreground">Overdue</div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(completionRate)}%</span>
          </div>
          <Progress value={completionRate} className="h-2" />
          
          <div className="flex justify-between mt-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              High: {priorityStats.high}
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              Medium: {priorityStats.medium}
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Low: {priorityStats.low}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};