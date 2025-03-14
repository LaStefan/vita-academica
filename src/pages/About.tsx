
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
        <section className="py-16 md:py-24 bg-gradient-to-b from-academic-light to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-academic-dark mb-6">
                Our Mission
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                At Vita Academica, we're dedicated to empowering academics and researchers to showcase their work with professional digital presence and compelling CVs that highlight their achievements.
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
              
              <div className="prose prose-lg max-w-none">
                <p>
                  Vita Academica was founded in 2021 by a team of academics and technologists who recognized a significant gap in the tools available to researchers and educators for presenting their work professionally online.
                </p>
                
                <p>
                  As researchers ourselves, we understood the challenges of creating and maintaining an academic CV that effectively communicates research contributions, teaching experience, and professional service. We also recognized how time-consuming it could be to translate that information into a professional academic website.
                </p>
                
                <p>
                  Our platform was built with the specific needs of the academic community in mind, focusing on highlighting publications, research interests, teaching experience, and other scholarly achievements that traditional CV tools often overlook.
                </p>
                
                <p>
                  Today, Vita Academica serves thousands of academics across universities and research institutions worldwide, helping them create impactful digital representations of their academic journey.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="py-16 bg-academic-light/30">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">
                  <BookOpen className="h-12 w-12 text-academic-orange" />
                </div>
                <h3 className="text-xl font-bold mb-3">Knowledge Sharing</h3>
                <p className="text-gray-600">
                  We believe in making academic achievements accessible and discoverable to foster collaboration and advance human knowledge.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">
                  <Users className="h-12 w-12 text-academic-orange" />
                </div>
                <h3 className="text-xl font-bold mb-3">Community</h3>
                <p className="text-gray-600">
                  We're building tools that strengthen the academic community by connecting researchers and their work across institutions and disciplines.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="flex justify-center mb-4">
                  <Globe className="h-12 w-12 text-academic-orange" />
                </div>
                <h3 className="text-xl font-bold mb-3">Accessibility</h3>
                <p className="text-gray-600">
                  We're committed to making professional tools accessible to academics at all career stages and from diverse backgrounds.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Team</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
              {/* Team member cards would go here - Adding a few examples */}
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 mb-4"></div>
                <h3 className="font-bold text-lg">Dr. Emily Chen</h3>
                <p className="text-gray-600">Founder & CEO</p>
                <p className="text-sm text-gray-500">Former Associate Professor of Computer Science</p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 mb-4"></div>
                <h3 className="font-bold text-lg">Prof. Michael Rodriguez</h3>
                <p className="text-gray-600">Chief Academic Officer</p>
                <p className="text-sm text-gray-500">Professor of Education Technology</p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 mb-4"></div>
                <h3 className="font-bold text-lg">Sarah Johnson</h3>
                <p className="text-gray-600">Head of Product</p>
                <p className="text-sm text-gray-500">PhD in Human-Computer Interaction</p>
              </div>
              
              <div className="text-center">
                <div className="w-32 h-32 mx-auto rounded-full bg-gray-200 mb-4"></div>
                <h3 className="font-bold text-lg">Dr. James Wilson</h3>
                <p className="text-gray-600">CTO</p>
                <p className="text-sm text-gray-500">Former Research Scientist at MIT</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section className="py-16 bg-academic-light/20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Have questions about Vita Academica? We'd love to hear from you!
            </p>
            
            <Button className="bg-academic-orange hover:bg-academic-orange/90 text-white">
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
