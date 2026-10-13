import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Navigation/Sidebar';
import { TopNav } from './components/Navigation/TopNav';
import { BottomNav } from './components/Navigation/BottomNav';
import { Feed } from './components/Feed/Feed';
import { ReelsFeed } from './components/Reels/ReelsFeed';
import { MessagesView } from './components/Messages/MessagesView';
import { ExploreGrid } from './components/Explore/ExploreGrid';
import { ProfileView } from './components/Profile/ProfileView';
import { NotificationsView } from './components/Notifications/NotificationsView';
import { CreateModal } from './components/Create/CreateModal';
import { StoryViewerModal } from './components/Feed/StoryViewerModal';
import { DownloadModal } from './components/Install/DownloadModal';

const AppContent: React.FC = () => {
  const { activeTab, theme, isDownloadModalOpen, setIsDownloadModalOpen } = useApp();

  return (
    <div
      className={`min-h-screen ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-zinc-50 text-zinc-900'
      } flex flex-col md:flex-row font-sans`}
    >
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Mobile Top Navigation */}
      <TopNav />

      {/* Main View Area */}
      <main className="flex-1 min-w-0 pb-16 md:pb-0 overflow-y-auto min-h-screen">
        {activeTab === 'home' && <Feed />}
        {activeTab === 'explore' && <ExploreGrid />}
        {activeTab === 'reels' && <ReelsFeed />}
        {activeTab === 'messages' && <MessagesView />}
        {activeTab === 'notifications' && <NotificationsView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Global Modals */}
      <CreateModal />
      <StoryViewerModal />
      <DownloadModal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
