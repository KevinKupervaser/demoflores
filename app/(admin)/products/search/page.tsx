import ProductTable from "@/app/components/ProductTable";
import startDb from "@/app/lib/db";
import ProductModel from "@/app/models/productModel";
import React from "react";

interface Props {
  searchParams: { query: string };
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

  return (
    <div>
      <ProductTable
        products={results}
        showPageNavigator={false}
        currentPageNo={0}
        rest={{}}
      />
    </div>
  );
};

export default AdminSearch;
