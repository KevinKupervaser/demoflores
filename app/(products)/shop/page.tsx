// import GridView from "@/app/components/GridView";
// import MasonryGridGallery from "@/app/components/MasonryGridGallery";
// import ProductCard from "@/app/components/ProductCard";
// // import ProductList from "@/app/components/ProductList";
// import startDb from "@/app/lib/db";
// import ProductModel from "@/app/models/productModel";
// import { redirect } from "next/navigation";
// import { Suspense } from "react";
// import { CircleLoader } from "react-spinners";

// // deployment
// export const dynamic = "force-dynamic";

// interface LatestProduct {
//   id: string;
//   title: string;
//   sizes: number;
//   category: string;
//   thumbnail: string;
//   price: number;
//   sale: number;
// }

// const fetchLatestProducts = async () => {
//   try {
//     await startDb();
//     const products = await ProductModel.find()
//       // .sort("-createdAt")
//       .limit(20)
//       .maxTimeMS(30000);

//     if (!products || products.length === 0) {
//       // If no products found, redirect to 404 page
//       return redirect("/404");
//     }

//     const productList = products.map((product) => {
//       // Check if product.thumbnail exists and has a url property
//       const thumbnailUrl =
//         product.thumbnail && product.thumbnail.url ? product.thumbnail.url : "";

//       return {
//         id: product._id.toString(),
//         title: product.title,
//         sizes: product.sizes,
//         category: product.category,
//         thumbnail: thumbnailUrl, // Assign thumbnailUrl or an empty string if thumbnail is not available
//         price: product.price,
//         sale: product.sale,
//       };
//     });

//     return JSON.stringify(productList);
//   } catch (error) {
//     // Handle the error gracefully, for example, returning an error message
//     return JSON.stringify({ error: "Failed to fetch latest products" });
//   }
// };

// export default async function Shop() {
//   const latestProducts = await fetchLatestProducts();
//   const parsedProducts = JSON.parse(latestProducts) as LatestProduct[];

//   const products = Object.values(parsedProducts);

//   return (
//     <Suspense
//       fallback={
//         <div className="flex justify-center">
//           <CircleLoader color="#36d7b7" />
//         </div>
//       }
//     >
//       <div className="py-4 space-y-4">
//         <GridView>
//           {products.map((product) => {
//             return <ProductCard key={product.id} product={product} rest={{}} />;
//           })}
//         </GridView>
//       </div>
//     </Suspense>
//   );
// }

import React from 'react'

const pageShop = () => {
  return (
    <div>Shop</div>
  )
}

export default pageShop