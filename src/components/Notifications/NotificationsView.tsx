import React from 'react';
import { Heart, MessageCircle, UserPlus, CheckCheck } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationsView: React.FC = () => {
  const { notifications, markAllNotificationsRead, followUser } = useApp();

  return (
    <div className="w-full max-w-xl mx-auto px-4 py-6 md:py-8 select-none text-white">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-4">
        <h2 className="text-lg font-bold">Notifications</h2>
        <button
          onClick={markAllNotificationsRead}
          className="text-xs text-pink-500 hover:text-pink-400 font-semibold flex items-center gap-1.5"
        >
          <CheckCheck className="w-4 h-4" />
          <span>Mark all as read</span>
        </button>
      </div>

      {/* Notifications List */}
      <div className="divide-y divide-zinc-900">
        {notifications.map((n) => {
          return (
            <div
              key={n.id}
              className={`flex items-center justify-between py-3.5 px-2 rounded-xl transition-colors ${
                !n.read ? 'bg-zinc-900/40' : 'hover:bg-zinc-900/20'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={n.user.avatar}
                    alt={n.user.name}
                    className="w-11 h-11 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Icon badge */}
                  <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-black border border-zinc-800">
                    {n.type === 'like' && <Heart className="w-3 h-3 text-pink-500 fill-pink-500" />}
                    {n.type === 'comment' && <MessageCircle className="w-3 h-3 text-blue-400 fill-blue-400" />}
                    {n.type === 'follow' && <UserPlus className="w-3 h-3 text-emerald-400" />}
                  </div>
                </div>

                <div className="text-xs leading-snug">
                  <p>
                    <span className="font-bold text-white mr-1.5">{n.user.username}</span>
                    <span className="text-zinc-300">{n.content}</span>
                  </p>
                  <span className="text-[10px] text-zinc-500 mt-0.5 block">{n.timestamp}</span>
                </div>
              </div>

              {/* Action item: either thumbnail or follow button */}
              {n.postThumbnail ? (
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-zinc-800">
                  <img
                    src={n.postThumbnail}
                    alt="Post thumbnail"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              ) : (
                <button
                  onClick={() => followUser(n.user.id)}
                  className="px-3 py-1 bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  {n.user.isFollowing ? 'Following' : 'Follow back'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
