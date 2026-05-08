import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import type { User } from "../types";

interface FirestoreUser {
  uid?: string;
  email?: string;
  name?: string;
  image?: string;
  photoURL?: string;
  createdAt?: unknown;
}

const normalizeUser = (id: string, data: FirestoreUser): User => ({
  email: data.email ?? "",
  createdAt: data.createdAt,
  uid: data.uid ?? id,
  name: data.name ?? "",
  photoURL: data.photoURL ?? data.image ?? "",
});

export function useUsersCollection() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const nextUsers = snapshot.docs.map((doc) =>
        normalizeUser(doc.id, doc.data() as FirestoreUser)
      );

      setUsers(nextUsers);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return { users, loading };
}
