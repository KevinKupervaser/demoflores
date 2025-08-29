// Updated GridView.tsx
import React, { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const GridView = ({ children }: Props) => {
  return (
    <div className="w-full px-4 py-6">
      {/* Mobile: 1 column for better product visibility */}
      {/* Tablet: 2 columns */}
      {/* Desktop: 3 columns */}
      {/* Large screens: 4 columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 place-items-center max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default GridView;
