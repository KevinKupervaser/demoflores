import { authOptions } from "@/config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import Navbar from "../components/Navbar";

interface Props {
  children: React.ReactNode;
}

const GuestLayout = async ({ children }: Props) => {
  const session = await getServerSession(authOptions);

  if (session) return redirect("/");

  return <div>{children}</div>;
};

export default GuestLayout;
