import * as Yup from "yup";
import categories from "./categories";

// Custom validator function for file size (1MB limit)
const fileValidator = (file: File) => {
  if (!file) return true; // Optional field, so it's valid if not provided
  return file.size <= 1024 * 1024;
};

const commonSchema = {
  title: Yup.string().required("Ingresa un Titulo"),
  description: Yup.string().required("Ingresa una Descripción"),
  price: Yup.number().required("ingresa el un precio valido"),
  category: Yup.string()
    .required("Ingresa una Categoria")
    .oneOf(categories, "Categoria no valida"),
  images: Yup.array().of(
    Yup.mixed().test("fileSize", "La imagen debe pesar menos de 1MB", (file) =>
      fileValidator(file as File)
    )
  ),
  stock: Yup.boolean(),
};

// Define the validation schema
export const newProductInfoSchema = Yup.object().shape({
  ...commonSchema,
  thumbnail: Yup.mixed()
    .required("Ingresa una Imagen")
    .test("fileSize", "La imagen debe pesar menos de 1MB", (file) =>
      fileValidator(file as File)
    ),
});

export const updateProductInfoSchema = Yup.object().shape({
  ...commonSchema,
});
