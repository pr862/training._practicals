export interface User {
  uId: string;
  email: string;
  Name: string;
  image: string;
  createdAt: any; 
}

export interface Chat {
  chatId: string;
  type: "private" | "group";
  members: string[];
  groupName?: string;
  adminId?: string;
  lastMessage?: string;
  updatedAt: any;
}

export interface Message {
  messageId: string;
  senderId: string;
  text: string;
  imageUrl?: string;
  type: "text" | "image";
  createdAt: any;
}
