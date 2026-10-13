import React, { useState, useRef } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  Volume2,
  VolumeX,
  Smile,
  Check,
} from 'lucide-react';
import { Post } from '../../types';
import { useApp } from '../../context/AppContext';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { toggleLikePost, toggleSavePost, addComment, users, startChatWithUser, sendMessage } =
    useApp();
  const [commentText, setCommentText] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [copiedLink, setCopiedLink] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle double tap to like
  const lastTapRef = useRef<number>(0);
  const handleMediaClick = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (!post.isLiked) {
        toggleLikePost(post.id);
      }
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 900);
    }
    lastTapRef.current = now;
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(post.id, commentText);
    setCommentText('');
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleShareToFriend = (user: any) => {
    const chatId = startChatWithUser(user);
    sendMessage(
      chatId,
      `Shared post by @${post.username}: "${post.caption.slice(0, 50)}..."`,
      post.mediaUrl,
      post.mediaType
    );
    setShowShareModal(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <article className="w-full bg-black border border-zinc-800/80 rounded-2xl overflow-hidden mb-6 shadow-sm">
      {/* Post Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full p-[2px] insta-gradient-border">
            <div className="w-full h-full rounded-full overflow-hidden bg-black p-[1px]">
              <img
                src={post.userAvatar}
                alt={post.username}
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold text-white hover:underline cursor-pointer">
                {post.username}
              </span>
              <span className="text-xs text-zinc-500" aria-hidden="true">
                ·
              </span>
              <span className="text-xs text-zinc-400">{post.timestamp}</span>
            </div>
            {post.location && (
              <span className="text-xs text-zinc-400 block leading-tight">{post.location}</span>
            )}
          </div>
        </div>

        <button
          className="text-zinc-400 hover:text-white p-1 rounded-lg"
          aria-label="More options"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Media Container with Double-tap Heart */}
      <div
        className="relative w-full aspect-square bg-zinc-950 flex items-center justify-center overflow-hidden cursor-pointer select-none"
        onClick={handleMediaClick}
      >
        {post.mediaType === 'video' ? (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              src={post.mediaUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="w-full h-full object-cover"
            />
            <button
              onClick={toggleMute}
              className="absolute bottom-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 backdrop-blur-sm z-10 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        ) : (
          <img
            src={post.mediaUrl}
            alt={post.caption || 'Post image'}
            className="w-full h-full object-cover transition-transform hover:scale-[1.01] duration-300"
            referrerPolicy="no-referrer"
          />
        )}

        {/* Double-tap floating heart pop */}
        {showHeartAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <Heart className="w-28 h-28 text-white fill-pink-600 drop-shadow-2xl animate-ping duration-500" />
          </div>
        )}
      </div>

      {/* Action Bar */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => toggleLikePost(post.id)}
              className="text-white hover:opacity-80 active:scale-125 transition-transform"
              aria-label={post.isLiked ? 'Unlike' : 'Like'}
            >
              <Heart
                className={`w-6 h-6 ${
                  post.isLiked ? 'text-pink-500 fill-pink-500' : 'text-white stroke-[1.75]'
                }`}
              />
            </button>

            <button
              onClick={() => setShowAllComments((prev) => !prev)}
              className="text-white hover:opacity-80 active:scale-110 transition-transform"
              aria-label="Comment"
            >
              <MessageCircle className="w-6 h-6 stroke-[1.75]" />
            </button>

            <button
              onClick={() => setShowShareModal(true)}
              className="text-white hover:opacity-80 active:scale-110 transition-transform"
              aria-label="Share"
            >
              <Send className="w-6 h-6 stroke-[1.75]" />
            </button>
          </div>

          <button
            onClick={() => toggleSavePost(post.id)}
            className="text-white hover:opacity-80 active:scale-110 transition-transform"
            aria-label={post.isSaved ? 'Unsave' : 'Save'}
          >
            <Bookmark
              className={`w-6 h-6 ${
                post.isSaved ? 'text-white fill-white' : 'text-white stroke-[1.75]'
              }`}
            />
          </button>
        </div>

        {/* Likes Count */}
        <div className="mt-2.5">
          <span className="text-sm font-bold text-white tabular-nums">
            {post.likesCount.toLocaleString()} likes
          </span>
        </div>

        {/* Caption */}
        <div className="mt-1 text-sm text-zinc-200 leading-snug">
          <span className="font-semibold text-white mr-2">{post.username}</span>
          <span>{post.caption}</span>
        </div>

        {/* Comments count toggle */}
        {post.comments.length > 0 && (
          <button
            onClick={() => setShowAllComments((prev) => !prev)}
            className="mt-1 text-xs text-zinc-400 hover:text-zinc-200 transition-colors block"
          >
            {showAllComments
              ? 'Hide comments'
              : `View all ${post.comments.length} comments`}
          </button>
        )}

        {/* Comments section */}
        {showAllComments && post.comments.length > 0 && (
          <div className="mt-2.5 space-y-2 max-h-48 overflow-y-auto no-scrollbar border-t border-zinc-900 pt-2">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-2 text-xs">
                <img
                  src={comment.userAvatar}
                  alt={comment.username}
                  className="w-5 h-5 rounded-full object-cover shrink-0 mt-0.5"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <span className="font-semibold text-white mr-1.5">{comment.username}</span>
                  <span className="text-zinc-300">{comment.text}</span>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-zinc-500">
                    <span>{comment.timestamp}</span>
                    <span>·</span>
                    <button className="hover:text-zinc-300">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add comment input bar */}
      <form
        onSubmit={handleCommentSubmit}
        className="flex items-center px-4 py-2.5 border-t border-zinc-900 mt-2"
      >
        <Smile className="w-5 h-5 text-zinc-500 mr-2.5 shrink-0" />
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          className="w-full bg-transparent text-sm text-white placeholder:text-zinc-500 focus:outline-none"
        />
        {commentText.trim() && (
          <button
            type="submit"
            className="text-pink-500 font-semibold text-sm hover:text-pink-400 shrink-0 ml-2"
          >
            Post
          </button>
        )}
      </form>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm p-4 text-white">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <h3 className="font-semibold text-sm">Share to Friends</h3>
              <button
                onClick={() => setShowShareModal(false)}
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
                    onClick={() => handleShareToFriend(u)}
                    className="px-3 py-1 bg-pink-600 text-white text-xs font-medium rounded-lg hover:bg-pink-500 transition-colors"
                  >
                    Send
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-800 flex justify-center">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-2 text-xs text-zinc-300 hover:text-white py-1.5 px-3 rounded-lg bg-zinc-800/60 w-full justify-center"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Send className="w-4 h-4" />}
                <span>{copiedLink ? 'Link copied!' : 'Copy Post Link'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
};
