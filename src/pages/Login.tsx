import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { signInWithEmail, signInWithGoogle } from '@/lib/firebase/auth';
import { FcGoogle } from 'react-icons/fc';
import { useFirebase } from '@/lib/firebase/FirebaseContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useFirebase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    if (currentUser) {
      // Get the intended destination from location state, or default to dashboard
      const from = location.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [currentUser, navigate, location]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    try {
      setLoading(true);
      await signInWithEmail(email, password);

      toast.success('Login successful!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(
        error.message || 'Failed to login. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();

      toast.success('Google login successful!');
    } catch (error: any) {
      console.error('Google login error:', error);
      toast.error(error.message || 'Failed to login with Google.');
    } finally {
      setLoading(false);
    }
  };

  // If we're already loading user data, show loading spinner
  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-academic-orange'></div>
      </div>
    );
  }

  return (
    <div
      className='min-h-screen flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat'
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'rgba(0,0,0,0.6)',
      }}>
      <Card className='w-full max-w-md bg-white/95 backdrop-blur-sm shadow-xl'>
        <CardHeader className='text-center'>
          <div className='flex justify-center mb-4'>
            <Link to='/' className='flex items-center gap-2'>
              <GraduationCap className='h-6 w-6' />
              <span className='text-xl font-bold'>
                Vita <span className='text-academic-orange'>Academica</span>
              </span>
            </Link>
          </div>
          <CardTitle className='text-2xl'>Login to your account</CardTitle>
          <CardDescription>
            Enter your email to sign in to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <label htmlFor='email' className='text-sm font-medium'>
                Email
              </label>
              <Input
                id='email'
                placeholder='Enter your email'
                type='email'
                value={email}
                onChange={handleEmailChange}
                disabled={loading}
              />
            </div>
            <div className='space-y-2'>
              <label htmlFor='password' className='text-sm font-medium'>
                Password
              </label>
              <Input
                id='password'
                placeholder='Enter your password'
                type='password'
                value={password}
                onChange={handlePasswordChange}
                disabled={loading}
              />
            </div>
            <Button
              type='submit'
              className='w-full bg-academic-orange hover:bg-academic-orange/90 text-white'
              disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>

            <div className='relative my-4'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-2 bg-white text-gray-500'>or</span>
              </div>
            </div>

            <Button
              type='button'
              variant='outline'
              className='w-full'
              onClick={handleGoogleSignIn}
              disabled={loading}>
              <FcGoogle className='mr-2 h-4 w-4' />
              Continue with Google
            </Button>

            <div className='text-center pt-4'>
              <p className='text-sm text-gray-500'>
                Don't have an account?{' '}
                <Link
                  to='/signup'
                  className='text-academic-orange underline hover:text-academic-orange/90'>
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
