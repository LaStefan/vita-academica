
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Gradient background - changed to bottom-to-top direction */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-50 via-academic-light to-white z-0"></div>
      
      <div className="container mx-auto py-16 px-4 md:py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-academic-dark leading-tight">
              Your Academic Journey, <span className="text-academic-orange">In One Place</span>
            </h1>
            <p className="text-lg text-gray-600 max-w-lg">
              Transform your CV into a professional digital presence. 
              Upload, edit, and showcase your academic achievements with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Link to="/signup">
                <Button 
                  className="bg-academic-orange hover:bg-academic-orange/90 text-white px-8 py-6 h-auto text-lg"
                >
                  Get Started
                </Button>
              </Link>
              <Link to="/templates">
                <Button 
                  variant="outline" 
                  className="px-8 py-6 h-auto text-lg"
                >
                  See Templates
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-2xl transform transition-all hover:scale-[1.01] duration-300">
            <img 
              src="src/assets/main-dashboard.png" 
              alt="Academic workspace dashboard showing Dr. Smith's profile with education, experience, achievements, and publications" 
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
