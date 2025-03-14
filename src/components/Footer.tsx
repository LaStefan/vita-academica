
import React from "react";
import { Link } from "react-router-dom";
import { GraduationCap, Twitter, Linkedin, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <GraduationCap className="h-6 w-6" />
              <span className="text-xl font-bold">
                Vita <span className="text-academic-orange">Academica</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm">
              Your academic journey, in one place
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Features</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/features/cv-upload" className="text-gray-400 hover:text-white text-sm">
                  CV Upload
                </Link>
              </li>
              <li>
                <Link to="/templates" className="text-gray-400 hover:text-white text-sm">
                  Templates
                </Link>
              </li>
              <li>
                <Link to="/features/export" className="text-gray-400 hover:text-white text-sm">
                  Export Options
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white text-sm">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-4 border-t border-gray-800 text-center text-gray-400 text-sm">
          © 2025 VitaAcademica. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
