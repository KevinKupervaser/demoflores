import { authOptions } from "@/config";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
// import AdminSidebar from "@components/AdminSidebar";

interface Props {
  children: React.ReactNode;
}

// comment

const AdminLayout = async ({ children }: Props) => {
  const session = await getServerSession(authOptions);

  const user = session?.user;
  const isAdmin = user?.role === "admin";

  if (!isAdmin) return redirect("/auth/signin");

  return <div className="max-w-[1000px] mx-auto">{children}</div>;
};

export default AdminLayout;
