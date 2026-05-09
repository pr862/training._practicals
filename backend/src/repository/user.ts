import { db } from "../config/firebase";
import { User, UserRole } from "../types/user";

const userCollection = db.collection("users");

export const findUserByEmail = async (email: string) => {
  const snapshot = await userCollection.where("email", "==", email).get();
  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  return { id: doc.id, ...(doc.data() as Omit<User, "id">) };
};

export const findAdmin = async () => {
  const snapshot = await userCollection
    .where("role", "==", UserRole.ADMIN)
    .get();

  return !snapshot.empty;
};

export const createUser = async (data: Omit<User, "id">) => {
  const docRef = await userCollection.add(data);
  return { id: docRef.id, ...data };
};
