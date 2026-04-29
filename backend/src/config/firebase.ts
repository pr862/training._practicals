import admin from "firebase-admin";
import path from "path";
import fs from "fs";

const getServiceAccountPath = () => {
  const rootPath = path.join(process.cwd(), "serviceAccountKey.json");
  const configPath = path.join(__dirname, "serviceAccountKey.json");

  if (fs.existsSync(rootPath)) return rootPath;
  if (fs.existsSync(configPath)) return configPath;
  throw new Error("Firebase serviceAccountKey.json not found ");
};

admin.initializeApp({
  credential: admin.credential.cert(getServiceAccountPath()),
});

const db = admin.firestore();
export { db };