'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { UserProps } from '@/interface';
import { signOut, useSession } from 'next-auth/react';

const User = () => {
  const userDropdownRef = React.useRef<HTMLDivElement | null>(null);
  const [showUserDropdown, setShowUserDropdown] = React.useState(false);
  const { data: session, status } = useSession();
  const user = { ...session?.user } as UserProps;
  const toggleUserDropdown = () => {
    setShowUserDropdown(!showUserDropdown);
  };

  React.useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (
        showUserDropdown &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('click', handleOutsideClick);
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

            <Image
              src={user?.image}
              width={50}
              height={50}
              className='w-full h-full object-cover object-center  rounded-full'
              alt={user?.name}
              priority
            />
          </button>
          {showUserDropdown && (
            <div
              ref={userDropdownRef}
              className='absolute top-[3.6rem] left-12 right-0 mt-3 mr-2 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow'
            >
              <div className='py-3 px-4 text-gray-500'>
                <span className='block text-sm font-semibold'>
                  {user?.name}
                </span>
                <span className='block text-sm font-light truncate '>
                  {user?.email}
                </span>
              </div>
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
            <Image
              src={'/avator.png'}
              width={50}
              height={50}
              className='w-full h-full object-cover object-center rounded-full'
              alt={'Avator'}
              priority
            />
          </button>
          {showUserDropdown && (
            <div
              ref={userDropdownRef}
              className='absolute top-[3.6rem] left-12 right-0 mt-3 mr-2 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow'
            >
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

export default User;
