import { db } from "../firebase/config";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteField,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type { Chat } from "../types";

const addSystemMessage = async (chatId: string, text: string) => {
  await addDoc(collection(db, "chats", chatId, "messages"), {
    chatId,
    senderId: "system",
    text,
    imageUrl: null,
    type: "system",
    createdAt: serverTimestamp(),
  });
};

export const getPrivateChatId = (
  currentUserId: string,
  selectedUserId: string
) => {
  const [firstUserId, secondUserId] = [
    currentUserId,
    selectedUserId,
  ].sort();

  return `private_${firstUserId}_${secondUserId}`;
};

export const getOrCreateChat = async (
  currentUserId: string,
  selectedUserId: string
) => {
  const chatId = getPrivateChatId(currentUserId, selectedUserId);

  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);

  if (chatSnap.exists()) {
    await updateDoc(chatRef, {
      [`unreadCount.${currentUserId}`]: 0,
    });

    return {
      id: chatId,
      ...chatSnap.data(),
    };
  }

  const initialChatData = {
    chatId,
    type: "private",
    members: [currentUserId, selectedUserId],
    lastMessage: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    unreadCount: {
      [currentUserId]: 0,
      [selectedUserId]: 0,
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
  const members = Array.from(
    new Set([currentUserId, ...selectedMemberIds])
  );

  if (members.length < 3) {
    throw new Error("Select at least two other members.");
  }

  const trimmedGroupName = groupName.trim();

  if (!trimmedGroupName) {
    throw new Error("Group name is required.");
  }

  const chatRef = doc(collection(db, "chats"));

  const initialChatData: Chat = {
    chatId: chatRef.id,
    type: "group",
    members,
    groupName: trimmedGroupName,
    adminId: currentUserId,
    lastMessage: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    unreadCount: Object.fromEntries(
      members.map((memberId) => [memberId, 0])
    ),
  };

  await setDoc(chatRef, initialChatData);

  await addSystemMessage(
    chatRef.id,
    `${currentUserName} created the group.`
  );

  const joinedNames = selectedMemberIds
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
  const chatRef = doc(db, "chats", chatId);

  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    throw new Error("Group not found.");
  }

  const chat = chatSnap.data() as Chat;

  if (
    chat.type !== "group" ||
    !chat.members.includes(currentUserId)
  ) {
    throw new Error("You cannot add members to this group.");
  }

  if (chat.deletedAt) {
    throw new Error("This group was deleted.");
  }

  const newMemberIds = Array.from(
    new Set(selectedMemberIds)
  ).filter((memberId) => !chat.members.includes(memberId));

  if (!newMemberIds.length) {
    throw new Error("Choose at least one new member.");
  }

  const joinedNames = newMemberIds
    .map((memberId) => memberNamesById[memberId])
    .filter(Boolean);

  const systemText = joinedNames.length
    ? `${currentUserName} added ${joinedNames.join(", ")}.`
    : `${currentUserName} added new members.`;

  const unreadUpdates = Object.fromEntries(
    newMemberIds.map((memberId) => [
      `unreadCount.${memberId}`,
      0,
    ])
  );

  await updateDoc(chatRef, {
    members: arrayUnion(...newMemberIds),
    lastMessage: systemText,
    updatedAt: serverTimestamp(),
    ...unreadUpdates,
  });

  await addSystemMessage(chatId, systemText);
};

export const leaveGroupChat = async (
  chatId: string,
  currentUserId: string,
  currentUserName = "Someone"
) => {
  const chatRef = doc(db, "chats", chatId);

  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    throw new Error("Group not found.");
  }

  const chat = chatSnap.data() as Chat;

  if (
    chat.type !== "group" ||
    !chat.members.includes(currentUserId)
  ) {
    throw new Error("You cannot leave this chat.");
  }

  if (chat.deletedAt) {
    throw new Error("This group was deleted.");
  }

  const remainingMembers = chat.members.filter(
    (memberId) => memberId !== currentUserId
  );

  if (!remainingMembers.length) {
    await updateDoc(chatRef, {
      deletedAt: serverTimestamp(),
      deletedBy: currentUserId,
      lastMessage: `${currentUserName} left and the group was closed.`,
      updatedAt: serverTimestamp(),
    });

    await addSystemMessage(
      chatId,
      `${currentUserName} left and the group was closed.`
    );

    return;
  }

  const nextAdminId =
    chat.adminId === currentUserId
      ? remainingMembers[0]
      : chat.adminId;

  const systemText = `${currentUserName} left the group.`;

  await updateDoc(chatRef, {
    members: arrayRemove(currentUserId),
    adminId: nextAdminId,
    lastMessage: systemText,
    updatedAt: serverTimestamp(),
    [`unreadCount.${currentUserId}`]: deleteField(),
  });

  await addSystemMessage(chatId, systemText);
};

export const deleteGroupChat = async (
  chatId: string,
  currentUserId: string,
  currentUserName = "Someone"
) => {
  const chatRef = doc(db, "chats", chatId);

  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) {
    throw new Error("Group not found.");
  }

  const chat = chatSnap.data() as Chat;

  if (
    chat.type !== "group" ||
    chat.adminId !== currentUserId
  ) {
    throw new Error(
      "Only the group admin can delete this chat."
    );
  }

  if (chat.deletedAt) {
    return;
  }

  const systemText = `${currentUserName} deleted the group.`;

  await updateDoc(chatRef, {
    deletedAt: serverTimestamp(),
    deletedBy: currentUserId,
    lastMessage: systemText,
    updatedAt: serverTimestamp(),
  });

  await addSystemMessage(chatId, systemText);
};

export const updateLastMessage = async (
  chatId: string,
  messageText: string
) => {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    lastMessage: messageText,
    updatedAt: serverTimestamp(),
  });
};
