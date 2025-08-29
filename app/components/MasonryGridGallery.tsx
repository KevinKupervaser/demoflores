"use client";
import React from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

interface Props {
  children: React.ReactNode;
}

export default function MasonryGridGallery({ children }: Props) {
  return (
    <div>
      <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 750: 2, 900: 3 }}>
        <Masonry columnsCount={3} gutter="10px">
          {children}
        </Masonry>
      </ResponsiveMasonry>
    </div>
  );
}
