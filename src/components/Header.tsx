import { Plus, Zap } from 'lucide-react';

interface HeaderProps {
  onAddIdea: () => void;
}

export default function Header({ onAddIdea }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-neo-bg/80 backdrop-blur-md border-b-2 border-neo-white p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-neo-cyan p-1 neo-border neo-shadow-sm-pink sticker-rotate-1">
            <Zap size={24} className="text-neo-black" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter">The Bench</h1>
        </div>
        
        <button 
          onClick={onAddIdea}
          className="neo-button neo-button-pink flex items-center gap-2"
        >
          <Plus size={20} />
          <span className="hidden sm:inline">Add Idea</span>
        </button>
      </div>
    </header>
  );
}
