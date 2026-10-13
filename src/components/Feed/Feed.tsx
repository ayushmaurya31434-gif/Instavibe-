import React from 'react';
import { StoriesBar } from './StoriesBar';
import { PostCard } from './PostCard';
import { useApp } from '../../context/AppContext';
import { Sparkles, UserPlus, Check } from 'lucide-react';

export const Feed: React.FC = () => {
  const {
    posts,
    currentUser,
    users,
    followUser,
    setActiveTab,
    setIsCreateModalOpen,
    setCreateModalInitialType,
  } = useApp();

  return (
    <div className="w-full max-w-5xl mx-auto flex justify-center gap-12 px-2 sm:px-4 py-4 md:py-6">
      {/* Center Feed Stream */}
      <main className="w-full max-w-[500px] flex flex-col">
        {/* Stories bar */}
        <StoriesBar />

        {/* Posts Stream */}
        <div className="mt-4 flex flex-col">
          {posts.length === 0 ? (
            <div className="text-center py-16 px-4 bg-zinc-950 rounded-2xl border border-zinc-800">
              <Sparkles className="w-10 h-10 text-pink-500 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-white">No posts yet</h3>
              <p className="text-xs text-zinc-400 mt-1 mb-4">
                Be the first to share a moment, photo, or reel!
              </p>
              <button
                onClick={() => {
                  setCreateModalInitialType('post');
                  setIsCreateModalOpen(true);
                }}
                className="px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold rounded-xl"
              >
                Create Post
              </button>
            </div>
          ) : (
            posts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </div>
      </main>

      {/* Right Column: Profile Switcher & Suggested Creators (Desktop Only) */}
      <aside className="hidden lg:block w-72 shrink-0 pt-2 select-none">
        {/* Current user preview */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-900">
          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-700">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-white group-hover:text-pink-400 transition-colors">
                {currentUser.username}
              </p>
              <p className="text-xs text-zinc-400 truncate max-w-[140px]">{currentUser.name}</p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('profile')}
            className="text-xs font-semibold text-pink-500 hover:text-pink-400"
          >
            Profile
          </button>
        </div>

        {/* Suggestions for you */}
        <div className="mt-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-zinc-400">Suggested for you</span>
            <button
              onClick={() => setActiveTab('explore')}
              className="text-[11px] font-semibold text-zinc-300 hover:text-white"
            >
              See All
            </button>
          </div>

          <div className="space-y-3">
            {users.slice(0, 4).map((user) => (
              <div key={user.id} className="flex items-center justify-between">
                <div
                  onClick={() => setActiveTab('explore')}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-xs font-semibold text-white group-hover:text-pink-400 transition-colors">
                      {user.username}
                    </p>
                    <p className="text-[10px] text-zinc-500">
                      {user.followersCount.toLocaleString()} followers
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => followUser(user.id)}
                  className={`text-xs font-semibold transition-colors flex items-center gap-1 ${
                    user.isFollowing
                      ? 'text-zinc-400 hover:text-zinc-200'
                      : 'text-pink-500 hover:text-pink-400'
                  }`}
                >
                  {user.isFollowing ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-3 h-3" />
                      <span>Follow</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Minimal Footer */}
        <div className="mt-8 text-[11px] text-zinc-600 space-y-2">
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <span className="hover:underline cursor-pointer">About</span>·
            <span className="hover:underline cursor-pointer">Help</span>·
            <span className="hover:underline cursor-pointer">Privacy</span>·
            <span className="hover:underline cursor-pointer">Terms</span>·
            <span className="hover:underline cursor-pointer">Language (हिन्दी / English)</span>
          </div>
          <p>© 2026 INSTAVIBE · LIVE SOCIAL PLATFORM</p>
        </div>
      </aside>
    </div>
  );
};
