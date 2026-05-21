import { db } from "../firebase/config";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteField,
  doc,
  getDoc,
  Timestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type { Chat } from "../types/chat";
import {
  assertRequiredString,
  assertRequiredStringArray,
} from "./validation";

const addSystemMessage = async (chatId: string, text: string, actorId?: string, actorName?: string) => {
  const validatedChatId = assertRequiredString(chatId, "Chat ID");
  const validatedText = assertRequiredString(text, "Message text");
  const normalizedActorId = actorId?.trim();
  const normalizedActorName = actorName?.trim();

  await addDoc(collection(db, "chats", validatedChatId, "messages"), {
    chatId: validatedChatId,
    senderId: "system",
    ...(normalizedActorId ? { actorId: normalizedActorId } : {}),
    ...(normalizedActorName ? { actorName: normalizedActorName } : {}),
    text: validatedText,
    imageUrl: null,
    type: "system",
    createdAt: Timestamp.now(),
  });
};

const addTargetedSystemMessage = async (
  chatId: string,
  text: string,
  visibleTo?: string[],
  actorId?: string,
  actorName?: string
) => {
  const validatedChatId = assertRequiredString(chatId, "Chat ID");
  const validatedText = assertRequiredString(text, "Message text");
  const normalizedVisibleTo = visibleTo?.length
    ? assertRequiredStringArray(visibleTo, "Visible recipients")
    : [];
  const normalizedActorId = actorId?.trim();
  const normalizedActorName = actorName?.trim();

  await addDoc(collection(db, "chats", validatedChatId, "messages"), {
    chatId: validatedChatId,
    senderId: "system",
    ...(normalizedActorId ? { actorId: normalizedActorId } : {}),
    ...(normalizedActorName ? { actorName: normalizedActorName } : {}),
    text: validatedText,
    imageUrl: null,
    type: "system",
    ...(normalizedVisibleTo.length ? { visibleTo: normalizedVisibleTo } : {}),
    createdAt: Timestamp.now(),
  });
};

export const getPrivateChatId = (
  currentUserId: string,
  selectedUserId: string
) => {
  const validatedCurrentUserId = assertRequiredString(
    currentUserId,
    "Current user ID"
  );
  const validatedSelectedUserId = assertRequiredString(
    selectedUserId,
    "Selected user ID"
  );
  const [firstUserId, secondUserId] = [validatedCurrentUserId, validatedSelectedUserId,].sort();

  return `private_${firstUserId}_${secondUserId}`;
};

export const getOrCreateChat = async (
  currentUserId: string,
  selectedUserId: string
) => {
  const validatedCurrentUserId = assertRequiredString(currentUserId, "Current user ID");
  const validatedSelectedUserId = assertRequiredString(selectedUserId, "Selected user ID");
  const chatId = getPrivateChatId(validatedCurrentUserId, validatedSelectedUserId);

  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);

  if (chatSnap.exists()) {
    await updateDoc(chatRef, {
      [`unreadCount.${validatedCurrentUserId}`]: 0,
    });

    return {
      id: chatId,
      ...chatSnap.data(),
    };
  }

  const initialChatData = {
    chatId,
    type: "private",
    members: [validatedCurrentUserId, validatedSelectedUserId],
    lastMessage: "",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    unreadCount: {
      [validatedCurrentUserId]: 0,
      [validatedSelectedUserId]: 0,
    },
  };

  await setDoc(chatRef, initialChatData);
  return { id: chatId, ...initialChatData };
};

export const createGroupChat = async (
  currentUserId: string,
  selectedMemberIds: string[],
  groupName: string,
  currentUserName = "Someone",
  memberNamesById: Record<string, string> = {}
) => {
  const validatedCurrentUserId = assertRequiredString(currentUserId, "Current user ID");
  const validatedMemberIds = assertRequiredStringArray(selectedMemberIds, "Selected members");
  const trimmedGroupName = assertRequiredString(groupName, "Group name");
  const normalizedCurrentUserName = currentUserName.trim() || "Someone";
  const members = Array.from(
    new Set([validatedCurrentUserId, ...validatedMemberIds])
  );

  if (members.length < 3) {
    throw new Error("Select at least two other members.");
  }

  const chatRef = doc(collection(db, "chats"));

  const initialChatData: Chat = {
    chatId: chatRef.id,
    type: "group",
    members,
    groupName: trimmedGroupName,
    adminId: validatedCurrentUserId,
    lastMessage: "",
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    unreadCount: Object.fromEntries(
      members.map((memberId) => [memberId, 0])
    ),
  };

  await setDoc(chatRef, initialChatData);

  await addSystemMessage(
    chatRef.id,
    `${normalizedCurrentUserName} created the group.`,
    validatedCurrentUserId,
    normalizedCurrentUserName
  );

  const joinedNames = validatedMemberIds
    .map((memberId) => memberNamesById[memberId])
    .filter(Boolean);

  if (joinedNames.length) {
    await addSystemMessage(
      chatRef.id,
      `${joinedNames.join(", ")} joined the group.`
    );
  }

  return {
    id: chatRef.id,
    ...initialChatData,
  };
};

export const addGroupMembers = async (
  chatId: string,
  currentUserId: string,
  selectedMemberIds: string[],
  currentUserName = "Someone",
  memberNamesById: Record<string, string> = {}
) => {
  const validatedChatId = assertRequiredString(chatId, "Chat ID");
  const validatedCurrentUserId = assertRequiredString(
    currentUserId,
    "Current user ID"
  );
  const validatedMemberIds = assertRequiredStringArray(
    selectedMemberIds,
    "Selected members"
  );
  const normalizedCurrentUserName = currentUserName.trim() || "Someone";
  const chatRef = doc(db, "chats", validatedChatId);

  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    throw new Error("Group not found.");
  }

  const chat = chatSnap.data() as Chat;

  if (chat.type !== "group" || !chat.members.includes(validatedCurrentUserId)) {
    throw new Error("You cannot add members to this group.");
  }

  if (chat.deletedAt) {
    throw new Error("This group was deleted.");
  }

  const newMemberIds = Array.from(
    new Set(validatedMemberIds)
  ).filter((memberId) => !chat.members.includes(memberId));

  if (!newMemberIds.length) {
    throw new Error("Choose at least one new member.");
  }

  const joinedNames = newMemberIds
    .map((memberId) => memberNamesById[memberId])
    .filter(Boolean);

  const systemText = joinedNames.length
    ? `${normalizedCurrentUserName} added ${joinedNames.join(", ")}.`
    : `${normalizedCurrentUserName} added new members.`;

  const unreadUpdates = Object.fromEntries(
    newMemberIds.map((memberId) => [
      `unreadCount.${memberId}`,
      0,
    ])
  );

  await updateDoc(chatRef, {
    members: arrayUnion(...newMemberIds),
    lastMessage: systemText,
    updatedAt: Timestamp.now(),
    ...unreadUpdates,
  });

  await addSystemMessage(validatedChatId, systemText, validatedCurrentUserId, normalizedCurrentUserName);
};

export const leaveGroupChat = async (
  chatId: string,
  currentUserId: string,
  currentUserName = "Someone"
) => {
  const validatedChatId = assertRequiredString(chatId, "Chat ID");
  const validatedCurrentUserId = assertRequiredString(
    currentUserId,
    "Current user ID"
  );
  const normalizedCurrentUserName = currentUserName.trim() || "Someone";
  const chatRef = doc(db, "chats", validatedChatId);

  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    throw new Error("Group not found.");
  }

  const chat = chatSnap.data() as Chat;

  if (
    chat.type !== "group" ||
    !chat.members.includes(validatedCurrentUserId)
  ) {
    throw new Error("You cannot leave this chat.");
  }

  if (chat.deletedAt) {
    throw new Error("This group was deleted.");
  }

  const remainingMembers = chat.members.filter(
    (memberId) => memberId !== validatedCurrentUserId
  );

  if (!remainingMembers.length) {
    await updateDoc(chatRef, {
      adminExitedAt: Timestamp.now(),
      lastMessage: `${normalizedCurrentUserName} exited the group.`,
      updatedAt: Timestamp.now(),
    });

    await addSystemMessage(
      validatedChatId,
      `${normalizedCurrentUserName} exited the group.`,
      validatedCurrentUserId,
      normalizedCurrentUserName
    );

    return;
  }

  const nextAdminId =
    chat.adminId === validatedCurrentUserId
      ? remainingMembers[0]
      : chat.adminId;

  const systemText = `${normalizedCurrentUserName} left the group.`;

  await updateDoc(chatRef, {
    members: arrayRemove(validatedCurrentUserId),
    adminId: nextAdminId,
    lastMessage: systemText,
    updatedAt: Timestamp.now(),
    [`unreadCount.${validatedCurrentUserId}`]: deleteField(),
  });

  await addTargetedSystemMessage(
    validatedChatId,
    systemText,
    remainingMembers,
    validatedCurrentUserId,
    normalizedCurrentUserName
  );
};

export const removeGroupMember = async (
  chatId: string,
  currentUserId: string,
  memberId: string,
  currentUserName = "Someone",
  memberName = "A member"
) => {
  const validatedChatId = assertRequiredString(chatId, "Chat ID");
  const validatedCurrentUserId = assertRequiredString(
    currentUserId,
    "Current user ID"
  );
  const validatedMemberId = assertRequiredString(memberId, "Member ID");
  const normalizedCurrentUserName = currentUserName.trim() || "Someone";
  const normalizedMemberName = memberName.trim() || "A member";

  if (validatedMemberId === validatedCurrentUserId) {
    throw new Error("Use Leave Group to remove yourself.");
  }

  const chatRef = doc(db, "chats", validatedChatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    throw new Error("Group not found.");
  }

  const chat = chatSnap.data() as Chat;

  if (chat.type !== "group" || chat.adminId !== validatedCurrentUserId) {
    throw new Error("Only the group admin can remove members.");
  }

  if (chat.deletedAt) {
    throw new Error("This group was deleted.");
  }

  if (!chat.members.includes(validatedMemberId)) {
    throw new Error("This member is no longer in the group.");
  }

  const systemText = `${normalizedCurrentUserName} removed ${normalizedMemberName}.`;

  await updateDoc(chatRef, {
    members: arrayRemove(validatedMemberId),
    lastMessage: systemText,
    updatedAt: Timestamp.now(),
    [`unreadCount.${validatedMemberId}`]: deleteField(),
  });

  await addTargetedSystemMessage(
    validatedChatId,
    systemText,
    chat.members,
    validatedCurrentUserId,
    normalizedCurrentUserName
  );
};

export const deleteGroupChat = async (
  chatId: string,
  currentUserId: string,
  currentUserName = "Someone"
) => {
  const validatedChatId = assertRequiredString(chatId, "Chat ID");
  const validatedCurrentUserId = assertRequiredString(
    currentUserId,
    "Current user ID"
  );
  const normalizedCurrentUserName = currentUserName.trim() || "Someone";
  const chatRef = doc(db, "chats", validatedChatId);

  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    throw new Error("Group not found.");
  }

  const chat = chatSnap.data() as Chat;

  if (
    chat.type !== "group" ||
    chat.adminId !== validatedCurrentUserId
  ) {
    throw new Error(
      "Only the group admin can delete this chat."
    );
  }

  if (chat.deletedAt) {
    return;
  }

  if (chat.members.length > 1 || !chat.adminExitedAt) {
    throw new Error(
      "Remove all other participants, then exit the group before deleting it."
    );
  }

  const systemText = `${normalizedCurrentUserName} deleted the group.`;

  await updateDoc(chatRef, {
    deletedAt: Timestamp.now(),
    deletedBy: validatedCurrentUserId,
    lastMessage: systemText,
    updatedAt: Timestamp.now(),
  });

  await addSystemMessage(validatedChatId, systemText, validatedCurrentUserId, normalizedCurrentUserName);
};

export const updateLastMessage = async (
  chatId: string,
  messageText: string
) => {
  const validatedChatId = assertRequiredString(chatId, "Chat ID");
  const validatedMessageText = assertRequiredString(
    messageText,
    "Message text"
  );
  const chatRef = doc(db, "chats", validatedChatId);
  await updateDoc(chatRef, {
    lastMessage: validatedMessageText,
    updatedAt: Timestamp.now(),
  });
};
