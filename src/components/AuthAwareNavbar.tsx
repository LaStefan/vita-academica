import React from 'react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GraduationCap, User as UserIcon, LogOut } from 'lucide-react';
import { useFirebase } from '@/lib/firebase/FirebaseContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { signOutUser } from '@/lib/firebase/auth';
import { toast } from 'sonner';

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
const AuthAwareNavbar: React.FC<NavbarProps> = ({ showAuthButtons = true }) => {
  const { currentUser } = useFirebase();
  const navigate = useNavigate();
  const location = useLocation();

  const isOnProtectedRoute =
    location.pathname.includes('/dashboard') ||
    // location.pathname === '/profile' ||
    location.pathname === '/settings' ||
    location.pathname === '/cv-manager' ||
    location.pathname === '/website' ||
    location.pathname === '/activity';

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
    <header className='w-full py-4 px-6 border-b bg-white'>
      <div className='container mx-auto flex items-center justify-between'>
        <Link to='/' className='flex items-center gap-2'>
          <GraduationCap className='h-6 w-6' />
          <span className='text-xl font-bold'>
            Vita <span className='text-academic-orange'>Academica</span>
          </span>
        </Link>

        <nav className='hidden md:flex items-center space-x-6'>
          <Link
            to='/'
            className='text-gray-700 hover:text-academic-orange transition-colors'>
            Home
          </Link>
          <Link
            to='/templates'
            className='text-gray-700 hover:text-academic-orange transition-colors'>
            Templates
          </Link>
          <Link
            to='/pricing'
            className='text-gray-700 hover:text-academic-orange transition-colors'>
            Pricing
          </Link>
          <Link
            to='/about'
            className='text-gray-700 hover:text-academic-orange transition-colors'>
            About
          </Link>
          {currentUser && (
            <Link
              to='/dashboard'
              className='text-gray-700 hover:text-academic-orange transition-colors'>
              Dashboard
            </Link>
          )}
        </nav>

        <div className='flex items-center gap-3'>
          {showAuthButtons &&
            (currentUser ? (
              <div className='flex items-center gap-2'>
                <Link to='/profile'>
                  <Avatar className='h-8 w-8 cursor-pointer'>
                    <AvatarImage
                      src={currentUser.photoURL || ''}
                      alt={currentUser.displayName || 'User'}
                    />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Link>
                <Button
                  variant='outline'
                  size='sm'
                  className='flex items-center gap-2'
                  onClick={handleLogout}>
                  <LogOut className='h-4 w-4' />
                  <span className='hidden sm:inline'>Logout</span>
                </Button>
              </div>
            ) : (
              <>
                <Link to='/login'>
                  <Button variant='outline'>Log In</Button>
                </Link>
                <Link to='/signup'>
                  <Button className='bg-academic-orange hover:bg-academic-orange/90 text-white'>
                    Sign Up
                  </Button>
                </Link>
              </>
            ))}
        </div>
      </div>
    </header>
  );
};

export default AuthAwareNavbar;
