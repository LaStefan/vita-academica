
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
type TemplateCardProps = {
  image: string;
  title: string;
  description: string;
};

const TemplateCard = ({ image, title, description }: TemplateCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border hover:shadow-md transition-shadow duration-300">
      <div className="h-64 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link to="/templates">
          <Button variant="outline" size="sm" className="text-academic-orange border-academic-orange hover:bg-orange-50">
            Preview Template
          </Button>
        </Link>
      </div>
    </div>
  );
};

const TemplatesSection = () => {
  return (
    <section className="py-16 px-4 ">
      <div className="container mx-auto ">
        <div className="text-center mb-12">
          <span className="inline-block bg-orange-100 text-academic-orange px-4 py-2 rounded-full text-sm font-medium mb-4">
            Templates
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Professional Templates
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Choose from our carefully crafted templates designed for academics
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
          <TemplateCard
            image="public/assets/classic_template.png"  // Pass the image path as a prop
            title="Classic Academic"
            description="Traditional layout with modern touches, perfect for professors and researchers"
            />

            <TemplateCard
              image="https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              title="Research Focus"
              description="Highlight your research and publications with this specialized layout"
            />
            <TemplateCard
              image= "public/assets/website_template.png"
              title="Digital Portfolio"
              description="Modern web presence for academics with visual emphasis and clean design"
            />
          </div>
          
          <div className="mt-10">
            <Link to="/templates">
              <Button className="bg-academic-orange hover:bg-academic-orange/90 text-white">
                View All Templates
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TemplatesSection;
