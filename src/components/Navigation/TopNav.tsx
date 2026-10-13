import React from 'react';
import { Instagram, Heart, Send, PlusSquare, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TopNav: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    unreadMessagesCount,
    unreadNotificationsCount,
    setIsCreateModalOpen,
    setCreateModalInitialType,
    setIsDownloadModalOpen,
  } = useApp();

  const handleCreate = () => {
    setCreateModalInitialType('post');
    setIsCreateModalOpen(true);
  };

  return (
    <header className="md:hidden sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-black/90 backdrop-blur-md border-b border-zinc-900 text-white">
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg insta-gradient-border p-[1.5px] flex items-center justify-center">
          <div className="w-full h-full bg-black rounded-[6.5px] flex items-center justify-center">
            <Instagram className="w-4 h-4 text-white" />
          </div>
        </div>
        <span className="text-lg font-bold tracking-tight">
          Insta<span className="text-pink-500">Vibe</span>
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => setIsDownloadModalOpen(true)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-pink-400 hover:text-pink-300"
          aria-label="Download App"
          title="Download App"
        >
          <Download className="w-5 h-5 stroke-[2]" />
        </button>

        <button
          onClick={handleCreate}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-300 hover:text-white"
          aria-label="Create Post"
        >
          <PlusSquare className="w-6 h-6 stroke-[1.75]" />
        </button>

        <button
          onClick={() => setActiveTab('notifications')}
          className="relative min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-300 hover:text-white"
          aria-label="Notifications"
        >
          <Heart className={`w-6 h-6 stroke-[1.75] ${activeTab === 'notifications' ? 'text-pink-500 fill-pink-500' : ''}`} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-pink-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className="relative min-h-[44px] min-w-[44px] flex items-center justify-center text-zinc-300 hover:text-white"
          aria-label="Messages"
        >
          <Send className={`w-6 h-6 stroke-[1.75] ${activeTab === 'messages' ? 'text-pink-500' : ''}`} />
          {unreadMessagesCount > 0 && (
            <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 rounded-full bg-pink-600 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadMessagesCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
