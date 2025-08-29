"use client";
import React from "react";
import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BannerCarousel = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  const banners = [
    {
      id: 1,
      imgUrl: "/1.jpeg",
    },
    {
      id: 2,
      imgUrl: "/2.jpeg",
    },
    {
      id: 3,
      imgUrl: "/3.jpeg",
    },
  ];

  return (
    <div className="pt-[6rem]">
      <Slider {...settings}>
        {banners.map((banner) => (
          <div key={banner.id}>
            <div className="flex justify-center items-center">
              <Image
                src={banner.imgUrl}
                alt={`Banner ${banner.id}`}
                width={1920}
                height={1080}
                className="w-full h-full md:w-[25%] md:h-[25%] object-cover"
                priority={true}
              />
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerCarousel;
