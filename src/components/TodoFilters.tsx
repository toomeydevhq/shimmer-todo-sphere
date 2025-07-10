import { TodoFilter } from "@/types/todo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TodoFiltersProps {
  currentFilter: TodoFilter;
  onFilterChange: (filter: TodoFilter) => void;
}

export const TodoFilters = ({ currentFilter, onFilterChange }: TodoFiltersProps) => {
  const filters: { key: TodoFilter; label: string; emoji: string }[] = [
    { key: "all", label: "All Tasks", emoji: "📋" },
    { key: "active", label: "Active", emoji: "⏳" },
    { key: "completed", label: "Completed", emoji: "✅" },
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filters.map((filter) => (
        <Button
          key={filter.key}
          variant={currentFilter === filter.key ? "default" : "outline"}
          onClick={() => onFilterChange(filter.key)}
          className={cn(
            "transition-all duration-200",
            currentFilter === filter.key && "shadow-md"
          )}
        >
          <span className="mr-2">{filter.emoji}</span>
          {filter.label}
        </Button>
      ))}
    </div>
  );
};