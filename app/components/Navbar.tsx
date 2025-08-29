"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import SignOutButton from "./SignOutButton";
import ShoppingCart from "./ShoppingCart";
import Image from "next/image";
import floreriaGardenias from "../../public/floreria-gardenias.jpg";

const Navbar = () => {
  const { loggedIn } = useAuth();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY > lastScrollY) {
        // if scrolling down, hide navbar
        setShowNavbar(false);
      } else {
        // if scrolling up, show navbar
        setShowNavbar(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
  }, [lastScrollY]);

  return (
    <>
      <div
        className={`${
          showNavbar ? "top-0" : "-top-full"
        } transition-all duration-300 ease-in-out fixed w-full z-50`}
      >
        {/* <div className="hidden md:block w-full">
          <div className="flex w-full justify-end items-center gap-5 pr-10 text-xs">
            {loggedIn ? (
              <div>
                <Link href={"/products"}>Productos</Link>
              </div>
            ) : (
              <div>
                <Link href={"/auth/signin"}>Ingresar</Link>
              </div>
            )}
            {loggedIn && (
              <SignOutButton>
                <div className="cursor-pointer">Logout</div>
              </SignOutButton>
            )}
          </div>
        </div> */}

        <div className="flex w-full justify-between items-center shadow-sm p-4 bg-white">
          <div className="text-4xl font-extralight">
            <Link href={"/"}>
              <Image
                src={floreriaGardenias}
                alt="logo"
                width={60}
                height={60}
                className="rounded-full"
              />
            </Link>
          </div>
          <ShoppingCart />
        </div>
      </div>
    </>
  );
};

export default Navbar;
