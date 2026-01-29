import { Client, Account, Storage, TablesDB } from "appwrite";
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "./config";

export const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)

export const account = new Account(client);
export const storage = new Storage(client);
export const tablesDB = new TablesDB(client);

