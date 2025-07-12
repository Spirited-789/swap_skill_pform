export interface User {
  id: string;
  name: string;
  email: string;
  location: string;
  profileImage?: string;
  skillsOffered: string[];
  skillsWanted: string[];
  availability: 'Available' | 'Busy' | 'Unavailable';
  isPublic: boolean;
  role: 'user' | 'admin';
  joinedAt: string;
  rating: number;
  totalSwaps: number;
  isBanned?: boolean;
}

export interface SwapRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser: User;
  toUser: User;
  skillOffered: string;
  skillWanted: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  message?: string;
}

export interface Feedback {
  id: string;
  fromUserId: string;
  toUserId: string;
  swapId: string;
  fromUser: User;
  toUser: User;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}