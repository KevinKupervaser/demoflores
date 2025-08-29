import React from "react";

interface Props {
  children: React.ReactNode;
}

const Card = ({ children }: Props) => {
  return <div className="relative group">{children}</div>;
};

export default Card;
