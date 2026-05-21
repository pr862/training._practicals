import type { Timestamp } from "firebase/firestore";

export const formatChatTime = (updatedAt: Timestamp) => {
  if (
    updatedAt &&
    typeof updatedAt === "object" &&
    "toDate" in updatedAt &&
    typeof updatedAt.toDate === "function"
  ) {
    return (updatedAt.toDate() as Date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return "";
};

export const getChatTimeValue = (updatedAt: Timestamp) => {
  if (
    updatedAt &&
    typeof updatedAt === "object" &&
    "toMillis" in updatedAt &&
    typeof updatedAt.toMillis === "function"
  ) {
    return updatedAt.toMillis() as number;
  }

  return 0;
};
