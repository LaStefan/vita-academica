const { onRequest } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const path = require("path");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const { exec } = require("child_process");

admin.initializeApp();
const db = admin.firestore();
const storage = new Storage();
const bucket = storage.bucket("testing-vita-academica.firebasestorage.app");

exports.deployWebsite = onRequest({ region: "europe-west1" }, async (req, res) => {
    // Set CORS headers
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");

    // Handle preflight OPTIONS request
    if (req.method === "OPTIONS") {
        return res.status(204).send('');
    }

    if (req.method !== "POST") {
        return res.status(400).json({ error: "Invalid request method. Use POST." });
    }

    if (!req.body?.payload?.userId || !req.body?.payload?.website) {
        return res.status(400).json({ error: "User ID and website content are required" });
    }

    const { userId, website } = req.body.payload; // Extracting website HTML from payload

    try {
        console.log(`🚀 Generating website for ${userId}`);

        // Define file paths
        const tempDir = "/tmp"; // Firebase Functions only allow writing to `/tmp/`
        const outputPath = path.join(tempDir, `${userId}.html`);

        // Ensure `/tmp/` exists before writing
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Write the website HTML to a file
        fs.writeFileSync(outputPath, website, "utf-8");

        console.log(`✅ Website generated for ${userId}`);

        // Upload the website file to Firebase Storage
        await bucket.upload(outputPath, {
            destination: `websites/${userId}/index.html`,
            public: true,
            metadata: { contentType: "text/html" },
        });

        // Generate the public URL for the website
        const websiteUrl = `testing-vita-academica.web.app/users/${userId}`

        res.json({ success: true, url: websiteUrl });
    } catch (error) {
        console.error("❌ Error deploying website:", error);
        res.status(500).json({ error: "Failed to deploy" });
    }
});

exports.serveUserSite = onRequest({ region: "europe-west1" }, async (req, res) => {
    const userId = req.path.split("/").pop();
    const file = admin.storage().bucket().file(`websites/${userId}/index.html`);

    try {
        const [exists] = await file.exists();
        if (!exists) return res.status(404).send("Website not found.");

        const [contents] = await file.download();
        res.set("Content-Type", "text/html");
        res.send(contents);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading website.");
    }
});
