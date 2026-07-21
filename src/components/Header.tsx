import { Zap, Plus, Sparkles } from 'lucide-react';
import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';

interface HeaderProps {
  onAddIdea: () => void;
  onSparkIdea: () => void;
}

export default function Header({ onAddIdea, onSparkIdea }: HeaderProps) {
  const { userId } = useAuth();
  return (
    <header className="sticky top-0 z-50 bg-neo-bg/80 backdrop-blur-md border-b-2 border-neo-white p-4">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-neo-cyan p-1 neo-border neo-shadow-sm-pink sticker-rotate-1">
            <Zap size={24} className="text-neo-black" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter">The Bench</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {!userId ? (
            <div className="neo-button-pink px-4 py-2 font-bold cursor-pointer transition-transform hover:-translate-y-1">
              <SignInButton mode="modal" fallbackRedirectUrl="/" />
            </div>
          ) : (
            <>
              <div className="neo-border bg-neo-white p-1 flex items-center justify-center neo-shadow-sm-pink hover:-translate-y-1 transition-transform">
                <UserButton 
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8 rounded-none border-2 border-neo-black",
                    }
                  }}
                />
              </div>
              <button 
                onClick={onSparkIdea}
                className="neo-button neo-button-pink flex items-center gap-2"
              >
                <Sparkles size={20} />
                <span className="hidden sm:inline font-bold">AI Spark</span>
              </button>
              <button 
                onClick={onAddIdea}
                className="neo-button neo-button-cyan flex items-center gap-2"
              >
                <Plus size={20} />
                <span className="hidden sm:inline font-bold">New Idea</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
