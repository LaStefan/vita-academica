
import React from "react";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type ProfileHeaderProps = {
  name: string;
  title: string;
  institution: string;
  initials: string;
  onEdit?: () => void;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  title,
  institution,
  initials,
  onEdit,
}) => {
  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-sm border">
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <Avatar className="h-24 w-24 text-2xl bg-orange-100 text-academic-orange border-2 border-orange-200">
          <AvatarFallback>{initials}</AvatarFallback>
          <AvatarImage src="" />
        </Avatar>
        
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
          <p className="text-gray-600 text-lg">{title}</p>
          <p className="text-gray-500">{institution}</p>
        </div>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" /> Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
