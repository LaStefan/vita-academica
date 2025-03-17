import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import WebsitePreview from "@/components/WebsitePreview";
import { ParsedCV } from "@/services/documentParser";
import { db } from "@/lib/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const PublishedWebsite = () => {
    const { domain } = useParams();
    const [cvData, setCvData] = useState<ParsedCV | null>(null);
    const [template, setTemplate] = useState<string>("academic");
    const [sections, setSections] = useState<Record<string, boolean>>({});
    const [theme, setTheme] = useState<string>("light");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!domain) return;

        const fetchWebsiteData = async () => {
            try {
                const docRef = doc(db, "websites", domain);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setCvData(data.cvData);
                    setTemplate(data.selectedTemplate);
                    setSections(data.sections);
                    setTheme(data.theme);
                } else {
                    console.error("Website not found!");
                }
            } catch (error) {
                console.error("Error fetching website:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchWebsiteData();
    }, [domain]);

    if (loading) {
        return <p className="text-center mt-10">Loading website...</p>;
    }

    if (!cvData) {
        return <p className="text-center mt-10 text-red-500">Website not found!</p>;
    }

    return (
        <div className="min-h-screen">
            <WebsitePreview
                cvData={cvData}
                template={template}
                websiteSettings={{ theme: theme, domain: domain as string, sections }}
            />
        </div>
    );
};

export default PublishedWebsite;