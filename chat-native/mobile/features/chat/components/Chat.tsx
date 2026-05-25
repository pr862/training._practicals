import React, { useEffect, useMemo, useRef, memo } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Image, StyleSheet, KeyboardAvoidingView, Platform, ViewStyle } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImagePlus, SendHorizonal, X } from "lucide-react-native";
import { auth } from "../../../../packages/data/config";
import { useChatMessages } from "../useChat";
import type { User } from "../../../../packages/data/user/model";
import UserAvatar from "../../../../packages/style/components/UserAvatar";
import Loading from "../../../../packages/style/components/Loading";
import { colors, textStyles } from "../../../../packages/style/theme";

interface ChatProps {
  chatId: string;
  user?: User;
  title?: string;
  isGroup?: boolean;
  usersById?: Record<string, User>;
  readOnlyMessage?: string;
  onLoadingChange?: (loading: boolean) => void;
}

const Chat = ({ chatId, user, title, isGroup = false, usersById = {}, readOnlyMessage = "", onLoadingChange }: ChatProps) => {
  const flatListRef = useRef<FlatList>(null);
  const { messages, loading, text, setText, sendMessage, handleImageUpload, isUploading, isSending, imagePreview, clearImageSelection, error, formatDateLabel, getMessageDate, getSenderName, getSenderUser, getSystemText } = useChatMessages(chatId, usersById);
  const currentUserId = auth.currentUser?.uid;
  const trimmedText = text.trim();
  const canSend = Boolean((trimmedText || imagePreview) && !isUploading && !isSending && !loading);

  const getRenderableText = (value: unknown) => (
    typeof value === "string" ? value.replace(/[\u200B-\u200D\uFEFF]/g, "").trim() : ""
  );

  const hasRenderableImage = (value: unknown) => (
    typeof value === "string" && /^(https?:|file:|content:|data:image\/)/.test(value.trim())
  );

  const hasRenderableMessage = (message: any) => (
    message.type === "system" ? Boolean(getRenderableText(message.text)) : Boolean(getRenderableText(message.text) || hasRenderableImage(message.imageUrl))
  );

  const visibleMessages = useMemo(
    () => messages.filter(hasRenderableMessage), [messages]
  );

  useEffect(() => {
    onLoadingChange?.(loading);
  }, [loading, onLoadingChange]);

  const submitCurrentMessage = async () => {
    if (readOnlyMessage) return;
    if (!canSend) return;
    await sendMessage(text);
    flatListRef.current?.scrollToEnd({ animated: true });
  };

  const triggerNativeImagePicker = async () => {
    if (isUploading || isSending) return;
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
    handleImageUpload({
      uri: asset.uri,
      name: asset.fileName || asset.uri.split("/").pop() || "chat-image.jpg",
      type: asset.mimeType || "image/jpeg",
    });
  };

  const conversationTitle = title || user?.name || user?.email || "this chat";

  const renderMessageItem = ({ item: msg, index: i }: { item: any; index: number }) => {
    const currentMsgDate = getMessageDate(msg.createdAt);
    const prevMsgDate = i > 0 ? getMessageDate(visibleMessages[i - 1].createdAt) : null;
    const isNewDay = !prevMsgDate || currentMsgDate.toDateString() !== prevMsgDate.toDateString();
    const isMe = msg.senderId === currentUserId;
    const isSystem = msg.type === "system";
    const time = currentMsgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const sender = getSenderUser(msg.senderId);
    const messageText = getRenderableText(msg.text);
    const imageUrl = hasRenderableImage(msg.imageUrl) ? msg.imageUrl.trim() : "";

    if (!hasRenderableMessage(msg)) return null;

    return (
      <View style={styles.messageGroupContainer}>
        {isNewDay && (
          <View style={styles.dateSeparatorRow}>
            <View style={styles.lineDivider} />
            <View style={styles.dateBadge}>
              <Text style={styles.dateBadgeText}>{formatDateLabel(currentMsgDate)}</Text>
            </View>
            <View style={styles.lineDivider} />
          </View>
        )}

        {isSystem ? (
          <View style={styles.systemMessageRow}>
            <View style={styles.systemMessageBadge}>
              <Text style={styles.systemMessageText}>{getSystemText({ ...msg, text: messageText })}</Text>
            </View>
          </View>
        ) : (
          <View style={[styles.bubbleRow, isMe ? styles.justifyRight : styles.justifyLeft]}>
            <View style={[styles.bubbleWrapper, isMe ? styles.flexRowReverse : styles.flexRow]}>
              {isGroup && !isMe && (
                <View style={styles.groupAvatarPadding}>
                  <UserAvatar user={sender} size="sm" />
                </View>
              )}
              <View style={[styles.msgMetaContainer, isMe ? styles.alignEnd : styles.alignStart]}>
                <View style={[styles.bubbleBox, isMe ? styles.bubbleMe : styles.bubbleThem, imageUrl ? styles.BubbleImagePadding : styles.BubbleTextPadding]}>
                {isGroup && !isMe && (
                  <Text style={styles.senderNameLabel}>{getSenderName(msg.senderId)}</Text>
                )}
                {imageUrl && (
                  <Image source={{ uri: imageUrl }} style={styles.bubbleImage} resizeMode="cover" />)}
                 <View style={[styles.textTimeContainer, imageUrl ? { marginTop: 4 } : null]}>
                  {messageText && (
                    <Text style={[styles.bubbleText, isMe ? styles.textWhite : styles.textDark]}>
                      {messageText}
                    </Text>
                  )}
                  <Text style={[styles.timeLabel, isMe ? styles.timeMe : styles.timeThem, imageUrl && !messageText ? styles.timeOverlay : null]}>
                    {time}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboardContainer}>
      <View style={styles.mainWrapper}>
        {!loading && !visibleMessages.length ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCard}>
              <View style={styles.emptyIconCircle}>
                <SendHorizonal size={24} color={colors.accent} />
              </View>
            </View>
            <Text style={styles.emptyHeader}>Secure Conversation</Text>
            <Text style={styles.emptyBody}>
              Messages with <Text style={styles.boldText}>{conversationTitle}</Text> are encrypted.
            </Text>
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={visibleMessages}
            keyExtractor={(item, index) => item.id || index.toString()}
            renderItem={renderMessageItem}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            keyboardShouldPersistTaps="handled"
          />
        )}
        <View style={styles.chatInputContainer}>
          {imagePreview && (
            <View style={styles.previewContainer}>
              <View style={styles.previewCard}>
                <Image source={{ uri: imagePreview }} style={styles.previewImage} />
                <TouchableOpacity onPress={clearImageSelection} style={styles.closePreviewBtn}>
                  <X size={14} color="white" />
                </TouchableOpacity>
                {isUploading && (
                  <Loading size="small" style={styles.previewLoaderOverlay as ViewStyle} iconColor={colors.accent} />
                )}
              </View>
            </View>
          )}
          {readOnlyMessage ? (
            <View style={styles.readOnlyContainer}>
              <Text style={styles.readOnlyText}>{readOnlyMessage}</Text>
            </View>
          ) : (
            <View style={styles.inputBarRow}>
              <TouchableOpacity onPress={triggerNativeImagePicker} disabled={isUploading || isSending} style={styles.imageAttachBtn}>
                <ImagePlus size={24} color={colors.textSoft} />
              </TouchableOpacity>
              <TextInput
                style={styles.textInput}
                placeholder="Type a message..."
                placeholderTextColor={colors.textSoft}
                value={text}
                onChangeText={setText}
                multiline
                selectionColor={colors.accent}
                returnKeyType="default"
              />

              <TouchableOpacity onPress={submitCurrentMessage} disabled={!canSend} style={[styles.sendButton, canSend ? styles.sendActive : styles.sendDisabled]}>
                {isSending ? (
                  <Loading size="small" iconColor="white" style={styles.sendButtonLoading} />
                ) : (
                  <SendHorizonal size={20} color="white" />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardContainer: {
    flex: 1
  },
  mainWrapper: {
    flex: 1,
    backgroundColor: colors.background
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 16
  },
  messageGroupContainer: {
    marginBottom: 16
  },
  dateSeparatorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16
  },
  lineDivider: {
    height: 0.5,
    flex: 1,
    backgroundColor: colors.border
  },
  dateBadge: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20
  },
  dateBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1.5
  },
  systemMessageRow: {
    alignItems: "center",
    marginVertical: 6
  },
  systemMessageBadge: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    maxWidth: "85%"
  },
  systemMessageText: {
    ...textStyles.subtitle,
    color: colors.textMuted,
    textAlign: "center"
  },
  bubbleRow: {
    flexDirection: "row",
    marginVertical: 3,
    width: "100%"
  },
  justifyLeft: {
    justifyContent: "flex-start"
  },
  justifyRight: {
    justifyContent: "flex-end"
  },
  flexRow: {
    flexDirection: "row"
  },
  flexRowReverse: {
    flexDirection: "row-reverse"
  },
  alignStart: {
    alignItems: "flex-start"
  },
  alignEnd: {
    alignItems: "flex-end"
  },
  bubbleWrapper: {
    maxWidth: "80%",
    flexDirection: "row"
  },
  groupAvatarPadding: {
    marginBottom: 4,
    marginRight: 8
  },
  msgMetaContainer: {
    alignItems: "flex-end"
  },
  senderNameLabel: {
    ...textStyles.formLabel,
    color: colors.accent,
    marginBottom: 4,
  },
  bubbleBox: {
    borderRadius: 12,
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  BubbleImagePadding: {
    padding: 4, 
  },
  BubbleTextPadding: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  bubbleMe: {
    borderTopRightRadius: 2,
    alignSelf: 'flex-end',
    backgroundColor: colors.accent
  },
  bubbleThem: {
    borderTopLeftRadius:2,
    backgroundColor: colors.surface,
    borderWidth: 0.5,
    borderColor: colors.border,
    alignSelf: 'flex-start',
  },
  bubbleImage: {
    width: 240,
    height: 320,
    borderRadius: 8,
    backgroundColor: colors.surfaceRaised
  },
  bubbleText: {
    ...textStyles.input,
    lineHeight: 20,
    marginRight: 6, 
    flexShrink: 1,
  },
  textAccent: {
    color: colors.accentText,
    fontWeight: "400"
  },
  textDark: {
    color: colors.text
  },
  timeLabel: {
    fontSize: 10,
    marginLeft: 8,
    marginBottom: 2,
  },
  textTimeContainer: {
   flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  textWhite: { 
    color: colors.accentText
  },
  timeThem: {
    color: colors.textMuted 
  },
  timeMe: { 
    color: colors.text 
  },
  timeOverlay: {
     position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    color: colors.text,
    paddingHorizontal: 4,
    borderRadius: 4,
    overflow: 'hidden',
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80
  },
  emptyIconCard: {
    marginBottom: 16,
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border
  },
  emptyIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.accentMuted,
    alignItems: "center",
    justifyContent: "center"
  },
  emptyHeader: {
    ...textStyles.footerLink,
    color: colors.text,
    marginBottom: 4
  },
  emptyBody: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    maxWidth: 240,
    lineHeight: 18
  },
  boldText: {
    color: colors.accent,
    fontWeight: "600"
  },
  chatInputContainer: {
    borderTopWidth: 0.5,
    borderColor: colors.border,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 24 : 12
  },
  readOnlyContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center"
  },
  readOnlyText: {
    ...textStyles.formLabel,
    color: colors.textMuted,
    textAlign: "center"
  },
  inputBarRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8
  },
  inputFieldContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 24,
    paddingHorizontal: 6,
    paddingVertical: 4
  },
  imageAttachBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center"
  },
  textInput: {
    flex: 1,
    minHeight: 36,
    ...textStyles.footer,
    color: colors.text,
    paddingHorizontal: 8,
    paddingVertical: 6,
    maxHeight: 120
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center"
  },
  sendButtonLoading: {
    height: "100%",
    width: "100%"
  },
  sendActive: {
    backgroundColor: colors.accent
  },
  sendDisabled: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border
  },
  previewContainer: {
    marginBottom: 12,
    flexDirection: "row"
  },
  previewCard: {
    position: "relative",
    width: 88,
    height: 88,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden"
  },
  previewImage: {
    width: "100%",
    height: "100%"
  },
  closePreviewBtn: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(35, 31, 33, 0.8)",
    alignItems: "center",
    justifyContent: "center"
  },
  previewLoaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(35, 31, 33, 0.8)",
    alignItems: "center",
    justifyContent: "center"
  },
  errorText: {
    marginTop: 8,
    paddingHorizontal: 4,
    ...textStyles.error,
    color: colors.danger
  }
});
export default memo(Chat);
