import React, { useState } from 'react';
import { Search, Heart, MessageCircle, Play, X, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Post, Reel } from '../../types';

export const ExploreGrid: React.FC = () => {
  const { posts, reels, toggleLikePost, addComment, startChatWithUser, users } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedItem, setSelectedItem] = useState<{ type: 'post' | 'reel'; item: Post | Reel } | null>(
    null
  );
  const [modalComment, setModalComment] = useState('');

  const categories = ['All', 'Travel', 'Reels', 'Aesthetic', 'Photography', 'Music'];

  // Combine posts and reels for explore feed
  const exploreItems: Array<{ type: 'post' | 'reel'; data: Post | Reel }> = [
    ...reels.map((r) => ({ type: 'reel' as const, data: r })),
    ...posts.map((p) => ({ type: 'post' as const, data: p })),
  ];

  const filteredItems = exploreItems.filter((entry) => {
    const item = entry.data;
    const captionMatch = item.caption.toLowerCase().includes(searchQuery.toLowerCase());
    const userMatch = item.username.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeCategory === 'Reels') return entry.type === 'reel';
    if (activeCategory === 'Travel') return item.caption.toLowerCase().includes('travel') || item.caption.toLowerCase().includes('coast') || item.caption.toLowerCase().includes('sunset') || item.caption.toLowerCase().includes('mountain');
    if (activeCategory === 'Aesthetic') return item.caption.toLowerCase().includes('coffee') || item.caption.toLowerCase().includes('morning') || item.caption.toLowerCase().includes('vibe');
    if (activeCategory === 'Music') return entry.type === 'reel';

    return captionMatch || userMatch;
  });

  const handleAddModalComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalComment.trim() || !selectedItem) return;

    if (selectedItem.type === 'post') {
      addComment((selectedItem.item as Post).id, modalComment);
    }
    setModalComment('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-6 py-4 md:py-6 select-none">
      {/* Search Header */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="relative w-full max-w-md mx-auto">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search creators, hashtags, reels..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
          />
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 transition-colors ${
                activeCategory === cat
                  ? 'bg-white text-black'
                  : 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Explore Masonry / Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-1 md:gap-2">
        {filteredItems.map((entry, idx) => {
          const item = entry.data;
          const isReel = entry.type === 'reel';
          const mediaThumbnail =
            isReel
              ? (item as Reel).thumbnailUrl || (item as Reel).videoUrl
              : (item as Post).mediaUrl;

          return (
            <div
              key={`${entry.type}_${item.id}_${idx}`}
              onClick={() => setSelectedItem({ type: entry.type, item })}
              className={`relative group bg-zinc-900 overflow-hidden cursor-pointer rounded-lg aspect-square ${
                idx % 7 === 1 ? 'row-span-2 aspect-[9/16]' : ''
              }`}
            >
              <img
                src={mediaThumbnail}
                alt={item.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />

              {/* Reel indicator icon */}
              {isReel && (
                <div className="absolute top-2 right-2 p-1 rounded-md bg-black/60 text-white backdrop-blur-sm">
                  <Play className="w-3.5 h-3.5 fill-white" />
                </div>
              )}

              {/* Hover overlay with likes & comments */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-xs">
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4 fill-white" />
                  <span className="tabular-nums">{item.likesCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span className="tabular-nums">{item.commentsCount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal Preview */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col md:flex-row text-white shadow-2xl">
            {/* Close button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-3 right-3 z-30 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/90"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Media side */}
            <div className="flex-1 bg-black flex items-center justify-center max-h-[50vh] md:max-h-full">
              {selectedItem.type === 'reel' ? (
                <video
                  src={(selectedItem.item as Reel).videoUrl}
                  autoPlay
                  loop
                  controls
                  className="w-full h-full max-h-[70vh] object-contain"
                />
              ) : (
                <img
                  src={(selectedItem.item as Post).mediaUrl}
                  alt="Post preview"
                  className="w-full h-full max-h-[70vh] object-contain"
                  referrerPolicy="no-referrer"
                />
              )}
            </div>

            {/* Content side */}
            <div className="w-full md:w-80 flex flex-col justify-between border-t md:border-t-0 md:border-l border-zinc-800 p-4">
              <div>
                {/* Author */}
                <div className="flex items-center gap-3 pb-3 border-b border-zinc-900">
                  <img
                    src={selectedItem.item.userAvatar}
                    alt={selectedItem.item.username}
                    className="w-9 h-9 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <p className="text-xs font-bold">{selectedItem.item.username}</p>
                    <p className="text-[10px] text-zinc-400">InstaVibe Creator</p>
                  </div>
                </div>

                {/* Caption */}
                <div className="py-3 text-xs text-zinc-300 leading-relaxed border-b border-zinc-900">
                  <span className="font-bold text-white mr-1.5">
                    {selectedItem.item.username}
                  </span>
                  <span>{selectedItem.item.caption}</span>
                </div>

                {/* Likes info */}
                <div className="py-3 text-xs font-bold text-white">
                  {selectedItem.item.likesCount.toLocaleString()} likes
                </div>
              </div>

              {/* Modal Comment Input */}
              {selectedItem.type === 'post' && (
                <form
                  onSubmit={handleAddModalComment}
                  className="flex items-center pt-3 border-t border-zinc-900"
                >
                  <input
                    type="text"
                    value={modalComment}
                    onChange={(e) => setModalComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none"
                  />
                  {modalComment.trim() && (
                    <button
                      type="submit"
                      className="ml-2 text-pink-500 font-bold text-xs hover:text-pink-400"
                    >
                      Post
                    </button>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
