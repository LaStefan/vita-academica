
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    content: "Vita Academica has transformed the way I present my research online. I was able to create a professional academic profile in minutes!",
    author: "Dr. Sarah Johnson",
    role: "Associate Professor of Biology",
    university: "Oxford University",
    avatar: "",
    initials: "SJ"
  },
  {
    id: 2,
    content: "The template options are excellent and specifically tailored for academic needs. The CV parsing saved me hours of manual input.",
    author: "Prof. Michael Chen",
    role: "Professor of Computer Science",
    university: "Stanford University",
    avatar: "",
    initials: "MC"
  },
  {
    id: 3,
    content: "I appreciate how easy it is to update my publications and share them directly to academic networks. Outstanding platform!",
    author: "Dr. Emily Patel",
    role: "Research Fellow",
    university: "MIT",
    avatar: "",
    initials: "EP"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 px-4 bg-academic-light">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Academics Say About Us
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join our of satisfied academics community who have enhanced their online presence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="border border-gray-200 hover:shadow-md transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="flex items-center text-academic-orange mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <Avatar className="h-10 w-10 mr-4 bg-orange-100 text-academic-orange">
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                    <AvatarImage src={testimonial.avatar} />
                  </Avatar>
                  <div>
                    <h4 className="font-semibold">{testimonial.author}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.university}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
