"use client";
import React, {
  useEffect,
  useState,
  useTransition,
  ChangeEventHandler,
} from "react";
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline";
import categories from "@/app/utils/categories";
import ImageSelector from "@/app/components/ImageSelector";
import { NewProductInfo } from "../types";

interface Props {
  initialValue?: InitialValue;
  onSubmit(values: NewProductInfo): void;
  onImageRemove?(source: string): void;
  rest?: any;
}

export interface InitialValue {
  id: string;
  title: string;
  thumbnail: string;
  images?: string[];
  price: number;
  category: string;
  description: string;
  stock: boolean;
}

const defaultValue = {
  title: "",
  price: 0,
  category: "",
  description: "",
  stock: true,
};

export default function ProductForm(props: Props) {
  const { onSubmit, onImageRemove, initialValue } = props;
  const [isPending, startTransition] = useTransition();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [thumbnail, setThumbnail] = useState<File>();
  const [isForUpdate, setIsForUpdate] = useState(false);
  const [productInfo, setProductInfo] = useState({ ...defaultValue });
  const [thumbnailSource, setThumbnailSource] = useState<string[]>();
  const [productImagesSource, setProductImagesSource] = useState<string[]>();

  // UI state
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [stockDropdownOpen, setStockDropdownOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const removeImage = async (index: number) => {
    if (!productImagesSource) return;

    const imageToRemove = productImagesSource[index];
    const cloudSourceUrl = "https://res.cloudinary.com";
    if (imageToRemove.startsWith(cloudSourceUrl)) {
      onImageRemove && onImageRemove(imageToRemove);
    } else {
      const fileIndexDifference =
        productImagesSource.length - imageFiles.length;
      const indexToRemove = index - fileIndexDifference;
      const newImageFiles = imageFiles.filter((_, i) => i !== indexToRemove);
      setImageFiles([...newImageFiles]);
    }

    const newImagesSource = productImagesSource.filter((_, i) => i !== index);
    setProductImagesSource([...newImagesSource]);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!productInfo.title.trim()) {
      newErrors.title = "El título es requerido";
    }
    if (!productInfo.description.trim()) {
      newErrors.description = "La descripción es requerida";
    }
    if (!productInfo.category) {
      newErrors.category = "La categoría es requerida";
    }
    if (productInfo.price <= 0) {
      newErrors.price = "El precio debe ser mayor a 0";
    }
    if (!thumbnail && !thumbnailSource?.length) {
      newErrors.thumbnail = "La imagen de portada es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getBtnTitle = () => {
    if (isForUpdate)
      return isPending ? "Actualizando..." : "Actualizar Producto";
    return isPending ? "Creando..." : "Crear Producto";
  };

  useEffect(() => {
    if (initialValue) {
      setProductInfo({ ...initialValue });
      setThumbnailSource([initialValue.thumbnail]);
      setProductImagesSource(initialValue.images);
      setIsForUpdate(true);
    }
  }, [initialValue]);

  const onImagesChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const files = target.files;
    if (files) {
      const newImages = Array.from(files).map((item) => item);
      const oldImages = productImagesSource || [];
      setImageFiles([...imageFiles, ...newImages]);
      setProductImagesSource([
        ...oldImages,
        ...newImages.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const onThumbnailChange: ChangeEventHandler<HTMLInputElement> = ({
    target,
  }) => {
    const files = target.files;
    if (files) {
      const file = files[0];
      setThumbnail(file);
      setThumbnailSource([URL.createObjectURL(file)]);
      // Clear thumbnail error when image is selected
      if (errors.thumbnail) {
        setErrors((prev) => ({ ...prev, thumbnail: "" }));
      }
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      startTransition(async () => {
        await onSubmit({
          ...productInfo,
          description: productInfo.description,
          images: imageFiles,
          thumbnail,
        });
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isForUpdate ? "Actualizar Producto" : "Añadir Nuevo Producto"}
          </h1>
          <p className="text-gray-600">
            {isForUpdate
              ? "Modifica la información del producto"
              : "Completa todos los campos para crear un nuevo producto"}
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="divide-y divide-gray-200"
          >
            {/* Image Sections */}
            <div className="p-6 sm:p-8 space-y-8">
              {/* Thumbnail Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Imagen de Portada
                  </h3>
                  <span className="text-sm text-gray-500">Requerida</span>
                </div>
                <ImageSelector
                  id="thumb"
                  images={thumbnailSource}
                  onChange={onThumbnailChange}
                />
                {errors.thumbnail && (
                  <p className="text-sm text-red-600 flex items-center">
                    <XMarkIcon className="w-4 h-4 mr-1" />
                    {errors.thumbnail}
                  </p>
                )}
              </div>

              {/* Product Images Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Imágenes del Producto
                  </h3>
                  <span className="text-sm text-gray-500">Opcional</span>
                </div>
                <ImageSelector
                  multiple
                  id="images"
                  images={productImagesSource}
                  onRemove={removeImage}
                  onChange={onImagesChange}
                />
              </div>
            </div>

            {/* Product Information */}
            <div className="p-6 sm:p-8 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Información del Producto
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Title Input */}
                <div className="lg:col-span-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Título del Producto *
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={productInfo.title}
                    onChange={({ target }) => {
                      setProductInfo({ ...productInfo, title: target.value });
                      if (errors.title)
                        setErrors((prev) => ({ ...prev, title: "" }));
                    }}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-gray-900 placeholder:text-gray-400 
                              focus:outline-none focus:ring-0 transition-all duration-200 
                              ${
                                errors.title
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                              }`}
                    placeholder="Ingresa el nombre del producto"
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <XMarkIcon className="w-4 h-4 mr-1" />
                      {errors.title}
                    </p>
                  )}
                </div>

                {/* Description Input */}
                <div className="lg:col-span-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Descripción *
                  </label>
                  <textarea
                    id="description"
                    rows={4}
                    value={productInfo.description}
                    onChange={({ target }) => {
                      setProductInfo({
                        ...productInfo,
                        description: target.value,
                      });
                      if (errors.description)
                        setErrors((prev) => ({ ...prev, description: "" }));
                    }}
                    className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-gray-900 placeholder:text-gray-400 
                              focus:outline-none focus:ring-0 transition-all duration-200 resize-none
                              ${
                                errors.description
                                  ? "border-red-300 focus:border-red-500"
                                  : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                              }`}
                    placeholder="Describe las características y detalles del producto"
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <XMarkIcon className="w-4 h-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Category Dropdown */}
                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Categoría *
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() =>
                        setCategoryDropdownOpen(!categoryDropdownOpen)
                      }
                      className={`w-full px-4 py-3 bg-white border-2 rounded-xl text-left 
                                focus:outline-none focus:ring-0 transition-all duration-200 flex items-center justify-between
                                ${
                                  errors.category
                                    ? "border-red-300 focus:border-red-500"
                                    : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                                }`}
                    >
                      <span
                        className={
                          productInfo.category
                            ? "text-gray-900"
                            : "text-gray-400"
                        }
                      >
                        {productInfo.category || "Selecciona una categoría"}
                      </span>
                      <ChevronDownIcon
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 
                                                  ${
                                                    categoryDropdownOpen
                                                      ? "rotate-180"
                                                      : ""
                                                  }`}
                      />
                    </button>

                    {categoryDropdownOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                        {categories.map((category, index) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => {
                              setProductInfo({ ...productInfo, category });
                              setCategoryDropdownOpen(false);
                              if (errors.category)
                                setErrors((prev) => ({
                                  ...prev,
                                  category: "",
                                }));
                            }}
                            className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150
                                      ${index === 0 ? "rounded-t-xl" : ""} 
                                      ${
                                        index === categories.length - 1
                                          ? "rounded-b-xl"
                                          : ""
                                      }
                                      ${
                                        productInfo.category === category
                                          ? "bg-blue-50 text-blue-700"
                                          : "text-gray-900"
                                      }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {errors.category && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <XMarkIcon className="w-4 h-4 mr-1" />
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Price Input */}
                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Precio *
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      id="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={productInfo.price || ""}
                      onChange={({ target }) => {
                        const price = parseFloat(target.value) || 0;
                        setProductInfo({ ...productInfo, price });
                        if (errors.price)
                          setErrors((prev) => ({ ...prev, price: "" }));
                      }}
                      className={`w-full pl-8 pr-4 py-3 bg-white border-2 rounded-xl text-gray-900 placeholder:text-gray-400 
                                focus:outline-none focus:ring-0 transition-all duration-200 
                                ${
                                  errors.price
                                    ? "border-red-300 focus:border-red-500"
                                    : "border-gray-200 focus:border-blue-500 hover:border-gray-300"
                                }`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <XMarkIcon className="w-4 h-4 mr-1" />
                      {errors.price}
                    </p>
                  )}
                </div>

                {/* Stock Dropdown */}
                <div className="lg:col-span-2">
                  <label
                    htmlFor="stock"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Estado del Stock
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setStockDropdownOpen(!stockDropdownOpen)}
                      className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-left 
                               focus:outline-none focus:ring-0 focus:border-blue-500 hover:border-gray-300 
                               transition-all duration-200 flex items-center justify-between"
                    >
                      <span className="text-gray-900">
                        {productInfo.stock ? "En stock" : "Sin stock"}
                      </span>
                      <ChevronDownIcon
                        className={`w-5 h-5 text-gray-400 transition-transform duration-200 
                                                  ${
                                                    stockDropdownOpen
                                                      ? "rotate-180"
                                                      : ""
                                                  }`}
                      />
                    </button>

                    {stockDropdownOpen && (
                      <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg">
                        <button
                          type="button"
                          onClick={() => {
                            setProductInfo({ ...productInfo, stock: true });
                            setStockDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 rounded-t-xl
                                    ${
                                      productInfo.stock
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-900"
                                    }`}
                        >
                          En stock
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setProductInfo({ ...productInfo, stock: false });
                            setStockDropdownOpen(false);
                          }}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 rounded-b-xl
                                    ${
                                      !productInfo.stock
                                        ? "bg-blue-50 text-blue-700"
                                        : "text-gray-900"
                                    }`}
                        >
                          Sin stock
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="px-6 py-6 sm:px-8 bg-gray-50 flex flex-col sm:flex-row sm:justify-end sm:space-x-4 space-y-3 sm:space-y-0">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="w-full sm:w-auto px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 
                         font-medium hover:bg-gray-50 hover:border-gray-400 focus:outline-none 
                         focus:ring-4 focus:ring-gray-200 transition-all duration-200"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isPending}
                className={`w-full sm:w-auto px-8 py-3 rounded-xl font-semibold transition-all duration-200 
                          transform focus:outline-none focus:ring-4 focus:ring-blue-600/20
                          ${
                            isPending
                              ? "bg-blue-400 cursor-not-allowed text-white"
                              : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5"
                          }`}
              >
                {getBtnTitle()}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Click outside handlers */}
      {(categoryDropdownOpen || stockDropdownOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setCategoryDropdownOpen(false);
            setStockDropdownOpen(false);
          }}
        />
      )}
    </div>
  );
}
