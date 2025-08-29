import GridView from "@/app/components/GridView";
import HorizontalMenu from "@/app/components/HorizontalMenu";
import MasonryGridGallery from "@/app/components/MasonryGridGallery";
import ProductCard from "@/app/components/ProductCard";
// import ProductList from "@/app/components/ProductList";
import startDb from "@/app/lib/db";
import ProductModel from "@/app/models/productModel";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { CircleLoader } from "react-spinners";

// deployment
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

const fetchLatestProductsByCategory = async (category: string) => {
  try {
    await startDb();
    const products = await ProductModel.find({ category })
      .sort("-createdAt")
      .limit(20)
      .maxTimeMS(30000);

    if (!products || products.length === 0) {
      // If no products found, redirect to 404 page
      return redirect("/404");
    }

    const productList = products.map((product) => {
      // Check if product.thumbnail exists and has a url property
      const thumbnailUrl =
        product.thumbnail && product.thumbnail.url ? product.thumbnail.url : "";

      return {
        id: product._id.toString(),
        title: product.title,
        description: product.description,
        category: product.category,
        thumbnail: thumbnailUrl, // Assign thumbnailUrl or an empty string if thumbnail is not available
        price: product.price,
        sale: product.sale,
        stock: product.stock,
      };
    });

    return JSON.stringify(productList);
  } catch (error) {
    // Handle the error gracefully, for example, returning an error message
    return JSON.stringify({ error: "Failed to fetch latest products" });
  }
};

interface Props {
  params: {
    category: string;
  };
}

export default async function ProductByCategory({ params }: Props) {
  const productsCategory = await fetchLatestProductsByCategory(
    decodeURIComponent(params.category)
  );
  const parsedProducts = JSON.parse(productsCategory) as LatestProduct[];

  const products = Object.values(parsedProducts);

  return (
    <Suspense
      fallback={
        <div className="flex justify-center">
          <CircleLoader color="#36d7b7" />
        </div>
      }
    >
      <div className="space-y-4 pt-[8rem]">
        <HorizontalMenu />
        {parsedProducts.length ? (
          <GridView>
            {products.map((product) => {
              return (
                <ProductCard key={product.id} product={product} rest={{}} />
              );
            })}
          </GridView>
        ) : (
          <h3 className="text-center text-xl font-bold uppercase opacity-30">
            No hay productos en esta categoria
          </h3>
        )}
      </div>
    </Suspense>
  );
}
