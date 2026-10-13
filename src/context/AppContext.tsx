import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Post, Story, Reel, Chat, NotificationItem, Comment } from '../types';
import {
  CURRENT_USER,
  INITIAL_POSTS,
  INITIAL_STORIES,
  INITIAL_REELS,
  INITIAL_CHATS,
  INITIAL_NOTIFICATIONS,
  MOCK_USERS,
} from '../data/mockData';

interface AppContextType {
  currentUser: User;
  updateCurrentUser: (updates: Partial<User>) => void;
  posts: Post[];
  toggleLikePost: (postId: string) => void;
  toggleSavePost: (postId: string) => void;
  addComment: (postId: string, text: string) => void;
  createPost: (postData: {
    mediaUrl: string;
    mediaType: 'image' | 'video';
    caption: string;
    location?: string;
    filter?: string;
  }) => void;
  stories: Story[];
  markStorySeen: (storyId: string) => void;
  createStory: (storyData: {
    mediaUrl: string;
    mediaType: 'image' | 'video';
    caption?: string;
  }) => void;
  reels: Reel[];
  toggleLikeReel: (reelId: string) => void;
  toggleSaveReel: (reelId: string) => void;
  toggleFollowReelUser: (reelId: string) => void;
  addReelComment: (reelId: string, text: string) => void;
  createReel: (reelData: {
    videoUrl: string;
    caption: string;
    audioTitle: string;
    thumbnailUrl?: string;
  }) => void;
  chats: Chat[];
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
  sendMessage: (chatId: string, text: string, mediaUrl?: string, mediaType?: 'image' | 'video') => void;
  startChatWithUser: (user: User) => string;
  reactToMessage: (chatId: string, messageId: string, emoji: string) => void;
  notifications: NotificationItem[];
  markAllNotificationsRead: () => void;
  unreadMessagesCount: number;
  unreadNotificationsCount: number;
  activeTab: 'home' | 'explore' | 'reels' | 'messages' | 'notifications' | 'profile';
  setActiveTab: (tab: 'home' | 'explore' | 'reels' | 'messages' | 'notifications' | 'profile') => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  createModalInitialType: 'post' | 'story' | 'reel';
  setCreateModalInitialType: (type: 'post' | 'story' | 'reel') => void;
  activeStoryIndex: number | null;
  openStoryViewer: (index: number) => void;
  closeStoryViewer: () => void;
  isDownloadModalOpen: boolean;
  setIsDownloadModalOpen: (open: boolean) => void;
  users: User[];
  followUser: (userId: string) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence helpers
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('instavibe_user');
    return saved ? JSON.parse(saved) : CURRENT_USER;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('instavibe_posts');
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('instavibe_stories');
    return saved ? JSON.parse(saved) : INITIAL_STORIES;
  });

  const [reels, setReels] = useState<Reel[]>(() => {
    const saved = localStorage.getItem('instavibe_reels');
    return saved ? JSON.parse(saved) : INITIAL_REELS;
  });

  const [chats, setChats] = useState<Chat[]>(() => {
    const saved = localStorage.getItem('instavibe_chats');
    return saved ? JSON.parse(saved) : INITIAL_CHATS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('instavibe_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'explore' | 'reels' | 'messages' | 'notifications' | 'profile'>('home');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createModalInitialType, setCreateModalInitialType] = useState<'post' | 'story' | 'reel'>('post');
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem('instavibe_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('instavibe_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('instavibe_stories', JSON.stringify(stories));
  }, [stories]);

  useEffect(() => {
    localStorage.setItem('instavibe_reels', JSON.stringify(reels));
  }, [reels]);

  useEffect(() => {
    localStorage.setItem('instavibe_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('instavibe_notifs', JSON.stringify(notifications));
  }, [notifications]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    setCurrentUser((prev) => ({ ...prev, ...updates }));
  };

  // Post Actions
  const toggleLikePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newLiked = !post.isLiked;
          return {
            ...post,
            isLiked: newLiked,
            likesCount: newLiked ? post.likesCount + 1 : post.likesCount - 1,
          };
        }
        return post;
      })
    );
  };

  const toggleSavePost = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, isSaved: !post.isSaved } : post))
    );
  };

  const addComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: `c_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      text: text.trim(),
      timestamp: 'Just now',
      likesCount: 0,
    };

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          return {
            ...post,
            commentsCount: post.commentsCount + 1,
            comments: [...post.comments, newComment],
          };
        }
        return post;
      })
    );
  };

  const createPost = ({
    mediaUrl,
    mediaType,
    caption,
    location,
    filter,
  }: {
    mediaUrl: string;
    mediaType: 'image' | 'video';
    caption: string;
    location?: string;
    filter?: string;
  }) => {
    const newPost: Post = {
      id: `post_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      location: location || 'Delhi / Mumbai',
      mediaType,
      mediaUrl,
      caption,
      timestamp: 'Just now',
      likesCount: 1,
      isLiked: true,
      isSaved: false,
      commentsCount: 0,
      comments: [],
      filter,
    };
    setPosts((prev) => [newPost, ...prev]);
    setActiveTab('home');
  };

  // Story Actions
  const markStorySeen = (storyId: string) => {
    setStories((prev) => {
      const target = prev.find((s) => s.id === storyId);
      if (!target || target.seen) return prev;
      return prev.map((story) => (story.id === storyId ? { ...story, seen: true } : story));
    });
  };

  const createStory = ({
    mediaUrl,
    mediaType,
    caption,
  }: {
    mediaUrl: string;
    mediaType: 'image' | 'video';
    caption?: string;
  }) => {
    const newStory: Story = {
      id: `story_${Date.now()}`,
      userId: currentUser.id,
      username: 'Your Story',
      userAvatar: currentUser.avatar,
      mediaUrl,
      mediaType,
      caption,
      timestamp: 'Just now',
      seen: false,
      duration: 5,
    };
    setStories((prev) => [newStory, ...prev.filter((s) => s.userId !== currentUser.id)]);
  };

  const openStoryViewer = (index: number) => {
    setActiveStoryIndex(index);
  };

  const closeStoryViewer = () => {
    setActiveStoryIndex(null);
  };

  // Reel Actions
  const toggleLikeReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((reel) => {
        if (reel.id === reelId) {
          const newLiked = !reel.isLiked;
          return {
            ...reel,
            isLiked: newLiked,
            likesCount: newLiked ? reel.likesCount + 1 : reel.likesCount - 1,
          };
        }
        return reel;
      })
    );
  };

  const toggleSaveReel = (reelId: string) => {
    setReels((prev) =>
      prev.map((reel) => (reel.id === reelId ? { ...reel, isSaved: !reel.isSaved } : reel))
    );
  };

  const toggleFollowReelUser = (reelId: string) => {
    setReels((prev) =>
      prev.map((reel) =>
        reel.id === reelId ? { ...reel, isFollowing: !reel.isFollowing } : reel
      )
    );
  };

  const addReelComment = (reelId: string, text: string) => {
    if (!text.trim()) return;
    const newComment: Comment = {
      id: `rc_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      text: text.trim(),
      timestamp: 'Just now',
      likesCount: 0,
    };

    setReels((prev) =>
      prev.map((reel) => {
        if (reel.id === reelId) {
          return {
            ...reel,
            commentsCount: reel.commentsCount + 1,
            comments: [...(reel.comments || []), newComment],
          };
        }
        return reel;
      })
    );
  };

  const createReel = ({
    videoUrl,
    caption,
    audioTitle,
    thumbnailUrl,
  }: {
    videoUrl: string;
    caption: string;
    audioTitle: string;
    thumbnailUrl?: string;
  }) => {
    const newReel: Reel = {
      id: `reel_${Date.now()}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      videoUrl,
      thumbnailUrl: thumbnailUrl || videoUrl,
      caption,
      audioTitle: audioTitle || `${currentUser.name} · Original Audio`,
      likesCount: 1,
      commentsCount: 0,
      sharesCount: 0,
      isLiked: true,
      isSaved: false,
      isFollowing: false,
      comments: [],
    };
    setReels((prev) => [newReel, ...prev]);
    setActiveTab('reels');
  };

  // Direct Messaging Actions & Real-Time Auto-Response Simulation
  const sendMessage = (
    chatId: string,
    text: string,
    mediaUrl?: string,
    mediaType?: 'image' | 'video'
  ) => {
    if (!text.trim() && !mediaUrl) return;

    const newMessage = {
      id: `m_${Date.now()}`,
      senderId: currentUser.id,
      text: text.trim(),
      mediaUrl,
      mediaType,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true,
    };

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
          };
        }
        return chat;
      })
    );

    // Simulate real-time friend typing and reply
    const targetChat = chats.find((c) => c.id === chatId);
    if (targetChat && targetChat.participant.id !== currentUser.id) {
      // Set typing indicator
      setTimeout(() => {
        setChats((prev) =>
          prev.map((chat) => (chat.id === chatId ? { ...chat, isTyping: true } : chat))
        );
      }, 700);

      // Generate contextual friendly reply in Hinglish / English
      setTimeout(() => {
        const friend = targetChat.participant;
        const replies = [
          `Arey bilkul! Sahi bola aapne! 😍🔥`,
          `Haha so cool! Let me check this out right now 🙌`,
          `Sach me? That's awesome! Mujhe bhi sikhna hai ye! ✨`,
          `Pakka! Weekend pe plan banate hain! 🎬☕`,
          `Love the vibe! Did you check out the new Reel I just liked? 🔥`,
          `Great seeing this! Keep sharing the amazing photos! 📸`,
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];

        const friendReply = {
          id: `m_rep_${Date.now()}`,
          senderId: friend.id,
          text: randomReply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isRead: false,
        };

        setChats((prev) =>
          prev.map((chat) => {
            if (chat.id === chatId) {
              return {
                ...chat,
                isTyping: false,
                unreadCount: activeChatId === chatId ? 0 : chat.unreadCount + 1,
                messages: [...chat.messages, friendReply],
              };
            }
            return chat;
          })
        );
      }, 2400);
    }
  };

  const startChatWithUser = (user: User): string => {
    const existingChat = chats.find((c) => c.participant.id === user.id);
    if (existingChat) {
      setActiveChatId(existingChat.id);
      setActiveTab('messages');
      return existingChat.id;
    }

    const newChatId = `chat_${Date.now()}`;
    const newChat: Chat = {
      id: newChatId,
      participant: user,
      unreadCount: 0,
      messages: [],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChatId);
    setActiveTab('messages');
    return newChatId;
  };

  const reactToMessage = (chatId: string, messageId: string, emoji: string) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: chat.messages.map((m) =>
              m.id === messageId ? { ...m, reaction: m.reaction === emoji ? undefined : emoji } : m
            ),
          };
        }
        return chat;
      })
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const followUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nowFollowing = !u.isFollowing;
          return {
            ...u,
            isFollowing: nowFollowing,
            followersCount: nowFollowing ? u.followersCount + 1 : u.followersCount - 1,
          };
        }
        return u;
      })
    );
  };

  const unreadMessagesCount = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        currentUser,
        updateCurrentUser,
        posts,
        toggleLikePost,
        toggleSavePost,
        addComment,
        createPost,
        stories,
        markStorySeen,
        createStory,
        reels,
        toggleLikeReel,
        toggleSaveReel,
        toggleFollowReelUser,
        addReelComment,
        createReel,
        chats,
        activeChatId,
        setActiveChatId,
        sendMessage,
        startChatWithUser,
        reactToMessage,
        notifications,
        markAllNotificationsRead,
        unreadMessagesCount,
        unreadNotificationsCount,
        activeTab,
        setActiveTab,
        isCreateModalOpen,
        setIsCreateModalOpen,
        createModalInitialType,
        setCreateModalInitialType,
        activeStoryIndex,
        openStoryViewer,
        closeStoryViewer,
        isDownloadModalOpen,
        setIsDownloadModalOpen,
        users,
        followUser,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
