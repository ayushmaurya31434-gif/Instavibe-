import React from 'react';
import { Home, Compass, Film, PlusCircle, User as UserIcon } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BottomNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsCreateModalOpen,
    setCreateModalInitialType,
    currentUser,
  } = useApp();

  const handleOpenCreate = () => {
    setCreateModalInitialType('post');
    setIsCreateModalOpen(true);
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-t border-zinc-800 text-white flex items-center justify-around h-14 px-2">
      <button
        onClick={() => setActiveTab('home')}
        className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
          activeTab === 'home' ? 'text-white' : 'text-zinc-400'
        }`}
        aria-label="Home Feed"
      >
        <Home className={`w-6 h-6 ${activeTab === 'home' ? 'stroke-[2.5] text-pink-500' : 'stroke-[1.75]'}`} />
      </button>

      <button
        onClick={() => setActiveTab('explore')}
        className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
          activeTab === 'explore' ? 'text-white' : 'text-zinc-400'
        }`}
        aria-label="Explore"
      >
        <Compass className={`w-6 h-6 ${activeTab === 'explore' ? 'stroke-[2.5] text-pink-500' : 'stroke-[1.75]'}`} />
      </button>

      <button
        onClick={handleOpenCreate}
        className="min-h-[44px] min-w-[44px] flex flex-col items-center justify-center text-pink-500"
        aria-label="Create Post"
      >
        <PlusCircle className="w-7 h-7 stroke-[2] hover:scale-110 active:scale-95 transition-transform" />
      </button>

      <button
        onClick={() => setActiveTab('reels')}
        className={`min-h-[44px] min-w-[44px] flex flex-col items-center justify-center transition-colors ${
          activeTab === 'reels' ? 'text-white' : 'text-zinc-400'
        }`}
        aria-label="Reels"
      >
        <Film className={`w-6 h-6 ${activeTab === 'reels' ? 'stroke-[2.5] text-pink-500' : 'stroke-[1.75]'}`} />
      </button>

      <button
        onClick={() => setActiveTab('profile')}
        className="min-h-[44px] min-w-[44px] flex flex-col items-center justify-center"
        aria-label="Profile"
      >
        <div
          className={`w-6 h-6 rounded-full overflow-hidden border-2 ${
            activeTab === 'profile' ? 'border-pink-500' : 'border-transparent'
          }`}
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </button>
    </nav>
  );
};
