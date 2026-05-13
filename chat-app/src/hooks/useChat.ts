import { useState, useEffect, useRef } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { 
  collection, 
  addDoc, 
  FieldPath,
  increment,
  Timestamp, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  getDoc,
  updateDoc 
} from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { uploadImageToCloudinary } from "../services/upload";
import { validateProfileImage } from "../utils/validation";
import type { Message } from "../types/chat";
import type { User } from "../types/user";

export const useChatMessages = (chatId: string, usersById: Record<string, User> = {}) => {
  const currentUserId = auth.currentUser?.uid;
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(Boolean(chatId && currentUserId));
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!chatId || !currentUserId) {
      return;
    }

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    let unsubscribe: (() => void) | undefined;
    let cancelled = false;

    const subscribeToChat = async () => {
      const chatSnap = await getDoc(doc(db, "chats", chatId));
      const members = chatSnap.data()?.members;
      const canReadChat =
        chatSnap.exists() &&
        Array.isArray(members) &&
        members.includes(currentUserId);

      if (cancelled) return;

      if (!canReadChat) {
        setMessages([]);
        setError("You do not have access to this chat.");
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "chats", chatId, "messages"),
        orderBy("createdAt", "asc")
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Message[];
        const visibleMessages = msgs.filter((message) => {
          if (!Array.isArray(message.visibleTo)) return true;
          return message.visibleTo.includes(currentUserId);
        });
        setMessages(visibleMessages);
        setLoading(false);
        void updateDoc(
          doc(db, "chats", chatId),
          new FieldPath("unreadCount", currentUserId),
          0
        );
      }, () => {
        setError("Failed to load messages");
        setLoading(false);
      });
    };

    subscribeToChat().catch(() => {
      if (cancelled) return;
      setError("Failed to load messages");
      setLoading(false);
    });

    return () => {
      cancelled = true;
      unsubscribe?.();
      setMessages([]);
    };
  }, [chatId, currentUserId]);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    const imageError = validateProfileImage(file ?? null);
    if (imageError) {
      setError(imageError);
      return;
    }
    if (!file) return;
    setError("");
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const clearImageSelection = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const formatDateLabel = (date: Date) => {
    const today = new Date().toDateString();
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toDateString();
    const target = date.toDateString();
    if (target === today) return "Today";
    if (target === yesterday) return "Yesterday";
    return date.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined
    });
  };

  const getMessageDate = (createdAt: Timestamp | Date | null | undefined) => {
    if (createdAt instanceof Date) return createdAt;
    if (
      createdAt &&
      typeof createdAt === "object" &&
      "toDate" in createdAt &&
      typeof createdAt.toDate === "function"
    ) {
      return createdAt.toDate() as Date;
    }
    return new Date();
  };

  const getSenderName = (senderId: string) => {
    const sender = usersById[senderId];
    return sender?.name || sender?.email || "Group member";
  };

  const getSenderUser = (senderId: string): User => {
    return usersById[senderId] ?? {
      uid: senderId,
      name: getSenderName(senderId),
      email: "",
    };
  };

  const getSystemText = (msg: Message) => {
    if (!msg.actorId || msg.actorId !== currentUserId) {
      return msg.text;
    }

    const actorName = msg.actorName || getSenderName(msg.actorId);
    return msg.text.startsWith(`${actorName} `)
      ? `You ${msg.text.slice(actorName.length + 1)}`
      : msg.text;
  };

  const sendMessage = async (e?: FormEvent) => {
    e?.preventDefault();
    if ((!text.trim() && !selectedFile) || isUploading) return;

    if (!currentUserId || !chatId) {
      setError("Session expired or invalid chat.");
      return;
    }

    const currentText = text.trim();
    const fileToUpload = selectedFile;
    const senderId = currentUserId;

    setText("");
    clearImageSelection();
    setError("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      let imageUrl = null;
      if (fileToUpload) {
        setIsUploading(true);
        imageUrl = await uploadImageToCloudinary(fileToUpload);
      }

      const chatSnap = await getDoc(doc(db, "chats", chatId));
      const chat = chatSnap.data();
      const members = chat?.members;
      if (!chatSnap.exists() || !Array.isArray(members) || !members.includes(senderId)) {
        throw new Error("You do not have access to this chat.");
      }

      if (chat?.deletedAt) {
        throw new Error("This group was deleted.");
      }

      if (chat?.adminExitedAt && chat?.adminId === senderId) {
        throw new Error("You can't send messages to this group because you're no longer a member");
      }

      const recipientIds = members.filter(
        (memberId): memberId is string =>
          typeof memberId === "string" && memberId !== senderId
      );

      const messageData = {
        chatId,
        text: currentText,
        imageUrl: imageUrl || null,
        senderId,
        type: imageUrl ? "image" : "text",
        createdAt: Timestamp.now(),
      };

      await addDoc(collection(db, "chats", chatId, "messages"), messageData);

      const unreadUpdates = recipientIds.flatMap((recipientId) => [
        new FieldPath("unreadCount", recipientId),
        increment(1),
      ]);

      await updateDoc(
        doc(db, "chats", chatId),
        "lastMessage",
        imageUrl ? "Image" : currentText,
        "updatedAt",
        Timestamp.now(),
        ...unreadUpdates
      );

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to send");
    } finally {
      setIsUploading(false);
    }
  };

  return {
    messages,
    loading,
    text,
    setText,
    sendMessage,
    handleImageUpload,
    isUploading,
    bottomRef,
    imagePreview,
    clearImageSelection,
    error,
    textareaRef,
    formatDateLabel,
    getMessageDate,
    getSenderName,
    getSenderUser,
    getSystemText
  };
};
