import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  CheckCircle2,
  User,
  Building2,
  Mail,
  Users,
  Euro,
  EuroIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useFirebase } from '@/lib/firebase/FirebaseContext';
import { FaEuroSign } from 'react-icons/fa';

const Pricing = () => {
  const { currentUser } = useFirebase();

  return (
    <div className='min-h-screen flex flex-col'>
      <Navbar />
      <main className='flex-grow'>
        <section className='py-12 md:py-20 bg-gradient-to-b from-academic-light to-white'>
          <div className='container mx-auto px-4'>
            <div className='text-center max-w-3xl mx-auto mb-12'>
              <h1 className='text-4xl md:text-5xl font-bold text-academic-dark mb-4'>
                Pricing
              </h1>
              <p className='text-lg text-gray-600'>
                Choose the plan that's right for you or your institution
              </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto'>
              {/* Individual Plan */}
              <div className='bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 transition-transform hover:shadow-xl hover:-translate-y-1'>
                <div className='p-6 border-b border-gray-100'>
                  <div className='flex items-center justify-between'>
                    <div>
                      <h3 className='text-xl font-bold mb-1'>Individual</h3>
                      <p className='text-gray-500 flex items-center'>
                        <User className='h-4 w-4 mr-1' /> For academics and
                        researchers
                      </p>
                    </div>
                    <div className='text-right'>
                      <div className='flex items-center'>
                        <Euro></Euro>
                        <span className='text-3xl font-bold'>4.99</span>
                      </div>
                      <span className='text-gray-500'>/month</span>
                    </div>
                  </div>
                </div>

                <div className='p-6'>
                  <ul className='space-y-3 mb-6'>
                    <li className='flex items-start'>
                      <CheckCircle2 className='h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                      <span>Professional CV templates</span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle2 className='h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                      <span>Personal academic website</span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle2 className='h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                      <span>Export to PDF, Word, LaTeX</span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle2 className='h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                      <span>AI-powered CV parsing</span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle2 className='h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                      <span>Custom domain (yourname.vita-academica.com)</span>
                    </li>
                  </ul>
                  {!!currentUser ? (
                    <Button
                      className='w-full flex items-center justify-center'
                      variant='outline'>
                      Your current plan
                    </Button>
                  ) : (
                    <Link to='/signup'>
                      <Button className='w-full bg-academic-orange hover:bg-academic-orange/90 text-white'>
                        Get Started
                      </Button>
                    </Link>
                  )}
                </div>
              </div>

              <div className='bg-white rounded-lg shadow-lg overflow-hidden border border-academic-light transition-transform hover:shadow-xl hover:-translate-y-1'>
                <div className='p-6 border-b border-gray-100 bg-academic-light/20'>
                  <div className='flex items-center justify-betwee'>
                    <div>
                      <h3 className='text-xl font-bold mb-1'>Institution</h3>
                      <p className='text-gray-500 flex items-center'>
                        <Building2 className='h-4 w-4 mr-1' /> For universities
                        and research institutes
                      </p>
                    </div>
                    <div className='text-right'>
                      <span className='text-xl font-bold ml-1'>
                        Custom Pricing
                      </span>
                    </div>
                  </div>
                </div>

                <div className='p-6'>
                  <ul className='space-y-3 mb-6'>
                    <li className='flex items-start'>
                      <CheckCircle2 className='h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                      <span>All individual features</span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle2 className='h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                      <span>Institution branding and templates</span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle2 className='h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                      <span>Bulk account management</span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle2 className='h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                      <span>Custom domain (your-institution.edu)</span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle2 className='h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                      <span>Analytics and department reporting</span>
                    </li>
                    <li className='flex items-start'>
                      <CheckCircle2 className='h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0' />
                      <span>Volume-based discounts</span>
                    </li>
                  </ul>

                  <Button
                    className='w-full flex items-center justify-center'
                    variant='outline'>
                    <Mail className='h-4 w-4 mr-2' /> Contact Sales
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
