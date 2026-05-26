interface FilterBarProps {
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

const statuses = ['All', 'Idea', 'In Progress', 'Shipped', 'Paused'];

export default function FilterBar({ currentFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="w-full overflow-x-auto py-4 px-4 sm:px-0 hide-scrollbar">
      <div className="flex gap-3 max-w-4xl mx-auto">
        {statuses.map((status) => (
          <button
            key={status}
            onClick={() => onFilterChange(status)}
            className={`
              whitespace-nowrap px-4 py-2 font-bold neo-border rounded-sm transition-all
              ${currentFilter === status 
                ? 'bg-neo-cyan text-white neo-shadow-cyan -translate-y-1' 
                : 'bg-neo-panel text-neo-white hover:bg-neo-bg'}
            `}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}
