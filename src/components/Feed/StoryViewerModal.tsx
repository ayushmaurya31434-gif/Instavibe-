import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Send, ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const StoryViewerModal: React.FC = () => {
  const {
    stories,
    activeStoryIndex,
    closeStoryViewer,
    markStorySeen,
    sendMessage,
    startChatWithUser,
    users,
    currentUser,
  } = useApp();

  const [currentIndex, setCurrentIndex] = useState<number>(activeStoryIndex ?? 0);
  const [progress, setProgress] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [replyText, setReplyText] = useState<string>('');
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [showHeartBurst, setShowHeartBurst] = useState<boolean>(false);

  const durationMs = 5000;
  const intervalStepMs = 50;

  useEffect(() => {
    if (activeStoryIndex !== null) {
      setCurrentIndex(activeStoryIndex);
      setProgress(0);
      setHasLiked(false);
    }
  }, [activeStoryIndex]);

  const currentStory = stories[currentIndex];

  useEffect(() => {
    if (!currentStory || currentStory.seen) return;
    markStorySeen(currentStory.id);
  }, [currentIndex, currentStory?.id, currentStory?.seen, markStorySeen]);

  // Timer loop for progress bar
  useEffect(() => {
    if (activeStoryIndex === null || isPaused) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (intervalStepMs / durationMs) * 100;
        if (next >= 100) {
          return 100;
        }
        return next;
      });
    }, intervalStepMs);

    return () => clearInterval(timer);
  }, [activeStoryIndex, currentIndex, isPaused]);

  // Advance to next story when progress reaches 100%
  useEffect(() => {
    if (progress >= 100) {
      handleNext();
    }
  }, [progress]);

  const handleNext = () => {
    setProgress(0);
    setHasLiked(false);
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      closeStoryViewer();
    }
  };

  const handlePrev = () => {
    setProgress(0);
    setHasLiked(false);
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !currentStory) return;

    // Find the participant
    const friend = users.find((u) => u.id === currentStory.userId) || {
      id: currentStory.userId,
      username: currentStory.username,
      name: currentStory.username,
      avatar: currentStory.userAvatar,
      bio: '',
      followersCount: 100,
      followingCount: 100,
    };

    const chatId = startChatWithUser(friend);
    sendMessage(chatId, `Replied to your story: "${replyText.trim()}"`);
    setReplyText('');
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 1200);
  };

  const handleLikeStory = () => {
    setHasLiked((prev) => !prev);
    setShowHeartBurst(true);
    setTimeout(() => setShowHeartBurst(false), 1200);

    if (currentStory && currentStory.userId !== currentUser.id) {
      const friend = users.find((u) => u.id === currentStory.userId) || {
        id: currentStory.userId,
        username: currentStory.username,
        name: currentStory.username,
        avatar: currentStory.userAvatar,
        bio: '',
        followersCount: 100,
        followingCount: 100,
      };
      const chatId = startChatWithUser(friend);
      sendMessage(chatId, '❤️ Liked your story!');
    }
  };

  if (activeStoryIndex === null || !currentStory) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center select-none">
      {/* Close button */}
      <button
        onClick={closeStoryViewer}
        className="absolute top-4 right-4 z-50 p-2.5 rounded-full bg-zinc-900/80 text-white hover:bg-zinc-800 transition-colors"
        aria-label="Close story"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Desktop Navigation Chevrons */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrev}
          className="hidden md:flex absolute left-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white transition-all hover:scale-110"
          aria-label="Previous story"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {currentIndex < stories.length - 1 && (
        <button
          onClick={handleNext}
          className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 z-40 p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-white transition-all hover:scale-110"
          aria-label="Next story"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Main Story Container */}
      <div
        className="relative w-full max-w-[420px] h-[92vh] max-h-[840px] rounded-2xl overflow-hidden bg-zinc-950 shadow-2xl flex flex-col justify-between"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress Bars */}
        <div className="absolute top-3 left-3 right-3 z-30 flex items-center gap-1.5">
          {stories.map((s, idx) => {
            let widthPercent = 0;
            if (idx < currentIndex) widthPercent = 100;
            else if (idx === currentIndex) widthPercent = progress;

            return (
              <div
                key={s.id}
                className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden"
              >
                <div
                  className="h-full bg-white transition-all duration-75"
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* Story Header */}
        <div className="absolute top-7 left-3 right-3 z-30 flex items-center justify-between text-white drop-shadow">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full overflow-hidden border border-white/60">
              <img
                src={currentStory.userAvatar}
                alt={currentStory.username}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="text-xs font-bold leading-tight block">
                {currentStory.username}
              </span>
              <span className="text-[10px] text-zinc-300 font-medium">
                {currentStory.timestamp}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
          >
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
        </div>

        {/* Story Media */}
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          {currentStory.mediaType === 'video' ? (
            <video
              src={currentStory.mediaUrl}
              autoPlay
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={currentStory.mediaUrl}
              alt="Story"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          )}

          {/* Touch navigation zones */}
          <div
            onClick={handlePrev}
            className="absolute left-0 top-16 bottom-20 w-1/3 z-20 cursor-pointer"
          />
          <div
            onClick={handleNext}
            className="absolute right-0 top-16 bottom-20 w-2/3 z-20 cursor-pointer"
          />

          {/* Story Caption Overlay */}
          {currentStory.caption && (
            <div className="absolute bottom-20 left-4 right-4 z-20 p-3 rounded-xl bg-black/60 backdrop-blur-md text-white text-center text-sm font-medium border border-white/10 shadow-lg">
              {currentStory.caption}
            </div>
          )}

          {/* Heart Burst Animation */}
          {showHeartBurst && (
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none animate-ping duration-700">
              <Heart className="w-24 h-24 text-pink-500 fill-pink-500 drop-shadow-xl" />
            </div>
          )}
        </div>

        {/* Bottom Interactive Bar (Reply & React) */}
        <div className="absolute bottom-3 left-3 right-3 z-30 flex items-center gap-2">
          <form
            onSubmit={handleSendReply}
            className="flex-1 flex items-center bg-black/60 backdrop-blur-md border border-white/20 rounded-full px-4 py-2"
          >
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder={`Reply to ${currentStory.username}...`}
              className="w-full bg-transparent text-white text-xs placeholder:text-zinc-400 focus:outline-none"
            />
            {replyText.trim() && (
              <button
                type="submit"
                className="text-pink-500 font-bold text-xs ml-2 hover:text-pink-400"
              >
                Send
              </button>
            )}
          </form>

          <button
            onClick={handleLikeStory}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:scale-110 active:scale-95 transition-all"
            aria-label="Like story"
          >
            <Heart
              className={`w-6 h-6 transition-colors ${
                hasLiked ? 'text-pink-500 fill-pink-500' : 'text-white'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
