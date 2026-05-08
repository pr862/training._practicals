export interface Chat {
  chatId: string;
  type: "private" | "group";
  members: string[];
  groupName?: string;
  adminId?: string;
  lastMessage?: string;
  createdAt?: unknown;
  updatedAt: unknown;
  unreadCount?: Record<string, number>;
  adminExitedAt?: unknown;
  deletedAt?: unknown;
  deletedBy?: string;
}

export interface Message {
  id: string;
  messageId?: string;
  senderId: string;
  actorId?: string;
  actorName?: string;
  text: string;
  imageUrl?: string | null;
  type?: "text" | "image" | "system";
  visibleTo?: string[];
  createdAt: unknown;
}
