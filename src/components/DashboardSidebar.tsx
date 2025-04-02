import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  LayoutDashboard,
  FileText,
  Globe,
  Clock,
  Settings,
  LogOut,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useFirebase } from '@/lib/firebase/FirebaseContext';
import { signOutUser } from '@/lib/firebase/auth';
import { toast } from 'sonner';

const SidebarItem = ({
  icon: Icon,
  label,
  href,
  active = false,
}: {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}) => (
  <Link to={href} className='block w-full'>
    <Button
      variant='ghost'
      className={cn(
        'w-full justify-start gap-3 font-normal',
        active ? 'bg-primary/10 text-primary' : 'hover:bg-primary/5'
      )}>
      <Icon className='h-5 w-5' />
      <span>{label}</span>
    </Button>
  </Link>
);

const DashboardSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useFirebase();

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!currentUser || !currentUser.displayName) return 'U';

    const nameParts = currentUser.displayName.split(' ');
    if (nameParts.length === 1)
      return nameParts[0].substring(0, 2).toUpperCase();

    return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
  };

  return (
    <div className='hidden md:flex flex-col w-64 border-r bg-white h-screen sticky top-0'>
      <div className='p-4 border-b'>
        <Link to='/' className='flex items-center gap-2'>
          <GraduationCap className='h-6 w-6' />
          <span className='text-xl font-bold'>
            Vita <span className='text-academic-orange'>Academica</span>
          </span>
        </Link>
      </div>

      <div className='p-4 border-b'>
        <div className='flex items-center gap-3'>
          <Avatar>
            <AvatarImage
              src={currentUser?.photoURL || ''}
              alt={currentUser?.displayName || 'User'}
            />
            <AvatarFallback>{getUserInitials()}</AvatarFallback>
          </Avatar>
          <div>
            <p className='font-medium'>{currentUser?.displayName || 'User'}</p>
            <p className='text-sm text-gray-600'>Academic Professional</p>
          </div>
        </div>
      </div>

      <nav className='flex-1 p-4 space-y-1'>
        <SidebarItem
          icon={LayoutDashboard}
          label='Dashboard'
          href='/dashboard'
          active={location.pathname === '/dashboard'}
        />
        <SidebarItem
          icon={FileText}
          label='CV Manager'
          href='/cv-manager'
          active={location.pathname === '/cv-manager'}
        />
        <SidebarItem
          icon={Globe}
          label='Website Generator'
          href='/website'
          active={location.pathname === '/website'}
        />
        <SidebarItem
          icon={Clock}
          label='Activity History'
          href='/activity'
          active={location.pathname === '/activity'}
        />
        {/* <SidebarItem 
          icon={User} 
          label="Profile" 
          href="/profile" 
          active={location.pathname === '/profile'} 
        /> */}
        <SidebarItem
          icon={Settings}
          label='Settings'
          href='/settings'
          active={location.pathname === '/settings'}
        />
      </nav>

      <div className='p-4 border-t mt-auto'>
        <Button
          variant='outline'
          className='w-full justify-start gap-3'
          onClick={handleLogout}>
          <LogOut className='h-5 w-5' />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
