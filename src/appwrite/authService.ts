import { ID } from "appwrite";
import { account } from "./client";

export async function register(email: string, password: string, name?: string) {
  await account.create({
    userId: ID.unique(),
    email,
    password,
    name,
  });
  return login(email, password);
}

export async function login(email: string, password: string) {
  await account.createEmailPasswordSession({ email, password });
  return getCurrentUser();
}

export async function logout() {
  await account.deleteSession({ sessionId: "current" });
}

export async function getCurrentUser() {
  return account.get();
}
