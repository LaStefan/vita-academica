
import React from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, User as UserIcon } from "lucide-react";
import { useFirebase } from "@/lib/firebase/FirebaseContext";

/**
 * NavbarProps interface
 */
interface NavbarProps {
  showAuthButtons?: boolean;
}

/**
 * Authentication-aware Navbar component
 * 
 * This component displays different navigation options based on the user's authentication status.
 */
const AuthAwareNavbar: React.FC<NavbarProps> = ({ 
  showAuthButtons = true 
}) => {
  const { currentUser, isDevMode } = useFirebase();
  const navigate = useNavigate();
  
  // Only show user as logged in if we're on the dashboard route
  // This ensures the landing page always shows login/signup buttons
  const isOnDashboard = window.location.pathname.includes('/dashboard') || 
                        window.location.pathname === '/profile' ||
                        window.location.pathname === '/settings' ||
                        window.location.pathname === '/cv-manager' ||
                        window.location.pathname === '/website' ||
                        window.location.pathname === '/activity';

  const showAsLoggedIn = isOnDashboard && currentUser;

  return (
    <header className="w-full py-4 px-6 border-b bg-white">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6" />
          <span className="text-xl font-bold">
            Vita <span className="text-academic-orange">Academica</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/" className="text-gray-700 hover:text-academic-orange transition-colors">
            Home
          </Link>
          <Link to="/templates" className="text-gray-700 hover:text-academic-orange transition-colors">
            Templates
          </Link>
          <Link to="/pricing" className="text-gray-700 hover:text-academic-orange transition-colors">
            Pricing
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-academic-orange transition-colors">
            About
          </Link>
          {/* {showAsLoggedIn && (
            <Link to="/dashboard" className="text-gray-700 hover:text-academic-orange transition-colors">
              Dashboard
            </Link>
          )} */}
        </nav>

        <div className="flex items-center gap-3">
          {showAuthButtons && (
            showAsLoggedIn ? (
              <div className="flex items-center gap-2">
                <Link to="/profile">
                  <Button variant="outline" className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    Profile
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline">Log In</Button>
                </Link>
                <Link to="/signup">
                  <Button
                    className="bg-academic-orange hover:bg-academic-orange/90 text-white"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </header>
  );
};

export default AuthAwareNavbar;
