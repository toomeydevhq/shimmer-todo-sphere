import { useTodos } from "@/contexts/TodoContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Calendar, 
  Clock, 
  Target, 
  TrendingUp, 
  Award,
  AlertTriangle,
  CheckCircle2,
  Circle,
  Timer
} from "lucide-react";
import { format, isAfter, isBefore, addDays, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";

export const StatsPage = () => {
  const { todos } = useTodos();

  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);

  // Basic Stats
  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => todo.completed).length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Priority Distribution
  const priorityStats = {
    high: todos.filter(todo => todo.priority === "high").length,
    medium: todos.filter(todo => todo.priority === "medium").length,
    low: todos.filter(todo => todo.priority === "low").length,
  };

  const activePriorityStats = {
    high: todos.filter(todo => todo.priority === "high" && !todo.completed).length,
    medium: todos.filter(todo => todo.priority === "medium" && !todo.completed).length,
    low: todos.filter(todo => todo.priority === "low" && !todo.completed).length,
  };

  // Category Distribution
  const categoryStats = todos.reduce((acc, todo) => {
    acc[todo.category] = (acc[todo.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Date-based stats
  const overdueTasks = todos.filter(todo => 
    todo.dueDate && isAfter(now, todo.dueDate) && !todo.completed
  ).length;

  const dueTodayTasks = todos.filter(todo => 
    todo.dueDate && 
    format(todo.dueDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd") &&
    !todo.completed
  ).length;

  const dueThisWeekTasks = todos.filter(todo => 
    todo.dueDate && 
    isAfter(todo.dueDate, weekStart) && 
    isBefore(todo.dueDate, weekEnd) &&
    !todo.completed
  ).length;

  // Weekly completion trend
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
  const weeklyData = weekDays.map(day => {
    const dayTasks = todos.filter(todo => 
      todo.completed && 
      format(todo.createdAt, "yyyy-MM-dd") === format(day, "yyyy-MM-dd")
    ).length;
    return {
      day: format(day, "EEE"),
      tasks: dayTasks
    };
  });

  // Productivity metrics
  const avgTasksPerDay = totalTasks > 0 ? (totalTasks / 30) : 0; // Rough estimate
  const tasksCreatedThisWeek = todos.filter(todo => 
    isAfter(todo.createdAt, weekStart) && isBefore(todo.createdAt, weekEnd)
  ).length;
  const tasksCompletedThisWeek = todos.filter(todo => 
    todo.completed && isAfter(todo.createdAt, weekStart) && isBefore(todo.createdAt, weekEnd)
  ).length;

  const categoryIcons = {
    work: "💼",
    personal: "👤",
    shopping: "🛒",
    health: "🏥",
    other: "📝",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Task Analytics
        </h1>
        <p className="text-muted-foreground">
          Insights into your productivity and task management
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-bold">{totalTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Circle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold text-orange-600">{activeTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress and Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Completion Rate</span>
                  <span className="font-medium">{Math.round(completionRate)}%</span>
                </div>
                <Progress value={completionRate} className="h-3" />
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
                  <p className="text-xs text-muted-foreground">Done</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{activeTasks}</p>
                  <p className="text-xs text-muted-foreground">In Progress</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-red-600">{overdueTasks}</p>
                  <p className="text-xs text-muted-foreground">Overdue</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Due Today</span>
                <Badge variant={dueTodayTasks > 0 ? "destructive" : "secondary"}>
                  {dueTodayTasks}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Due This Week</span>
                <Badge variant={dueThisWeekTasks > 0 ? "default" : "secondary"}>
                  {dueThisWeekTasks}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm">Overdue</span>
                <Badge variant={overdueTasks > 0 ? "destructive" : "secondary"}>
                  {overdueTasks}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority & Category Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Priority Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">High Priority</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">{activePriorityStats.high}</span>
                  <span className="text-muted-foreground">/{priorityStats.high}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Medium Priority</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">{activePriorityStats.medium}</span>
                  <span className="text-muted-foreground">/{priorityStats.medium}</span>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Low Priority</span>
                </div>
                <div className="text-sm">
                  <span className="font-medium">{activePriorityStats.low}</span>
                  <span className="text-muted-foreground">/{priorityStats.low}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>{categoryIcons[category as keyof typeof categoryIcons]}</span>
                    <span className="text-sm capitalize">{category}</span>
                  </div>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Productivity Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Weekly Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tasks Created This Week</p>
              <p className="text-2xl font-bold">{tasksCreatedThisWeek}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Tasks Completed This Week</p>
              <p className="text-2xl font-bold text-green-600">{tasksCompletedThisWeek}</p>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Average Tasks Per Day</p>
              <p className="text-2xl font-bold">{avgTasksPerDay.toFixed(1)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Motivational Section */}
      {totalTasks > 0 && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="text-lg font-semibold mb-2">
              {completionRate >= 80 ? "Outstanding Work!" : 
               completionRate >= 60 ? "Great Progress!" : 
               completionRate >= 40 ? "Keep Going!" : "You Got This!"}
            </h3>
            <p className="text-muted-foreground">
              {completionRate >= 80 ? 
                `You've completed ${completionRate.toFixed(0)}% of your tasks. You're crushing it!` :
                `You've completed ${completionRate.toFixed(0)}% of your tasks. Every step counts!`
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};