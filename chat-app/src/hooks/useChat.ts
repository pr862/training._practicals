import { useState, useEffect, useRef } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { 
  collection, 
  addDoc, 
  FieldPath,
  increment,
  serverTimestamp, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  getDoc,
  updateDoc 
} from "firebase/firestore";
import { db, auth } from "../firebase/config";
import { uploadImageToCloudinary } from "../services/upload";
import type { Message } from "../types";

export const useChatMessages = (chatId: string) => {
  const currentUserId = auth.currentUser?.uid;
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(Boolean(chatId && currentUserId));
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId || !currentUserId) {
      return;
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
        setMessages(msgs);
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
    if (!file) return;
    setError("");
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const clearImageSelection = () => {
    setSelectedFile(null);
    setImagePreview(null);
  };

  const sendMessage = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!text.trim() && !selectedFile) return;
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
        createdAt: serverTimestamp(),
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
        serverTimestamp(),
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
    error
  };
};
