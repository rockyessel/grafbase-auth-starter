'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserProps } from '@/interface'; // Import UserProps interface
import { signOut, useSession } from 'next-auth/react'; // Import signOut and useSession functions

// Define the User component
const User = () => {
  // Create a ref for the user dropdown
  const userDropdownRef = React.useRef<HTMLDivElement | null>(null);
  // State to track whether user dropdown should be shown
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);
  // Get user session data and status using useSession hook
  const { data: session, status } = useSession();
  // Extract user information from the session
  const user = { ...session?.user } as UserProps;
  // Toggle user dropdown visibility
  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  // Effect to handle clicks outside the user dropdown
  React.useEffect(() => {
    const handleOutsideClick = (event: any) => {
      // If dropdown is shown and click is outside dropdown, hide it
      if (
        showUserDropdown &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };
    // Add click event listener for outside clicks
    document.addEventListener('click', handleOutsideClick);
    // Clean up the event listener when component unmounts
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [showUserDropdown]);

  return (
    <>
      {status === 'authenticated' ? (
        <div className='relative'>
          <button
            onClick={toggleUserDropdown}
            type='button'
            className='z-20 rounded-full flex mx-3 text-sm bg-gray-800  md:mr-0 focus:ring-4 focus:ring-gray-300'
          >
            <span className='sr-only'>Open user menu</span>

            {/* Display user image */}
            {user.image ? (
              <Image
                src={user.image}
                width={50}
                height={50}
                className='w-full h-full object-cover object-center  rounded-full'
                alt={user.name}
                priority
              />
            ) : (
              <Image
                src={'/248387.jpg'}
                width={50}
                height={50}
                className='w-12 h-12 object-cover object-center rounded-full'
                alt={'248387'}
                priority
              />
            )}
          </button>
          {/* Show user dropdown if enabled */}
          {showUserDropdown && (
            <div
              ref={userDropdownRef}
              className='absolute top-[3.6rem] left-12 right-0 mt-3 mr-2 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow'
            >
              {/* Display user name and email */}
              <div className='py-3 px-4 text-gray-500'>
                <span className='block text-sm font-semibold'>
                  {user?.name}
                </span>
                <span className='block text-sm font-light truncate '>
                  {user?.email}
                </span>
              </div>
              {/* Display sign out option */}
              <ul className='py-1 font-light text-gray-500 cursor-pointer'>
                <li
                  onClick={() => signOut()}
                  className='block py-2 px-4 text-sm'
                >
                  Sign out
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <div className='relative'>
          <button
            onClick={toggleUserDropdown}
            type='button'
            className='z-20 rounded-full border-2 border-black flex mx-3 text-sm bg-gray-800  md:mr-0 focus:ring-4 focus:ring-gray-300'
          >
            <span className='sr-only'>Open user menu</span>
            {/* Display default avatar */}
            <Image
              src={'/avator.png'}
              width={50}
              height={50}
              className='w-full h-full object-cover object-center rounded-full'
              alt={'Avator'}
              priority
            />
          </button>
          {/* Show user dropdown if enabled */}
          {showUserDropdown && (
            <div
              ref={userDropdownRef}
              className='absolute top-[3.6rem] left-12 right-0 mt-3 mr-2 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow'
            >
              {/* Display link to authentication */}
              <ul className='py-1 font-light text-gray-500 cursor-pointer'>
                <li className='block py-2 px-4 text-sm'>
                  <Link href={`/account`}>Authenticate</Link>
                </li>
              </ul>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default User; // Export the User component
