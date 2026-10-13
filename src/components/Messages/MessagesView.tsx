import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Image as ImageIcon,
  Heart,
  Smile,
  Phone,
  Video,
  Info,
  ChevronLeft,
  CheckCheck,
  Search,
  Mic,
  PlusCircle,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User } from '../../types';

export const MessagesView: React.FC = () => {
  const {
    chats,
    activeChatId,
    setActiveChatId,
    sendMessage,
    startChatWithUser,
    reactToMessage,
    users,
    currentUser,
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [callNotice, setCallNotice] = useState<string | null>(null);
  const [mediaUploadPreview, setMediaUploadPreview] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  useEffect(() => {
    if (!activeChatId && chats.length > 0) {
      setActiveChatId(chats[0].id);
    }
  }, [chats, activeChatId, setActiveChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, activeChat?.isTyping]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if ((!messageInput.trim() && !mediaUploadPreview) || !activeChat) return;

    sendMessage(
      activeChat.id,
      messageInput,
      mediaUploadPreview || undefined,
      mediaUploadPreview ? 'image' : undefined
    );

    setMessageInput('');
    setMediaUploadPreview(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMediaUploadPreview(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendVoiceNote = () => {
    if (!activeChat) return;
    sendMessage(activeChat.id, '🎤 Voice note (0:14) [Audio recording]');
  };

  const triggerCall = (type: 'audio' | 'video') => {
    if (!activeChat) return;
    setCallNotice(`Calling ${activeChat.participant.name} (${type === 'audio' ? 'Voice' : 'Video'})...`);
    setTimeout(() => {
      setCallNotice(`${activeChat.participant.name} is currently unavailable for calls. Sent a message!`);
      setTimeout(() => setCallNotice(null), 3500);
    }, 2500);
  };

  const filteredChats = chats.filter(
    (c) =>
      c.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.participant.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto h-[calc(100vh-56px)] md:h-[calc(100vh-2rem)] my-0 md:my-4 flex border border-zinc-800 rounded-none md:rounded-2xl overflow-hidden bg-black text-white select-none">
      {/* Left Chat List Column */}
      <aside
        className={`${
          activeChatId && 'hidden md:flex'
        } w-full md:w-80 lg:w-96 flex flex-col border-r border-zinc-800 bg-zinc-950/80 shrink-0`}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">{currentUser.username}</h2>
            <span className="text-[10px] bg-pink-900/60 text-pink-300 font-semibold px-2 py-0.5 rounded-full">
              DMs
            </span>
          </div>
          <button
            onClick={() => setShowNewChatModal(true)}
            className="p-1.5 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors"
            title="Start new chat"
          >
            <PlusCircle className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-zinc-800/60">
          <div className="flex items-center gap-2 bg-zinc-900 rounded-xl px-3 py-1.5">
            <Search className="w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats or friends..."
              className="bg-transparent text-xs text-white placeholder:text-zinc-500 w-full focus:outline-none"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-zinc-900">
          {filteredChats.map((chat) => {
            const isSelected = activeChat?.id === chat.id;
            const lastMessage = chat.messages[chat.messages.length - 1];

            return (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`flex items-center gap-3 p-3.5 cursor-pointer transition-colors ${
                  isSelected ? 'bg-zinc-900' : 'hover:bg-zinc-900/40'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={chat.participant.avatar}
                    alt={chat.participant.name}
                    className="w-12 h-12 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {chat.participant.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-semibold text-white truncate">
                      {chat.participant.name}
                    </span>
                    {lastMessage && (
                      <span className="text-[10px] text-zinc-500">{lastMessage.timestamp}</span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 truncate">
                    {chat.isTyping ? (
                      <span className="text-pink-400 italic">typing...</span>
                    ) : lastMessage ? (
                      lastMessage.text
                    ) : (
                      'Started a conversation'
                    )}
                  </p>
                </div>

                {chat.unreadCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-pink-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                    {chat.unreadCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Right Active Conversation Area */}
      <main
        className={`${
          !activeChatId && 'hidden md:flex'
        } flex-1 flex flex-col bg-black justify-between h-full`}
      >
        {activeChat ? (
          <>
            {/* Chat Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-950/70">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveChatId(null)}
                  className="md:hidden p-1 rounded-lg text-zinc-400 hover:text-white"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="relative">
                  <img
                    src={activeChat.participant.avatar}
                    alt={activeChat.participant.name}
                    className="w-10 h-10 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {activeChat.participant.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-black rounded-full" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white leading-tight">
                    {activeChat.participant.name}
                  </h3>
                  <span className="text-[11px] text-zinc-400">
                    {activeChat.participant.isOnline ? 'Active now' : `@${activeChat.participant.username}`}
                  </span>
                </div>
              </div>

              {/* Call & Info Action Buttons */}
              <div className="flex items-center gap-1 text-zinc-300">
                <button
                  onClick={() => triggerCall('audio')}
                  className="p-2 rounded-xl hover:bg-zinc-800 hover:text-white transition-colors"
                  title="Voice Call"
                >
                  <Phone className="w-5 h-5" />
                </button>
                <button
                  onClick={() => triggerCall('video')}
                  className="p-2 rounded-xl hover:bg-zinc-800 hover:text-white transition-colors"
                  title="Video Call"
                >
                  <Video className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Notification Toast for Calls */}
            {callNotice && (
              <div className="bg-pink-950/80 border-b border-pink-800/60 px-4 py-2 text-center text-xs text-pink-200">
                {callNotice}
              </div>
            )}

            {/* Messages Stream */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
              {/* Profile Intro at the top */}
              <div className="flex flex-col items-center py-6 text-center border-b border-zinc-900 mb-4">
                <img
                  src={activeChat.participant.avatar}
                  alt={activeChat.participant.name}
                  className="w-16 h-16 rounded-full object-cover mb-2 border border-zinc-700"
                  referrerPolicy="no-referrer"
                />
                <h4 className="text-sm font-bold">{activeChat.participant.name}</h4>
                <p className="text-xs text-zinc-400">@{activeChat.participant.username}</p>
                <p className="text-xs text-zinc-500 mt-1 max-w-xs">{activeChat.participant.bio}</p>
              </div>

              {activeChat.messages.map((msg) => {
                const isMe = msg.senderId === currentUser.id;

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
                  >
                    <div className="flex items-end gap-1.5 max-w-[80%]">
                      {/* Reaction bar popover triggers */}
                      <div
                        className={`relative rounded-2xl px-4 py-2.5 text-xs ${
                          isMe
                            ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-br-sm'
                            : 'bg-zinc-900 text-zinc-100 rounded-bl-sm border border-zinc-800'
                        }`}
                      >
                        {msg.mediaUrl && (
                          <div className="rounded-xl overflow-hidden mb-2 max-w-xs">
                            <img
                              src={msg.mediaUrl}
                              alt="Attachment"
                              className="w-full h-auto object-cover rounded-xl"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                        {/* Reaction badge */}
                        {msg.reaction && (
                          <span className="absolute -bottom-2 right-2 bg-zinc-800 text-xs px-1.5 py-0.5 rounded-full border border-zinc-700 shadow-md">
                            {msg.reaction}
                          </span>
                        )}
                      </div>

                      {/* Quick Reaction Emoji Menu on hover */}
                      <div className="hidden group-hover:flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-full px-2 py-0.5 text-xs shadow-lg">
                        {['❤️', '😂', '🔥', '👏'].map((emoji) => (
                          <button
                            key={emoji}
                            onClick={() => reactToMessage(activeChat.id, msg.id, emoji)}
                            className="hover:scale-125 transition-transform"
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 mt-1 text-[10px] text-zinc-500 px-1">
                      <span>{msg.timestamp}</span>
                      {isMe && <CheckCheck className="w-3.5 h-3.5 text-pink-400" />}
                    </div>
                  </div>
                );
              })}

              {/* Real-time Friend Typing Indicator */}
              {activeChat.isTyping && (
                <div className="flex items-center gap-2 text-zinc-400 text-xs py-1">
                  <div className="w-6 h-6 rounded-full overflow-hidden">
                    <img
                      src={activeChat.participant.avatar}
                      alt={activeChat.participant.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-bounce delay-200" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Media Upload Preview if any */}
            {mediaUploadPreview && (
              <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={mediaUploadPreview}
                    alt="Preview"
                    className="w-12 h-12 rounded-lg object-cover border border-zinc-700"
                  />
                  <span className="text-xs text-zinc-400">Image attached</span>
                </div>
                <button
                  onClick={() => setMediaUploadPreview(null)}
                  className="p-1 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Input Bar */}
            <form
              onSubmit={handleSend}
              className="p-3 border-t border-zinc-800 bg-zinc-950/80 flex items-center gap-2"
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                className="hidden"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                title="Attach photo"
              >
                <ImageIcon className="w-5 h-5" />
              </button>

              <button
                type="button"
                onClick={handleSendVoiceNote}
                className="p-2 rounded-xl text-zinc-400 hover:text-pink-400 hover:bg-zinc-800 transition-colors"
                title="Send voice note"
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Message..."
                className="flex-1 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700"
              />

              {messageInput.trim() || mediaUploadPreview ? (
                <button
                  type="submit"
                  className="p-2 rounded-full bg-pink-600 text-white hover:bg-pink-500 active:scale-95 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setMessageInput('❤️');
                    setTimeout(() => handleSend(), 100);
                  }}
                  className="p-2 rounded-full text-zinc-400 hover:text-pink-500 hover:scale-110 active:scale-95 transition-all"
                >
                  <Heart className="w-5 h-5" />
                </button>
              )}
            </form>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center mb-3">
              <Send className="w-8 h-8 text-pink-500" />
            </div>
            <h3 className="text-base font-bold text-white">Your Messages</h3>
            <p className="text-xs text-zinc-400 mt-1 max-w-xs mb-4">
              Send private photos, videos, and messages to your friends.
            </p>
            <button
              onClick={() => setShowNewChatModal(true)}
              className="px-4 py-2 bg-pink-600 text-white text-xs font-semibold rounded-xl hover:bg-pink-500 transition-colors"
            >
              Send Message
            </button>
          </div>
        )}
      </main>

      {/* New Chat Modal: Select Any User to Start Chatting */}
      {showNewChatModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-sm overflow-hidden text-white shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <h3 className="font-bold text-sm">New Message</h3>
              <button
                onClick={() => setShowNewChatModal(false)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 max-h-72 overflow-y-auto no-scrollbar space-y-2">
              <span className="text-[11px] text-zinc-400 font-semibold px-2">Suggested Friends</span>
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    startChatWithUser(user);
                    setShowNewChatModal(false);
                  }}
                  className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-800 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <p className="text-xs font-semibold text-white">{user.name}</p>
                      <p className="text-[11px] text-zinc-400">@{user.username}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-pink-600 hover:bg-pink-500 text-white text-xs font-medium rounded-lg">
                    Chat
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
