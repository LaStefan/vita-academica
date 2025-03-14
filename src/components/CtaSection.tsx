
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CtaSection = () => {
  return (
    <section className="bg-academic-orange text-white py-16 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Elevate Your Academic Profile?
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Start To Simplify Your Academic Journey
        </p>
        <Link to="/signup">
          <Button 
            variant="outline" 
            className="bg-white text-academic-orange hover:bg-gray-100 border-white px-8 py-6 h-auto text-lg"
          >
            Create Your Profile
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default CtaSection;
