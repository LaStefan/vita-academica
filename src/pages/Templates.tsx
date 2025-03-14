
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TemplatesSection from "@/components/TemplatesSection";
import CtaSection from "@/components/CtaSection";

const Templates = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto py-16 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-academic-dark mb-12">
            Choose Your Academic Template
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center mb-16">
            Select from our professionally designed templates to showcase your academic achievements.
            Each template is optimized for academic profiles and customizable to your needs.
          </p>
          <TemplatesSection />
        </div>
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
};

export default Templates;
