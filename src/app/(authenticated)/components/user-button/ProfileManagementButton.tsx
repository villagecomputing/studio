'use client';
import { isAuthEnabled } from '@/lib/utils';
import { UserButton, useUser } from '@clerk/nextjs';
import ApiManagement from '../../apiManagement/page';

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
  const { user } = useUser();

  if (!isAuthEnabled() || !user?.id) {
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
        <ApiManagement
          params={{
            userId: user.id,
          }}
        />
      </UserButton.UserProfilePage>
    </UserButton>
  );
};
export default ProfileManagementButton;
