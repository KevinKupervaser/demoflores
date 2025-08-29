"use client";
import React from "react";

const Footer = () => {
  const handleClick = () => {
    const message = "Hola Innova! Quiero crear mi aplicación web con ustedes";
    const whatsappUrl = `https://wa.me/543794390681?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <footer className="text-[#fff] bg-[#44c4b4] p-4 text-center">
      <p className="text-sm">
        Copyright © 2024 EspacioSaludable | Creado por{" "}
        <span className="cursor-pointer underline" onClick={handleClick}>
          Inoova© servicios digitales
        </span>
      </p>
    </footer>
  );
};

export default Footer;
