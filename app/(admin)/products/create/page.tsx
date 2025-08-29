"use client";
import ProductForm from "@/app/components/ProductForm";
import { NewProductInfo } from "@/app/types";
import { uploadImage } from "@/app/utils/helper";
import {
  newProductInfoSchema,
  updateProductInfoSchema,
} from "@/app/utils/validationSchema";
import React from "react";
import { toast } from "react-toastify";
import { ValidationError } from "yup";
import { createProduct } from "../action";
import { useRouter } from "next/navigation";

const Create = () => {
  const router = useRouter();

  const handleCreateProduct = async (values: NewProductInfo) => {
    const { thumbnail, images } = values;

    try {
      await updateProductInfoSchema.validate(values, { abortEarly: false });
      const thumbnailRes = await uploadImage(values.thumbnail!);

      let productImages: { url: string; id: string }[] = [];
      if (images) {
        const uploadPromise = images.map(async (imageFile) => {
          const { id, url } = await uploadImage(imageFile);
          return { id, url };
        });

        productImages = await Promise.all(uploadPromise);
      }

      await createProduct({
        ...values,
        price: values.price,
        thumbnail: thumbnailRes,
        images: productImages,
        sale: 0,
      });

      router.refresh();
      router.push("/products");
    } catch (error) {
      if (error instanceof ValidationError) {
        const errors = error.inner.map((err) => {
          toast.error(err.message);
        });
      }
    }
  };

  return (
    <div>
      <ProductForm onSubmit={handleCreateProduct} rest={{}} />
    </div>
  );
};

export default Create;
