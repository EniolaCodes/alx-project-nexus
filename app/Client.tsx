"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import { Toaster } from "react-hot-toast";

export default function Client({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const hideNavbar =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/preview";

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}
