"use client";
import React from "react";

const WhatsAppButton = () => {
  const handleClick = () => {
    const phoneNumber = "+543794390681";
    const message = "Hola Maria Eugenia 😀, me gustaria agendar un turno 📅";
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
  };

  return (
    <button
      className="text-[#fff] bg-[#44c4b4] w-full text-base p-2 mt-2 font-semibold"
      onClick={handleClick}
    >
      AGENDAR TURNO AQUI
    </button>
  );
};

export default WhatsAppButton;
