import React from "react";

interface Props {
  children: React.ReactNode;
}

const ProductLayout = async ({ children }: Props) => {
  return <div>{children}</div>;
};

export default ProductLayout;
