import React, { useState, useRef } from 'react';
import {
  Grid,
  Film,
  Bookmark,
  Settings,
  Edit3,
  Check,
  Plus,
  X,
  Camera,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Post, Reel } from '../../types';

export const ProfileView: React.FC = () => {
  const { currentUser, updateCurrentUser, posts, reels, setIsCreateModalOpen, setCreateModalInitialType } =
    useApp();
  const [activeTab, setActiveTab] = useState<'posts' | 'reels' | 'saved'>('posts');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit profile form state
  const [editName, setEditName] = useState(currentUser.name);
  const [editUsername, setEditUsername] = useState(currentUser.username);
  const [editBio, setEditBio] = useState(currentUser.bio);
  const [editWebsite, setEditWebsite] = useState(currentUser.website || '');
  const [editAvatar, setEditAvatar] = useState(currentUser.avatar);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter user's posts, reels, and saved items
  const userPosts = posts.filter((p) => p.userId === currentUser.id);
  const userReels = reels.filter((r) => r.userId === currentUser.id);
  const savedPosts = posts.filter((p) => p.isSaved);

  const highlights = [
    { id: '1', title: 'Trips ✈️', image: '/src/assets/images/feed_travel_sunset_1791873734304.jpg' },
    { id: '2', title: 'Cafes ☕', image: '/src/assets/images/feed_coffee_flatlay_1791873734112.jpg' },
    { id: '3', title: 'Hikes 🏔️', image: '/src/assets/images/story_mountain_hike_1791873734452.jpg' },
    { id: '4', title: 'Vibes ✨', image: '/src/assets/images/reels_dance_rooftop_1791873733287.jpg' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({
      name: editName,
      username: editUsername,
      bio: editBio,
      website: editWebsite,
      avatar: editAvatar,
    });
    setIsEditModalOpen(false);
  };

  const handleAvatarFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setEditAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 md:py-10 select-none text-white">
      {/* Profile Header */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-12 pb-8 border-b border-zinc-900">
        {/* Avatar with Gradient border */}
        <div className="relative group cursor-pointer" onClick={() => setIsEditModalOpen(true)}>
          <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-full p-[3px] insta-gradient-border shadow-xl">
            <div className="w-full h-full rounded-full overflow-hidden bg-black p-[2px]">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* User Details & Bio */}
        <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mb-4">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              {currentUser.username}
            </h1>
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="px-4 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit profile</span>
            </button>
            <button
              onClick={() => {
                setCreateModalInitialType('post');
                setIsCreateModalOpen(true);
              }}
              className="px-4 py-1.5 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Post</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center gap-8 mb-4 text-sm">
            <div>
              <span className="font-bold text-white tabular-nums">{userPosts.length}</span>{' '}
              <span className="text-zinc-400">posts</span>
            </div>
            <div>
              <span className="font-bold text-white tabular-nums">
                {currentUser.followersCount.toLocaleString()}
              </span>{' '}
              <span className="text-zinc-400">followers</span>
            </div>
            <div>
              <span className="font-bold text-white tabular-nums">
                {currentUser.followingCount.toLocaleString()}
              </span>{' '}
              <span className="text-zinc-400">following</span>
            </div>
          </div>

          {/* Bio & Link */}
          <div className="space-y-1 text-xs sm:text-sm">
            <p className="font-semibold text-white">{currentUser.name}</p>
            <p className="text-zinc-300 max-w-md leading-relaxed whitespace-pre-line">
              {currentUser.bio}
            </p>
            {currentUser.website && (
              <a
                href={currentUser.website}
                target="_blank"
                rel="noreferrer"
                className="text-pink-400 font-medium hover:underline block pt-1"
              >
                {currentUser.website}
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stories Highlights Carousel */}
      <div className="py-6 border-b border-zinc-900 overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-6 min-w-max">
          {highlights.map((h) => (
            <div key={h.id} className="flex flex-col items-center gap-2 cursor-pointer group">
              <div className="w-16 h-16 rounded-full p-[2px] border border-zinc-700 group-hover:border-zinc-500 transition-colors">
                <div className="w-full h-full rounded-full overflow-hidden bg-zinc-900">
                  <img
                    src={h.image}
                    alt={h.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
              <span className="text-xs text-zinc-300 font-medium">{h.title}</span>
            </div>
          ))}

          {/* Add Highlight Button */}
          <div
            onClick={() => {
              setCreateModalInitialType('story');
              setIsCreateModalOpen(true);
            }}
            className="flex flex-col items-center gap-2 cursor-pointer group"
          >
            <div className="w-16 h-16 rounded-full border border-dashed border-zinc-700 group-hover:border-zinc-500 flex items-center justify-center">
              <Plus className="w-6 h-6 text-zinc-400 group-hover:text-white" />
            </div>
            <span className="text-xs text-zinc-400 font-medium">New</span>
          </div>
        </div>
      </div>

      {/* Profile Segmented Tabs */}
      <div className="flex items-center justify-center gap-12 border-b border-zinc-900">
        <button
          onClick={() => setActiveTab('posts')}
          className={`flex items-center gap-2 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-t-2 -mt-[2px] ${
            activeTab === 'posts'
              ? 'border-white text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Posts ({userPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reels')}
          className={`flex items-center gap-2 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-t-2 -mt-[2px] ${
            activeTab === 'reels'
              ? 'border-white text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Reels ({userReels.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors border-t-2 -mt-[2px] ${
            activeTab === 'saved'
              ? 'border-white text-white'
              : 'border-transparent text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved ({savedPosts.length})</span>
        </button>
      </div>

      {/* Grid Content */}
      <div className="pt-6">
        {activeTab === 'posts' && (
          <div className="grid grid-cols-3 gap-1 md:gap-3">
            {userPosts.map((post) => (
              <div
                key={post.id}
                className="relative group aspect-square bg-zinc-900 overflow-hidden rounded-lg cursor-pointer"
              >
                <img
                  src={post.mediaUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-bold text-xs">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{post.likesCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>{post.commentsCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'reels' && (
          <div className="grid grid-cols-3 gap-1 md:gap-3">
            {userReels.map((reel) => (
              <div
                key={reel.id}
                className="relative group aspect-[9/16] bg-zinc-900 overflow-hidden rounded-lg cursor-pointer"
              >
                <img
                  src={reel.thumbnailUrl || reel.videoUrl}
                  alt={reel.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white font-bold text-xs">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 fill-white" />
                    <span>{reel.likesCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="grid grid-cols-3 gap-1 md:gap-3">
            {savedPosts.map((post) => (
              <div
                key={post.id}
                className="relative group aspect-square bg-zinc-900 overflow-hidden rounded-lg cursor-pointer"
              >
                <img
                  src={post.mediaUrl}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md overflow-hidden text-white shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h3 className="font-bold text-sm">Edit Profile</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-4 space-y-4">
              {/* Avatar changer */}
              <div className="flex items-center gap-4">
                <img
                  src={editAvatar}
                  alt="Avatar"
                  className="w-16 h-16 rounded-full object-cover border border-zinc-700"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarFile}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-semibold text-white transition-colors"
                  >
                    Change photo
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-medium block mb-1">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-medium block mb-1">Username</label>
                <input
                  type="text"
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-medium block mb-1">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-700 resize-none"
                />
              </div>

              <div>
                <label className="text-xs text-zinc-400 font-medium block mb-1">Website</label>
                <input
                  type="url"
                  value={editWebsite}
                  onChange={(e) => setEditWebsite(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-zinc-700"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-semibold text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-500 rounded-xl text-xs font-semibold text-white transition-colors"
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
