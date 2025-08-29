import React from "react";

interface Props {
  children: React.ReactNode;
}

const AuthLayout = async ({ children }: Props) => {
  return (
    <div className="h-screen flex items-center justify-center">{children}</div>
  );
};

export default AuthLayout;
