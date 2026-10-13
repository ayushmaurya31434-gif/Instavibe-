export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  website?: string;
  verified?: boolean;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
  isOnline?: boolean;
}

export interface Story {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  timestamp: string;
  seen: boolean;
  duration?: number; // seconds
}

export interface Comment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  location?: string;
  mediaType: 'image' | 'video';
  mediaUrl: string;
  caption: string;
  timestamp: string;
  likesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  commentsCount: number;
  comments: Comment[];
  filter?: string;
}

export interface Reel {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  videoUrl: string;
  thumbnailUrl?: string;
  caption: string;
  audioTitle: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isLiked: boolean;
  isSaved: boolean;
  isFollowing: boolean;
  comments?: Comment[];
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio';
  timestamp: string;
  isRead: boolean;
  reaction?: string;
}

export interface Chat {
  id: string;
  participant: User;
  unreadCount: number;
  messages: Message[];
  isTyping?: boolean;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention';
  user: User;
  content: string;
  postThumbnail?: string;
  timestamp: string;
  read: boolean;
}
