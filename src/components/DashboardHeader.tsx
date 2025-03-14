
import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Bell, 
  Menu,
  User,
  ChevronDown
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const DashboardHeader = () => {
  return (
    <header className="border-b bg-white p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="relative hidden sm:block w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input placeholder="Search..." className="pl-9" />
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 bg-academic-orange text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            3
          </span>
        </Button>
        
        <div className="hidden sm:flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          <Button variant="ghost" className="flex items-center gap-1 h-8 font-normal">
            Dr. Smith
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
