export interface User {
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
  createdAt?: unknown;
}

export interface Chat {
  chatId: string;
  type: "private" | "group";
  members: string[];
  groupName?: string;
  adminId?: string;
  lastMessage?: string;
  updatedAt: unknown;
}

export interface Message {
  id: string;
  messageId?: string;
  senderId: string;
  text: string;
  imageUrl?: string | null;
  type?: "text" | "image";
  createdAt: unknown;
}
