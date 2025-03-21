const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fs = require("fs-extra");
const path = require("path");
const { Storage } = require("@google-cloud/storage");

admin.initializeApp();
const db = admin.firestore();
const storage = new Storage();
const bucket = storage.bucket("testing-8d932.appspot.com");

exports.deployWebsite = functions.https.onRequest(async (req, res) => {
    console.log("🔥 Received Request:", req.method, req.body); // Debug log

    if (req.method !== "POST") {
        return res.status(400).json({ error: "Invalid request method. Use POST." });
    }

    if (!req.body || !req.body.payload || !req.body.payload.userId || !req.body.payload.website) {
        console.error("❌ Missing required data in request body", req.body);
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

        console.log(`✅ Website uploaded for ${userId}`);

        // Generate the public URL for the website
        const websiteUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/websites%2F${userId}%2Findex.html?alt=media`;

        res.json({ success: true, url: websiteUrl });
    } catch (error) {
        console.error("❌ Error deploying website:", error);
        res.status(500).json({ error: "Failed to deploy" });
    }
});


// exports.deployWebsite2 = functions.https.onRequest(async (req, res) => {
//     if (req.method !== "POST") {
//         return res.status(400).json({ error: "Invalid request method. Use POST." });
//     }

//     const { userId } = req.body;
//     if (!userId) {
//         return res.status(400).json({ error: "User ID is required" });
//     }

//     try {
//         console.log(`🚀 Fetching website data for ${userId}...`);

//         // Fetch user website data from Firestore
//         const userRef = db.collection("websites").doc(userId);
//         const userSnap = await userRef.get();

//         if (!userSnap.exists) {
//             return res.status(404).json({ error: "User data not found." });
//         }

//         const userData = userSnap.data();

//         console.log(`✅ Generating website for ${userId}`);

//         // Render React component as a static HTML string
//         // const htmlContent = ReactDOMServer.renderToString(
//         //     React.createElement(PublishedWebsite, { websiteData: userData })
//         // );

//         // Wrap content in an HTML document
//         const fullHtml = `
//         <html>
//             <head><title>${userData.cvData?.name}'s Website</title></head>
//             <body></body>
//         </html>`;

//         // Save HTML locally before uploading
//         const outputPath = path.join("/tmp", `${userId}.html`); // Firebase Functions only allow /tmp folder
//         fs.writeFileSync(outputPath, fullHtml);

//         console.log(`✅ Website generated for ${userId}`);

//         // Upload the HTML file to Firebase Storage
//         await bucket.upload(outputPath, {
//             destination: `websites/${userId}/index.html`,
//             public: true, // Make it publicly accessible
//             metadata: {
//                 contentType: "text/html",
//             },
//         });

//         console.log(`✅ Website uploaded for ${userId}`);

//         // Return a Firebase Hosting-friendly URL
//         const websiteUrl = `https://your-platform.web.app/sites/${userId}`;

//         res.json({ success: true, url: websiteUrl });
//     } catch (error) {
//         console.error("❌ Error deploying website:", error);
//         res.status(500).json({ error: "Failed to deploy" });
//     }
// });