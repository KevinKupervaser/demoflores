// app/page.tsx
import GridView from "@/app/components/GridView";
import ProductCard from "@/app/components/ProductCard";
import startDb from "@/app/lib/db";
import ProductModel from "@/app/models/productModel";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CircleLoader } from "react-spinners";
import SearchFormHomePage from "../components/SearchFormHomePage";
import FilterableProductGrid from "../components/FilterableProductGrid";

export const dynamic = "force-dynamic";

interface LatestProduct {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  price: number;
  sale: number;
  description: string;
  stock: boolean;
}

const fetchLatestProducts = async () => {
  try {
    await startDb();
    const products = await ProductModel.find()
      .sort({ title: 1 })
      .maxTimeMS(30000);

    if (!products || products.length === 0) {
      return redirect("/404");
    }

    const productList = products.map((product) => {
      const thumbnailUrl =
        product.thumbnail && product.thumbnail.url ? product.thumbnail.url : "";

      return {
        id: product._id.toString(),
        title: product.title,
        description: product.description,
        category: product.category,
        thumbnail: thumbnailUrl,
        price: product.price,
        sale: product.sale,
        stock: product.stock,
      };
    });

    return JSON.stringify(productList);
  } catch (error) {
    return JSON.stringify({ error: "Failed to fetch latest products" });
  }
};

export default async function Shop() {
  const latestProducts = await fetchLatestProducts();
  const parsedProducts = JSON.parse(latestProducts) as LatestProduct[];
  const products = Object.values(parsedProducts);

  return (
    <>
      <Suspense
        fallback={
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="text-center">
              <CircleLoader color="#38513E" size={60} />
              <p className="mt-4 text-[#576D56]">Cargando productos...</p>
            </div>
          </div>
        }
      >
        <div className="min-h-screen bg-gradient-to-b from-white to-[#F3D1AC]/5">

          {/* Filterable Product Grid with integrated HorizontalMenu */}
          <FilterableProductGrid products={products} />
        </div>
      </Suspense>
    </>
  );
}
