
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { GraduationCap, Mail, AtSign, Loader2 } from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For development, bypass validation so we can easily enter the dashboard
    setLoading(true);
      
    // Show success message and redirect to dashboard
    setTimeout(() => {
      toast.success("Account created successfully!");
      navigate("/dashboard");
      setLoading(false);
    }, 1000);
    
    // Actual signup code (commented out for future use)
    /*
    if (!name || !email || !password) {
      toast.error("Please fill out all fields");
      return;
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    
    try {
      setLoading(true);
      // In a real app, you would use: await signUpWithEmail(email, password, name);
      
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
    */
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    
    // Simply redirect to dashboard for development
    setTimeout(() => {
      toast.success("Account created successfully!");
      navigate("/dashboard");
      setLoading(false);
    }, 1000);
    
    // Actual Google signup code (commented out for future use)
    /*
    try {
      setLoading(true);
      // In a real app, you would use: await signInWithGoogle();
      
      toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Google signup error:", error);
      toast.error(error.message || "Failed to sign up with Google.");
    } finally {
      setLoading(false);
    }
    */
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')", 
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundBlendMode: "overlay",
        backgroundColor: "rgba(0,0,0,0.6)"
      }}
    >
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6" />
              <span className="text-xl font-bold">
                Vita <span className="text-academic-orange">Academica</span>
              </span>
            </Link>
          </div>
          <CardTitle className="text-2xl">Sign up</CardTitle>
          <CardDescription>Try Vita Academica today</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Full Name</label>
              <Input 
                id="name" 
                placeholder="Enter your full name" 
                type="text"
                value={name}
                onChange={handleNameChange}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <Input 
                id="email" 
                placeholder="Enter your email" 
                type="email"
                value={email}
                onChange={handleEmailChange}
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">Password</label>
              <Input 
                id="password" 
                placeholder="Create a password" 
                type="password"
                value={password}
                onChange={handlePasswordChange}
                disabled={loading}
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-academic-orange hover:bg-academic-orange/90 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Continue"
              )}
            </Button>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>
            
            <Button 
              type="button"
              variant="outline" 
              className="w-full" 
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <Mail className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
            
            <Button 
              type="button"
              variant="outline" 
              className="w-full"
              disabled
            >
              <AtSign className="mr-2 h-4 w-4" />
              Continue with ORCID
            </Button>
            
            <div className="text-center pt-4">
              <p className="text-xs text-gray-500">
                By clicking continue, you agree to our{" "}
                <Link to="/terms" className="underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
            
            <div className="text-center pt-2">
              <p className="text-sm text-gray-500">
                Already have an account?{" "}
                <Link to="/login" className="text-academic-orange underline hover:bg-academic-orange/90">
                  Login
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
