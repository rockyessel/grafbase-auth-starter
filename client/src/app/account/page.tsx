'use client';
import React from 'react';
import axios from 'axios';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { FaGithub, FaGoogle } from 'react-icons/fa';

// Initial form values
const initialFormValue = { email: '', password: '' };

const Account = () => {
  const router = useRouter(); // Initialize the useRouter hook
  const { status } = useSession(); // Retrieve the authentication status using the useSession hook

  // React effect to redirect after authentication status changes
  React.useEffect(() => {
    // Check if the authentication status is 'authenticated'
    if (status === 'authenticated') {
      // Redirect to the homepage when the user is authenticated
      router.push('/');
    }
  }, [router, status]);

  // State to hold form values
  const [form, setForm] =
    React.useState<typeof initialFormValue>(initialFormValue);

  // Handler for form input changes
  const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { target } = event;
    setForm((initialValue) => ({
      ...initialValue,
      [target.name]: target.value,
    }));
  };

  // Handler for form submission
  const handleSubmission = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (form) {
      // Make a POST request to register user
      await axios.post('/api/register', { ...form });

      // Sign in using credentials and bypass redirection
      await signIn('credentials', {
        ...form,
        redirect: false,
      });
    }
  };

  // Component rendering
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-24'>
      <section className='flex flex-col'>
        <div className='flex items-center justify-center'>
          <div className='min-w-fit flex-col border bg-white px-6 py-14 shadow-md rounded-[4px] '>
            <div className='mb-8 flex flex-col items-center justify-center'>
              <Image src='/bloggkie.svg' width={50} height={50} alt='Logo' />
              <p className='font-rathetta'>BloggKie</p>
            </div>
            <form onSubmit={handleSubmission}>
              <fieldset className='flex flex-col text-sm rounded-md'>
                {/* Email input */}
                <input
                  className='mb-5 rounded-[4px] border p-3 hover:outline-none focus:outline-none hover:border-yellow-500 '
                  type='text'
                  placeholder='Username or Email id'
                  value={form.email}
                  onChange={handleFormChange}
                  name='email'
                />
                {/* Password input */}
                <input
                  className='border rounded-[4px] p-3 hover:outline-none focus:outline-none hover:border-yellow-500'
                  type='password'
                  placeholder='Password'
                  value={form.password}
                  onChange={handleFormChange}
                  name='password'
                />
              </fieldset>
              {/* Sign-in button */}
              <button
                className='mt-5 w-full border p-2 bg-gradient-to-r from-gray-800 bg-gray-500 text-white rounded-[4px] hover:bg-slate-400 scale-105 duration-300'
                type='submit'
              >
                Sign in
              </button>
            </form>
            {/* Forgot password and sign-up links */}
            <div className='mt-5 flex justify-between text-sm text-gray-600'>
              <a href='#'>Forgot password?</a>
              <a href='#'>Sign up</a>
            </div>
            {/* Social login options */}
            <div className='flex justify-center mt-5 text-sm'>
              <div className='inline-flex items-center justify-center w-full'>
                <hr className='w-64 h-px my-8 bg-gray-200 border-0 dark:bg-gray-700' />
                <span className='absolute px-3 font-medium -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900'>
                  or
                </span>
              </div>
            </div>
            <div className='mt-2.5 flex justify-center gap-3    '>
              {/* GitHub login */}
              <FaGithub
                onClick={() => signIn('github')}
                className='w-10 h-10 p-1 rounded-md bg-gray-500 text-white text-2xl'
              />
              {/* Google login */}
              <FaGoogle
                onClick={() => signIn('google')}
                className='w-10 h-10 p-1 rounded-md bg-gray-500 text-white text-2xl'
              />
            </div>
            {/* Privacy and terms */}
            <div className='mt-5 flex text-center text-sm text-gray-400'>
              <p>
                This site is protected by reCAPTCHA and the Google <br />
                <a className='underline' href=''>
                  Privacy Policy
                </a>
                and
                <a className='underline' href=''>
                  Terms of Service
                </a>
                apply.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Account;
