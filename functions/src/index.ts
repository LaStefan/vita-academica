import { onCall } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import * as path from "path";
import * as fs from "fs";

admin.initializeApp();


const bucket = admin.storage().bucket();
const token = "1//09FteSpjMvmmZCgYIARAAGAkSNwF-L9IrD-m-6bwtYI_GGKTJb3oO7V1On5QKfQnxhSVYrITsjjA83Akpowq_IZmBGzuuWSdlg7E";

export const deployWebsite = onCall({ region: "europe-west1" }, async (req) => {
    const { userId, domain, websiteHTML } = req.data;

    if (!userId || !domain || !websiteHTML) {
        throw new Error("Missing user ID, domain or website html");
    }

    const firebaseTools = await import("firebase-tools");
    const tools = firebaseTools.default;

    try {
        const tempDir = path.join("/tmp", domain);
        const indexPath = path.join(tempDir, "index.html");

        fs.mkdirSync(tempDir, { recursive: true });
        fs.writeFileSync(indexPath, websiteHTML, "utf-8");

        await bucket.upload(indexPath, {
            destination: `users/${userId}/website/index.html`,
            public: true,
            metadata: { contentType: "text/html" },
        });

        console.log(`✅ Uploaded to Storage`);

        // Try to create hosting site if it doesn't exist
        try {
            await tools.hosting.sites.create(domain, {
                project: "testing-vita-academica",
                token,
            });
            console.log(`✅ Hosting site created: ${domain}`);
        } catch (e) {
            if (e instanceof Error && e.message?.includes("already exists")) {
                console.log(`Site ${domain} already exists, continuing...`);
            } else {
                throw e;
            }
        }

        const firebaseJsonPath = path.join(tempDir, "firebase.json");
        const firebaseConfig = {
            hosting: {
                public: "./",
                site: domain,
            },
        };
        fs.writeFileSync(firebaseJsonPath, JSON.stringify(firebaseConfig, null, 2));

        await tools.deploy({
            project: "testing-vita-academica",
            cwd: tempDir,
            only: "hosting",
            token,
        });

        console.log(`✅ Deployed to Firebase Hosting`);
        const websiteUrl = `https://${domain}.web.app`;

        return { success: true, url: websiteUrl };
    } catch (error) {
        console.error("Deploy failed:", error);
        throw new Error("Deployment failed");
    }
});
