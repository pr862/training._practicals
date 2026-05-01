import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/Auth";

interface UserType {
  uid: string;
  email: string;
}

export default function Users() {
  const [users, setUsers] = useState<UserType[]>([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      const list = snapshot.docs
        .map((doc) => doc.data() as UserType)
        .filter((u) => u.uid !== currentUser?.uid);
      setUsers(list);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return (
    <div className="h-screen flex">
      <div className="w-1/3 border-r p-4">
        <h2 className="text-xl font-bold mb-4">Users</h2>
        {users.map((u) => (
          <div
            key={u.uid}
            className="p-2 hover:bg-gray-200 cursor-pointer rounded"
          >
            {u.email}
          </div>
        ))}
      </div>
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a user to start chat
      </div>
    </div>
  );
}
