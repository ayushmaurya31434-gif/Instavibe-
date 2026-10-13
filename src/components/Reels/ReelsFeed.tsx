import React, { useState, useRef, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Volume2,
  VolumeX,
  Music,
  ChevronUp,
  ChevronDown,
  UserPlus,
  Check,
  PlusSquare,
  X,
  Smile,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReelsFeed: React.FC = () => {
  const {
    reels,
    toggleLikeReel,
    toggleSaveReel,
    toggleFollowReelUser,
    addReelComment,
    startChatWithUser,
    sendMessage,
    users,
    setIsCreateModalOpen,
    setCreateModalInitialType,
  } = useApp();

  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeCommentsReelId, setActiveCommentsReelId] = useState<string | null>(null);
  const [commentInput, setCommentInput] = useState('');
  const [shareReelId, setShareReelId] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);

  const currentReel = reels[activeIndex];

  const handleNext = () => {
    if (activeIndex < reels.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') handleNext();
      if (e.key === 'ArrowUp') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, reels.length]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !activeCommentsReelId) return;
    addReelComment(activeCommentsReelId, commentInput);
    setCommentInput('');
  };

  const handleShareToUser = (user: any) => {
    if (!currentReel) return;
    const chatId = startChatWithUser(user);
    sendMessage(
      chatId,
      `Shared Reel by @${currentReel.username}: "${currentReel.caption.slice(0, 40)}..."`,
      currentReel.thumbnailUrl || currentReel.videoUrl,
      'video'
    );
    setShareReelId(null);
  };

  if (!currentReel) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
        <p className="text-zinc-400 mb-4">No reels found</p>
        <button
          onClick={() => {
            setCreateModalInitialType('reel');
            setIsCreateModalOpen(true);
          }}
          className="px-4 py-2 bg-pink-600 rounded-xl text-white text-sm font-semibold"
        >
          Create First Reel
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[calc(100vh-56px)] md:h-screen flex items-center justify-center bg-black overflow-hidden py-2 md:py-4 select-none">
      {/* Up/Down Navigation Floating Controls */}
      <div className="hidden md:flex flex-col gap-3 absolute right-8 top-1/2 -translate-y-1/2 z-30">
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className={`p-3 rounded-full bg-zinc-900/80 border border-zinc-800 text-white transition-all ${
            activeIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110 hover:bg-zinc-800'
          }`}
          aria-label="Previous reel"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNext}
          disabled={activeIndex === reels.length - 1}
          className={`p-3 rounded-full bg-zinc-900/80 border border-zinc-800 text-white transition-all ${
            activeIndex === reels.length - 1
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:scale-110 hover:bg-zinc-800'
          }`}
          aria-label="Next reel"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Main Reel Card Container (9:16 aspect ratio) */}
      <div className="relative w-full max-w-[390px] h-[95vh] max-h-[760px] rounded-2xl overflow-hidden bg-zinc-950 shadow-2xl flex items-center justify-center border border-zinc-800/80">
        {/* Video Player */}
        <div className="relative w-full h-full cursor-pointer" onClick={togglePlay}>
          <video
            ref={videoRef}
            key={currentReel.id}
            src={currentReel.videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            className="w-full h-full object-cover"
          />

          {/* Mute Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMuted((prev) => !prev);
            }}
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black/70 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Pause overlay indicator */}
          {!isPlaying && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30">
              <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center text-white">
                <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-14 border-l-white ml-1" />
              </div>
            </div>
          )}

          {/* Gradient Scrim for readable bottom text */}
          <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

          {/* Reel Information Bottom Overlay */}
          <div className="absolute bottom-4 left-4 right-16 z-20 text-white pointer-events-auto">
            {/* Author info & Follow button */}
            <div className="flex items-center gap-2.5 mb-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-white/60">
                <img
                  src={currentReel.userAvatar}
                  alt={currentReel.username}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="text-sm font-bold tracking-tight">@{currentReel.username}</span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFollowReelUser(currentReel.id);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors flex items-center gap-1 ${
                  currentReel.isFollowing
                    ? 'bg-white/20 text-white hover:bg-white/30'
                    : 'bg-pink-600 text-white hover:bg-pink-500'
                }`}
              >
                {currentReel.isFollowing ? (
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

            {/* Caption */}
            <p className="text-xs text-zinc-100 line-clamp-2 leading-relaxed mb-2.5">
              {currentReel.caption}
            </p>

            {/* Audio Track Tag with rotating icon effect */}
            <div className="flex items-center gap-2 text-[11px] text-zinc-300">
              <Music className="w-3.5 h-3.5 animate-spin duration-3000" />
              <span className="truncate max-w-[200px]">{currentReel.audioTitle}</span>
            </div>
          </div>

          {/* Right Action Stack */}
          <div className="absolute bottom-6 right-2.5 z-20 flex flex-col items-center gap-4 text-white pointer-events-auto">
            {/* Like */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLikeReel(currentReel.id);
              }}
              className="flex flex-col items-center group"
            >
              <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md group-hover:bg-black/60 active:scale-125 transition-transform">
                <Heart
                  className={`w-6 h-6 ${
                    currentReel.isLiked ? 'text-pink-500 fill-pink-500' : 'text-white'
                  }`}
                />
              </div>
              <span className="text-[11px] font-bold mt-1 tabular-nums drop-shadow">
                {currentReel.likesCount.toLocaleString()}
              </span>
            </button>

            {/* Comments */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveCommentsReelId(currentReel.id);
              }}
              className="flex flex-col items-center group"
            >
              <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md group-hover:bg-black/60 active:scale-110 transition-transform">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-[11px] font-bold mt-1 tabular-nums drop-shadow">
                {currentReel.commentsCount.toLocaleString()}
              </span>
            </button>

            {/* Share */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShareReelId(currentReel.id);
              }}
              className="flex flex-col items-center group"
            >
              <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md group-hover:bg-black/60 active:scale-110 transition-transform">
                <Send className="w-6 h-6 text-white" />
              </div>
              <span className="text-[11px] font-bold mt-1 tabular-nums drop-shadow">
                {currentReel.sharesCount.toLocaleString()}
              </span>
            </button>

            {/* Save */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleSaveReel(currentReel.id);
              }}
              className="flex flex-col items-center group"
            >
              <div className="p-2.5 rounded-full bg-black/40 backdrop-blur-md group-hover:bg-black/60 active:scale-110 transition-transform">
                <Bookmark
                  className={`w-6 h-6 ${
                    currentReel.isSaved ? 'text-white fill-white' : 'text-white'
                  }`}
                />
              </div>
            </button>

            {/* Upload Reel Shortcut */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCreateModalInitialType('reel');
                setIsCreateModalOpen(true);
              }}
              className="flex flex-col items-center p-2 rounded-full bg-pink-600/80 backdrop-blur-md text-white hover:bg-pink-600 active:scale-95 transition-all shadow-md mt-1"
              title="Add your own Reel"
            >
              <PlusSquare className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Slide-over Comments Drawer for Reel */}
      {activeCommentsReelId && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-t-3xl md:rounded-2xl w-full max-w-md h-[60vh] max-h-[500px] flex flex-col overflow-hidden text-white">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
              <span className="font-bold text-sm">Comments</span>
              <button
                onClick={() => setActiveCommentsReelId(null)}
                className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {currentReel.comments && currentReel.comments.length > 0 ? (
                currentReel.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3 text-xs">
                    <img
                      src={comment.userAvatar}
                      alt={comment.username}
                      className="w-7 h-7 rounded-full object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-semibold text-white">{comment.username}</span>
                        <span className="text-[10px] text-zinc-500">{comment.timestamp}</span>
                      </div>
                      <p className="text-zinc-200 mt-0.5 leading-snug">{comment.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12 text-zinc-500 text-xs">
                  No comments yet. Start the conversation!
                </div>
              )}
            </div>

            {/* Input bar */}
            <form
              onSubmit={handleSendComment}
              className="flex items-center px-4 py-3 border-t border-zinc-800 bg-zinc-950"
            >
              <Smile className="w-5 h-5 text-zinc-400 mr-2" />
              <input
                type="text"
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Add a comment..."
                className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
              />
              {commentInput.trim() && (
                <button
                  type="submit"
                  className="text-pink-500 font-bold text-xs ml-2 hover:text-pink-400"
                >
                  Post
                </button>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Share Reel to Friends Modal */}
      {shareReelId && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-semibold text-sm">Send Reel to Friends</h3>
              <button
                onClick={() => setShareReelId(null)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                Cancel
              </button>
            </div>

            <div className="py-3 space-y-2 max-h-60 overflow-y-auto no-scrollbar">
              {users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <img
                      src={u.avatar}
                      alt={u.name}
                      className="w-9 h-9 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="text-xs font-semibold">{u.name}</p>
                      <p className="text-[11px] text-zinc-400">@{u.username}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleShareToUser(u)}
                    className="px-3 py-1 bg-pink-600 text-white text-xs font-medium rounded-lg hover:bg-pink-500 transition-colors"
                  >
                    Send
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
