'use client';
import { cn, isAuthEnabled } from '@/lib/utils';
import { UserButton, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import fetchApiKeyByExternalUserId from './actions';

const DotIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
    >
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  );
};

const ProfileManagementButton = () => {
  const { user: clerkUser } = useUser();
  const [apiKey, setApiKey] = useState<string | undefined>();

  useEffect(() => {
    if (!clerkUser?.id || !isAuthEnabled()) {
      return;
    }

    (async () => {
      const key = await fetchApiKeyByExternalUserId(clerkUser.id);
      setApiKey(key?.api_key);
    })();
  }, [clerkUser?.id]);

  if (!isAuthEnabled()) {
    return <></>;
  }

  return (
    <UserButton afterSignOutUrl="/">
      <UserButton.UserProfilePage label="account" />
      <UserButton.UserProfilePage label="security" />
      <UserButton.UserProfilePage
        label="API Management"
        url="apiManagement"
        labelIcon={<DotIcon />}
      >
        <div>
          <h1 className={cn(['mb-4 text-4xl'])}>API Management</h1>
          <p className={cn(['text-gray-800 my-4 text-base'])}>
            API key: {apiKey}
          </p>
        </div>
      </UserButton.UserProfilePage>
    </UserButton>
  );
};
export default ProfileManagementButton;
