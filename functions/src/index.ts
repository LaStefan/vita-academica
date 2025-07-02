import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp();

// Export all functions from their respective modules
export { deployWebsite } from "./website/deployWebsite";
export { parseCvWithGemini } from "./ai/processCV";