
import React from "react";
import { ArrowRight } from "lucide-react";

const HowItWorksSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="mb-12 text-center">
          <span className="inline-block bg-orange-100 text-academic-orange px-4 py-2 rounded-full text-sm font-medium mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Simple Process, Powerful Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get your academic portfolio online in minutes
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div className="text-center relative">
            <div className="w-16 h-16 bg-academic-orange text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              1
            </div>
            <h3 className="text-xl font-bold mb-4">Upload Your CV</h3>
            <p className="text-gray-600">
              Upload your existing CV or create a new one from scratch using our templates.
            </p>
            
            {/* Arrow positioned between steps 1 and 2 - only visible on desktop */}
            <div className="hidden md:block absolute top-6 right-[-20px] transform translate-x-1/2">
              <ArrowRight className="text-academic-orange w-8 h-8" />
            </div>
          </div>
          
          <div className="text-center relative">
            <div className="w-16 h-16 bg-academic-orange text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              2
            </div>
            <h3 className="text-xl font-bold mb-4">Customize & Edit</h3>
            <p className="text-gray-600">
              Refine your information, add publications, and customize your profile.
            </p>
            
            {/* Arrow positioned between steps 2 and 3 - only visible on desktop */}
            <div className="hidden md:block absolute top-6 right-[-20px] transform translate-x-1/2">
              <ArrowRight className="text-academic-orange w-8 h-8" />
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-academic-orange text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
              3
            </div>
            <h3 className="text-xl font-bold mb-4">Share & Export</h3>
            <p className="text-gray-600">
              Generate a professional website or export your CV in various formats.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
