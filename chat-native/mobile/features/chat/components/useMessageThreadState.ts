import { useEffect, useMemo, useRef } from "react";
import { FlatList } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth } from "../../../../packages/data/config";
import type { Message } from "../../../../packages/data/chat/model";
import type { User } from "../../../../packages/data/user/model";
import { useChatMessages } from "../useChat";

interface UseMessageThreadStateProps {
  chatId: string;
  usersById: Record<string, User>;
  readOnlyMessage: string;
  onLoadingChange?: (loading: boolean) => void;
}

const getRenderableText = (value: unknown) => (
  typeof value === "string" ? value.replace(/[\u200B-\u200D\uFEFF]/g, "").trim() : ""
);

const hasRenderableImage = (value: unknown) => (
  typeof value === "string" && /^(https?:|file:|content:|data:image\/)/.test(value.trim())
);

export function useMessageThreadState({
  chatId,
  usersById,
  readOnlyMessage,
  onLoadingChange,
}: UseMessageThreadStateProps) {
  const flatListRef = useRef<FlatList>(null);
  const chat = useChatMessages(chatId, usersById);
  const currentUserId = auth.currentUser?.uid;
  const trimmedText = chat.text.trim();
  const canSend = Boolean(
    (trimmedText || chat.imagePreview) && !chat.isUploading && !chat.isSending && !chat.loading
  );

  const hasRenderableMessage = (message: Message) => (
    message.type === "system"
      ? Boolean(getRenderableText(message.text))
      : Boolean(getRenderableText(message.text) || hasRenderableImage(message.imageUrl))
  );

  const visibleMessages = useMemo(
    () => chat.messages.filter(hasRenderableMessage),
    [chat.messages]
  );

  useEffect(() => {
    onLoadingChange?.(chat.loading);
  }, [chat.loading, onLoadingChange]);

  const submitCurrentMessage = async () => {
    if (readOnlyMessage) return;
    if (!canSend) return;
    await chat.sendMessage(chat.text);
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const triggerNativeImagePicker = async () => {
    if (chat.isUploading || chat.isSending) return;
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: false,
      quality: 0.8,
    });
    if (result.canceled || !result.assets.length) return;
    const asset = result.assets[0];
    chat.handleImageUpload({
      uri: asset.uri,
      name: asset.fileName || asset.uri.split("/").pop() || "chat-image.jpg",
      type: asset.mimeType || "image/jpeg",
    });
  };

  return {
    ...chat,
    flatListRef,
    currentUserId,
    canSend,
    visibleMessages,
    getRenderableText,
    hasRenderableImage,
    hasRenderableMessage,
    submitCurrentMessage,
    triggerNativeImagePicker,
  };
}
