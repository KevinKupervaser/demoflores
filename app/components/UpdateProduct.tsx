"use client";
import React from "react";
import ProductForm, { InitialValue } from "./ProductForm";
import { NewProductInfo, ProductResponse, ProductToUpdate } from "../types";
import {
  removeAndUpdateProductImage,
  removeImageFromCloud,
  updateProduct,
} from "../(admin)/products/action";
import { updateProductInfoSchema } from "../utils/validationSchema";
import { useRouter } from "next/navigation";
import { uploadImage } from "../utils/helper";
import { ValidationError } from "yup";
import { toast } from "react-toastify";

interface Props {
  product: ProductResponse;
}

const UpdateProduct = ({ product }: Props) => {
  const router = useRouter();

  const initialValue: InitialValue = {
    ...product,
    thumbnail: product.thumbnail.url,
    images: product.images?.map(({ url }) => url),
    price: product.price,
  };

  const handleImageRemove = (source: string) => {
    const splittedData = source.split("/");
    const lastItem = splittedData[splittedData.length - 1];

    const publicId = lastItem.split(".")[0];
    removeAndUpdateProductImage(product.id, publicId);
  };

  const handleOnSubmit = async (values: NewProductInfo) => {
    try {
      const { thumbnail, images } = values;
      await updateProductInfoSchema.validate(values, { abortEarly: false });

      const dataToUpdate: ProductToUpdate = {
        title: values.title,
        category: values.category,
        price: values.price,
        description: values.description,
        stock: values.stock,
      };

      if (thumbnail) {
        // dummy products comment first line
        await removeImageFromCloud(product.thumbnail.id);
        const { id, url } = await uploadImage(thumbnail);
        dataToUpdate.thumbnail = { id, url };
      }

      if (images.length) {
        const uploadPromise = images.map(async (imgFile) => {
          return await uploadImage(imgFile);
        });
        dataToUpdate.images = await Promise.all(uploadPromise);
      }

      // update our product
      await updateProduct(product.id, dataToUpdate);
      router.refresh();
      router.push("/products");
    } catch (error) {
      if (error instanceof ValidationError) {
        error.inner.map((err) => {
          toast.error(err.message);
        });
      }
    }
  };

  return (
    <ProductForm
      initialValue={initialValue}
      onImageRemove={handleImageRemove}
      onSubmit={handleOnSubmit}
      rest={{}}
    />
  );
};

export default UpdateProduct;
