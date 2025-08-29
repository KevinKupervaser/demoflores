import { signOut } from "next-auth/react";
import React from "react";

interface Props {
  children: React.ReactNode;
}

const SignOutButton = ({ children }: Props) => {
  return (
    <div
      onClick={async () => {
        await signOut();
      }}
    >
      {children}
    </div>
  );
};

export default SignOutButton;
