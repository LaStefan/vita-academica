
import React from "react";
import { Upload, Edit, Share, Check } from "lucide-react";

const FeatureCard = ({ 
  icon, 
  title, 
  description,
  bulletPoints
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  bulletPoints: string[];
}) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border flex flex-col items-center text-center hover:shadow-md transition-shadow duration-300">
      <div className="mb-4 text-academic-orange">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      
      <div className="w-full text-left space-y-2">
        {bulletPoints.map((point, index) => (
          <div key={index} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
            <span className="text-gray-700 text-sm">{point}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const FeaturesSection = () => {
  return (
    <section className="py-16 px-4 bg-academic-light">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block bg-orange-100 text-academic-orange px-4 py-2 rounded-full text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Everything You Need in One Place
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Vita Academica provides all the tools you need to manage your academic profile
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Upload className="w-12 h-12" />}
            title="CV Upload & Parse"
            description="Upload your existing CV and our smart system will automatically extract and organize your information."
            bulletPoints={[
              "Supports PDF, Word, and LaTeX formats",
              "Intelligent data extraction",
              "Automatic categorization"
            ]}
          />
          <FeatureCard
            icon={<Edit className="w-12 h-12" />}
            title="Easy Editing"
            description="Update your academic achievements, publications, and experience with our intuitive editor."
            bulletPoints={[
              "Drag-and-drop interface",
              "Real-time preview",
              "Version history"
            ]}
          />
          <FeatureCard
            icon={<Share className="w-12 h-12" />}
            title="Export & Share"
            description="Generate professional PDFs or create a stunning web presence with our customizable templates."
            bulletPoints={[
              "Multiple export formats",
              "Custom domain support",
              "SEO optimization"
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
