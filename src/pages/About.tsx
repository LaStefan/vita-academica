
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GraduationCap, Users, BookOpen, Globe, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24  y-16 md:py-24 bg-academic-light">
          <div className="container mx-auto px-4 ">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-academic-dark mb-6">
                Our Mission
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
              At Vita Academica, we simplify academic career management by Organizing CVs, generating professional websites, and syncing with academic platforms. Showcase your work effortlessly and stay connected with the research community.
              </p>
              <div className="flex justify-center">
                <GraduationCap className="h-24 w-24 text-academic-orange opacity-80" />
              </div>
            </div>
          </div>
        </section>
        
        {/* Our Story Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
              
              <div className="max-w-3xl mx-auto text-center">
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                Vita Academica began with four students and a shared ambition to build something meaningful for the academic community. Our professors often told us how managing their CVs, publications, and online presence was time-consuming and frustrating. Inspired by their struggles, we decided to create a solution. Through long nights of coding, brainstorming, and countless cups of coffee, Vita Academica was born : a platform that makes academic career management effortless. From effortlessly managing your CVs, generating professional websites to syncing with academic platforms, we’re here to help researchers and professors focus on what truly matters: their work.                </p>                
              </div>
            </div>
          </div>
        </section>
        
        

        {/* Team Section */}
        <section className="py-16 bg-academic-light">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {/* Team member cards would go here - Adding a few examples */}

              <div className="text-center">
              <img 
                src={"public/assets/Stefan.png"} 
                alt="Stefan Lazarević" 
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="font-bold text-lg">Stefan Lazarević</h3>
              <p className="text-gray-600">Founder & CTO</p>
            </div>
                

            <div className="text-center">
              <img 
                src={"public/assets/jandre.png"} 
                alt="Jandre Kostić" 
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="font-bold text-lg">Jandre Kostić</h3>
              <p className="text-gray-600">Founder & CEO</p>
            </div>

            <div className="text-center">
              <img 
                src={"public/assets/youssef.png"} 
                alt="Youssef Ben Mansour" 
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="font-bold text-lg">Youssef Ben Mansour</h3>
              <p className="text-gray-600">Founder & CSMO</p>
            </div>

            <div className="text-center">
              <img 
                src={"public/assets/pablo.png"} 
                alt="Pablo Arteaga Bravo" 
                className="w-32 h-32 mx-auto rounded-full object-cover mb-4"
              />
              <h3 className="font-bold text-lg">Pablo Arteaga Bravo</h3>
              <p className="text-gray-600">Founder & COO</p>
            </div>
            </div>
        
              
             
              
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="py-16 bg-academic-orange">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
            <p className="text-xl text-academic-black mb-8 max-w-2xl mx-auto">
              Have questions about Vita Academica? We'd love to hear from you!
            </p>
            
            <Button className="bg-academic-light hover:bg-academic-light/90 text-black">
            <Mail className="h-4 w-4 mr-2" /> Contact Us
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
