import { Timestamp } from "firebase/firestore";

export interface User {
  id?: string;
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
  createdAt?: Timestamp;
}