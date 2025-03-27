import { onRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as path from "path";
import { Storage } from "@google-cloud/storage";
import * as fs from "fs";

admin.initializeApp();

const storage = new Storage();
const bucket = storage.bucket("testing-vita-academica.firebasestorage.app"); // Change to the appropriate bucket

const token = "1//09FteSpjMvmmZCgYIARAAGAkSNwF-L9IrD-m-6bwtYI_GGKTJb3oO7V1On5QKfQnxhSVYrITsjjA83Akpowq_IZmBGzuuWSdlg7E"; // Change to the appropriate Firebase token

export const deployWebsite = onRequest({ region: "europe-west1" }, async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.status(204).send('');
        return;
    }

    if (req.method !== "POST") {
        res.status(400).json({ error: "Use POST" });
        return;
    }

    const firebaseTools = await import("firebase-tools"); // Very large, so only import when needed

    const { userId, website }: { userId?: string; website?: string } = req.body.payload || {};

    if (!userId || !website) {
        res.status(400).json({ error: "User ID and website content are required" });
        return;
    }

    try {
        const tempDir = path.join("/tmp", userId);
        const indexPath = path.join(tempDir, "index.html");

        fs.mkdirSync(tempDir, { recursive: true });
        fs.writeFileSync(indexPath, website, "utf-8");

        // Upload to Cloud Storage
        await bucket.upload(indexPath, {
            destination: `websites/${userId}/index.html`,
            public: true,
            metadata: { contentType: "text/html" },
        });

        console.log(`✅ Uploaded to Storage`);

        // Try to create hosting site if it doesn't exist
        try {
            await firebaseTools.hosting.sites.create(userId, {
                project: "testing-vita-academica",
                token,
            });
            console.log(`✅ Hosting site created: ${userId}`);
        } catch (e) {
            if (e instanceof Error && e.message?.includes("already exists")) {
                console.log(`Site ${userId} already exists, continuing...`);
            } else {
                throw e;
            }
        }

        // Write firebase.json config for this site
        const firebaseJsonPath = path.join(tempDir, "firebase.json");
        const firebaseConfig = {
            hosting: {
                public: "./",
                site: userId,
            },
        };
        fs.writeFileSync(firebaseJsonPath, JSON.stringify(firebaseConfig, null, 2));

        // Deploy to Firebase Hosting
        await firebaseTools.deploy({
            project: "testing-vita-academica",
            cwd: tempDir,
            only: "hosting",
            token,
        });

        console.log(`✅ Deployed to Firebase Hosting`);
        const websiteUrl = `https://${userId}.web.app`;

        res.json({ success: true, url: websiteUrl });
    } catch (error) {
        console.error("❌ Error deploying website:", error);
        res.status(500).json({ error: "Failed to deploy" });
    }
});
