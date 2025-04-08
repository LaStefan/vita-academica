const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const path = require("path");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");

admin.initializeApp();
const storage = new Storage();
const bucket = storage.bucket("testing-vita-academica.firebasestorage.app"); // Change to the appropriate bucket

require("dotenv").config();
const token = process.env.DEPLOY_FIREBASE_AUTH_TOKEN;

require("dotenv").config();
const token = process.env.DEPLOY_FIREBASE_AUTH_TOKEN;

exports.deployWebsite = onRequest({ region: "europe-west1" }, async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(204).send('');
    if (req.method !== "POST") return res.status(400).json({ error: "Use POST" });

    const firebaseTools = require("firebase-tools");

    const { userId, website } = req.body.payload || {};

    if (!userId || !website) {
        return res.status(400).json({ error: "User ID and website content are required" });
    }

    const firebaseTools = await import("firebase-tools");
    const tools = firebaseTools.default;

    try {
        const tempDir = path.join("/tmp", domain);
        const indexPath = path.join(tempDir, "index.html");


        fs.mkdirSync(tempDir, { recursive: true });
        fs.writeFileSync(indexPath, websiteHTML, "utf-8");

        // Optional: Upload to storage
        await bucket.upload(indexPath, {
            destination: `users/${userId}/website/index.html`,
            public: true,
            metadata: { contentType: "text/html" },
        });

        console.log(`✅ Uploaded to Storage`);

        // 🔥 Create hosting site programmatically (if not already created)
        try {
            await tools.hosting.sites.create(domain, {
                project: "testing-vita-academica",
                token: token,
            });
            console.log(`✅ Hosting site created: ${domain}`);
        } catch (e) {
            if (e.message.includes("already exists")) {
                console.log(`Site ${userId} already exists, continuing...`);
            } else {
                throw e;
            }
        }

        const firebaseJsonPath = path.join(tempDir, "firebase.json");
        const firebaseConfig = {
            hosting: {
                public: "./",
                site: userId
            }
        };
        fs.writeFileSync(firebaseJsonPath, JSON.stringify(firebaseConfig, null, 2));

        // 🚀 Deploy to Firebase Hosting (multi-site hosting)
        await firebaseTools.deploy({
            project: "testing-vita-academica",
            cwd: tempDir,
            only: "hosting",
            token: token
        });

        console.log(`✅ Deployed to Firebase Hosting`);
        const websiteUrl = `https://${userId}.web.app`; // Firebase auto-generates this domain

        return { success: true, url: websiteUrl };
    } catch (error) {
        console.error("Deploy failed:", error);
        throw new Error("Deployment failed");
    }
});

