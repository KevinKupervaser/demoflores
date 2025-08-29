"use server";

import startDb from "@/app/lib/db";
import ProductModel, { ProductDocument } from "@/app/models/productModel";
import { ProductToUpdate } from "@/app/types";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  secure: true,
});

export const getCloudConfig = async () => {
  return {
    key: process.env.CLOUD_API_KEY!,
    name: process.env.CLOUD_NAME!,
  };
};

// generate our cloud signature
export const getCloudSignature = async () => {
  const secret = cloudinary.config().api_secret!;
  const timestamp = Math.round(new Date().getTime() / 1000);
  const signature = cloudinary.utils.api_sign_request({ timestamp }, secret);

  return { timestamp, signature };
};

export const createProduct = async (info: ProductDocument) => {
  try {
    await startDb();
    await ProductModel.create({ ...info });
  } catch (error) {
    console.log((error as any).message);
    throw new Error("Something went wrong, can not create product!");
  }
};

export const removeImageFromCloud = async (publicId: string) => {
  await cloudinary.uploader.destroy(publicId);
};

export const removeAndUpdateProductImage = async (
  id: string,
  publicId: string
) => {
  try {
    const { result } = await cloudinary.uploader.destroy(publicId);

    if (result === "ok") {
      await startDb();
      await ProductModel.findByIdAndUpdate(id, {
        $pull: { images: { id: publicId } },
      });
    }
  } catch (error) {
    console.log(
      "Error while removing image from cloud: ",
      (error as any).message
    );
    throw error;
  }
};

export const updateProduct = async (
  id: string,
  productInfo: ProductToUpdate
) => {
  try {
    await startDb();
    let images: typeof productInfo.images = [];
    if (productInfo.images) {
      images = productInfo.images;
    }

    delete productInfo.images;
    await ProductModel.findByIdAndUpdate(id, {
      ...productInfo,
      $push: { images },
    });
  } catch (error) {
    console.log("Error while updating product, ", (error as any).message);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid product ID");
  }

  await startDb();
  const product = await ProductModel.findById(id);

  if (product) {
    // Remove the thumbnail image from Cloudinary
    await cloudinary.uploader.destroy(product.thumbnail.id);

    // Remove all other images from Cloudinary
    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        await cloudinary.uploader.destroy(image.id);
      }
    }

    // Delete the product from the database
    await ProductModel.findByIdAndDelete(id);
  }
};
