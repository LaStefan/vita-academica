import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import WebsitePreview from "@/components/WebsitePreview";
import { ParsedCV } from "@/services/documentParser";

const PublishedWebsite = () => {
    const { domain } = useParams();
    const [cvData, setCvData] = useState<ParsedCV | null>(null);
    const [template, setTemplate] = useState<string>("academic");
    const [sections, setSections] = useState<Record<string, boolean>>({});
    const [theme, setTheme] = useState<string>("light");

    useEffect(() => {
        if (!domain) return;

        //Load the CV data, template, and sections from localStorage
        const storedData = localStorage.getItem(`cvData-${domain}`);
        const storedTemplate = localStorage.getItem(`template-${domain}`);
        const storedSections = localStorage.getItem(`sections-${domain}`);
        const storedTheme = localStorage.getItem(`theme-${domain}`);

        if (storedData) setCvData(JSON.parse(storedData));
        if (storedTemplate) setTemplate(storedTemplate);
        if (storedSections) setSections(JSON.parse(storedSections));
        if (storedTheme) setTheme(storedTheme);
    }, [domain]);

    if (!cvData) {
        return <p className="text-center mt-10">Loading website...</p>;
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
