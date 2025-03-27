
import React from "react";
import { Book, Globe, ChartBarIncreasing, NotebookTabs } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const WhyChooseSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block bg-orange-100 text-academic-orange px-4 py-2 rounded-full text-sm font-medium mb-4">
              Benefits
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Why Choose Vita Academica?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Our platform is specifically designed for academics, researchers, and educators.
            </p>

            <div className="space-y-6">

            <Separator />
            <div className="flex gap-4">
                <div className="text-academic-orange">
                  <NotebookTabs className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Easily Organize Your Achievements</h3>
                  <p className="text-gray-600">
                  Quickly arrange your education, publications, and research contributions with a user-friendly navigation
                  </p>
                </div>
              </div>
              <Separator />
              <div className="flex gap-4">
                <div className="text-academic-orange">
                  <Book className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Academic-Focused</h3>
                  <p className="text-gray-600">
                    Templates and features designed specifically for academic profiles
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex gap-4">
                <div className="text-academic-orange">
                  <Globe className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2"> Easily Create Your Website                  </h3>
                  <p className="text-gray-600">
                  Effortlessly build a professional portfolio to showcase your research, publications, and academic achievements.                  </p>
                </div>
              </div>
              
              
            </div>
          </div>
          
          <div className="rounded-xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="Academic library with books" 
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseSection;
