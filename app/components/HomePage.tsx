"use client";
import React from "react";
import VinicolaLogo from "/public/vinicola_logo.jpg";
import Image from "next/image";

const HomePage = () => {
  return (
    <div className="flex h-screen justify-center items-center">
      {/* <div className="w-auto h-auto">
        <Image
          src={VinicolaLogo}
          width={300}
          height={300}
          alt="logo"
          priority={true}
          className="w-auto h-auto rounded-full"
        />
      </div> */}
    </div>
  );
};

export default HomePage;
