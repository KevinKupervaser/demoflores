import GridView from "@/app/components/GridView";
import HorizontalMenu from "@/app/components/HorizontalMenu";
import ProductCard from "@/app/components/ProductCard";
import ProductTable from "@/app/components/ProductTable";
import SearchFormHomePage from "@/app/components/SearchFormHomePage";
import startDb from "@/app/lib/db";
import ProductModel from "@/app/models/productModel";
import React from "react";

interface Props {
  searchParams: { query: string };
}

interface Product {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  category: string;
  description: string;
  stock: boolean;
}

const searchProducts = async (query: string) => {
  await startDb();
  const products = await ProductModel.find({
    $or: [{ title: { $regex: query, $options: "i" } }],
  });

  const results = products.map((product) => {
    return {
      id: product._id.toString(),
      title: product.title,
      thumbnail: product.thumbnail.url,
      price: product.price,
      category: product.category,
      description: product.description,
      stock: product.stock,
    };
  });

  return JSON.stringify(results);
};

const AdminSearch = async ({ searchParams }: Props) => {
  const { query } = searchParams;
  const results = JSON.parse(await searchProducts(query));

  const products = Object.values(results);
//   console.log(results);

  return (
    <div>
      <div className="py-4 space-y-4 overflow-x-hidden">
        <HorizontalMenu />
        <SearchFormHomePage rest={{}} />
        <GridView>
          {products.map((product) => {
            return <ProductCard key={product.id} product={product} rest={{}} />;
          })}
        </GridView>
      </div>
    </div>
  );
};

export default AdminSearch;
