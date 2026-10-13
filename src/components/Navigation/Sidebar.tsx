import React from 'react';
import {
  Home,
  Compass,
  Film,
  Send,
  Heart,
  PlusSquare,
  User as UserIcon,
  Moon,
  Sun,
  Instagram,
  Sparkles,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setIsCreateModalOpen,
    setCreateModalInitialType,
    unreadMessagesCount,
    unreadNotificationsCount,
    currentUser,
    theme,
    toggleTheme,
    setIsDownloadModalOpen,
  } = useApp();

  const handleOpenCreate = () => {
    setCreateModalInitialType('post');
    setIsCreateModalOpen(true);
  };

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'reels', label: 'Reels', icon: Film },
    {
      id: 'messages',
      label: 'Messages',
      icon: Send,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Heart,
      badge: unreadNotificationsCount > 0 ? unreadNotificationsCount : undefined,
    },
  ];

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 lg:w-72 h-screen sticky top-0 px-4 py-6 border-r border-zinc-800 bg-black text-white shrink-0 select-none z-30">
      <div className="flex flex-col gap-6">
        {/* Brand Header */}
        <div className="px-3 pt-2 pb-4">
          <button
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 group text-left"
          >
            <div className="w-9 h-9 rounded-xl insta-gradient-border p-[2px] flex items-center justify-center">
              <div className="w-full h-full bg-black rounded-[10px] flex items-center justify-center">
                <Instagram className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight block leading-none">
                Insta<span className="text-pink-500">Vibe</span>
              </span>
              <span className="text-[11px] text-zinc-400 font-medium">Real-time social</span>
            </div>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center justify-between w-full px-3.5 py-3 rounded-xl transition-all duration-150 ${
                  isActive
                    ? 'bg-zinc-900 text-white font-semibold'
                    : 'text-zinc-300 hover:bg-zinc-900/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <Icon
                    className={`w-6 h-6 transition-transform ${
                      isActive ? 'scale-110 text-pink-500 stroke-[2.5]' : 'stroke-[1.75]'
                    }`}
                  />
                  <span className="text-sm tracking-tight">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[11px] font-bold bg-pink-600 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Create Button */}
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-4 w-full px-3.5 py-3 rounded-xl text-zinc-300 hover:bg-zinc-900/60 hover:text-white transition-all text-left group"
          >
            <PlusSquare className="w-6 h-6 stroke-[1.75] group-hover:scale-110 transition-transform" />
            <span className="text-sm tracking-tight">Create Post / Story</span>
          </button>

          {/* Profile Item */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-4 w-full px-3.5 py-3 rounded-xl transition-all ${
              activeTab === 'profile'
                ? 'bg-zinc-900 text-white font-semibold'
                : 'text-zinc-300 hover:bg-zinc-900/60 hover:text-white'
            }`}
          >
            <div
              className={`w-7 h-7 rounded-full overflow-hidden border-2 ${
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
            <span className="text-sm tracking-tight truncate">{currentUser.name}</span>
          </button>
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-col gap-2 pt-4 border-t border-zinc-900">
        <button
          onClick={() => setIsDownloadModalOpen(true)}
          className="flex items-center gap-3 w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white transition-all text-xs font-semibold group"
        >
          <div className="w-6 h-6 rounded-lg bg-pink-600/20 text-pink-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Download className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col text-left">
            <span>Install / Download App</span>
            <span className="text-[10px] text-zinc-400 font-normal">Phone & Desktop</span>
          </div>
        </button>

        <button
          onClick={handleOpenCreate}
          className="w-full py-2.5 px-4 rounded-xl insta-gradient-border text-white font-semibold text-sm shadow-lg shadow-pink-900/20 hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Upload</span>
        </button>

        <button
          onClick={toggleTheme}
          className="flex items-center justify-between w-full px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-900/40 transition-colors"
        >
          <span className="flex items-center gap-2">
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            <span>Mode</span>
          </span>
          <span className="capitalize text-zinc-300 font-mono text-[11px]">{theme}</span>
        </button>
      </div>
    </aside>
  );
};
