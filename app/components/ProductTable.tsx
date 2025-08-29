"use client";
import { PencilIcon } from "@heroicons/react/24/solid";
import {
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback, useMemo } from "react";
import { deleteProduct } from "../(admin)/products/action";
import truncate from "truncate";

export interface Product {
  id: string;
  title: string;
  thumbnail: string;
  price: number;
  category: string;
  stock: boolean;
}

interface Props {
  products: Product[];
  currentPageNo: number;
  hasMore?: boolean;
  showPageNavigator?: boolean;
  rest?: any;
}

// Utility function for consistent price formatting
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

// Debounce hook for search optimization
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function ProductTable(props: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const {
    products = [],
    currentPageNo,
    hasMore,
    showPageNavigator = true,
  } = props;

  // Search state
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );
  const [isFocused, setIsFocused] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Modal state
  const [open, setOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(
    null
  );

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return products;

    const query = debouncedSearchQuery.toLowerCase();
    return products.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
    );
  }, [products, debouncedSearchQuery]);

  // Handle search with URL updates
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchQuery(value);
      setIsSearching(true);
    },
    []
  );

  // Update URL when search query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (debouncedSearchQuery !== searchParams.get("query")) {
        const params = new URLSearchParams(searchParams);
        if (debouncedSearchQuery.trim()) {
          params.set("query", debouncedSearchQuery.trim());
          params.delete("page"); // Reset to first page when searching
        } else {
          params.delete("query");
        }
        router.push(`/products?${params.toString()}`, { scroll: false });
      }
      setIsSearching(false);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [debouncedSearchQuery, router, searchParams]);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
    const params = new URLSearchParams(searchParams);
    params.delete("query");
    params.delete("page");
    router.push(`/products?${params.toString()}`, { scroll: false });
  }, [router, searchParams]);

  const handleOpen = (id: string) => {
    setProductIdToDelete(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setProductIdToDelete(null);
  };

  const handleDeleteProduct = async () => {
    if (productIdToDelete) {
      await deleteProduct(productIdToDelete);
      router.refresh();
      handleClose();
    }
  };

  const handleOnPrevPress = () => {
    const prevPage = currentPageNo - 1;
    if (prevPage > 0) {
      const params = new URLSearchParams(searchParams);
      params.set("page", prevPage.toString());
      router.push(`/products?${params.toString()}`);
    }
  };

  const handleOnNextPress = () => {
    const nextPage = currentPageNo + 1;
    const params = new URLSearchParams(searchParams);
    params.set("page", nextPage.toString());
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 pt-40">
      <div className="max-w-7xl mx-auto">
        {/* Header Section with Integrated Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-8">
            <div className="flex flex-col space-y-6 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Productos
                </h1>
                <p className="text-gray-600">
                  {searchQuery
                    ? `${filteredProducts.length} productos encontrados`
                    : "Gestiona tu inventario de productos"}
                </p>
              </div>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4 lg:w-auto">
                {/* Integrated Search */}
                <div className="flex-1 lg:w-80">
                  <div className="relative group">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Buscar productos..."
                        className={`
                          w-full h-12 pl-12 pr-20 text-sm bg-white border-2 rounded-xl
                          transition-all duration-200 ease-in-out placeholder:text-gray-400
                          focus:outline-none focus:ring-0
                          ${
                            isFocused || searchQuery
                              ? "border-blue-500 shadow-lg shadow-blue-500/10"
                              : "border-gray-200 hover:border-gray-300"
                          }
                        `}
                      />

                      {/* Search Icon */}
                      <div className="absolute left-4 top-1/2 -translate-y-1/2">
                        <MagnifyingGlassIcon
                          className={`w-5 h-5 transition-colors duration-200
                            ${
                              isFocused || searchQuery
                                ? "text-blue-500"
                                : "text-gray-400"
                            }
                          `}
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                        {/* Loading Indicator */}
                        {isSearching && (
                          <div className="p-2">
                            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        )}

                        {/* Clear Button */}
                        {searchQuery && !isSearching && (
                          <button
                            type="button"
                            onClick={handleClearSearch}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 
                                     rounded-lg transition-all duration-150 focus:outline-none 
                                     focus:ring-2 focus:ring-gray-200"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <Link
                  href="/products/create"
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 
                           hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg 
                           shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 
                           transition-all duration-200 transform hover:-translate-y-0.5 
                           focus:outline-none focus:ring-4 focus:ring-blue-600/20"
                >
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Añadir Producto
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Producto
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Precio
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((item) => {
                  const { id, thumbnail, title, price, category, stock } = item;
                  return (
                    <tr
                      key={id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-shrink-0 h-12 w-12 relative">
                            <Image
                              src={thumbnail}
                              alt={title}
                              width={48}
                              height={48}
                              className="h-12 w-12 rounded-xl object-cover ring-2 ring-gray-100"
                              sizes="48px"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <Link href={`/${title}/${id}`} className="group">
                              <p
                                className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 
                                         transition-colors duration-150 truncate"
                              >
                                {truncate(title, 40)}
                              </p>
                            </Link>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900">
                          ${formatNumber(price)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                            stock
                              ? "bg-green-100 text-green-800 ring-1 ring-green-600/20"
                              : "bg-red-100 text-red-800 ring-1 ring-red-600/20"
                          }`}
                        >
                          {stock ? "Disponible" : "Agotado"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium 
                                       bg-gray-100 text-gray-800 ring-1 ring-gray-600/20"
                        >
                          {category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Link href={`/products/update/${id}`}>
                            <button
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 
                                             rounded-lg transition-all duration-150"
                            >
                              <PencilIcon className="w-4 h-4" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleOpen(id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 
                                     rounded-lg transition-all duration-150"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            <div className="divide-y divide-gray-200">
              {filteredProducts.map((item) => {
                const { id, thumbnail, title, price, category, stock } = item;
                return (
                  <div
                    key={id}
                    className="p-6 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 relative">
                        <Image
                          src={thumbnail}
                          alt={title}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-xl object-cover ring-2 ring-gray-100"
                          sizes="64px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link href={`/${title}/${id}`}>
                          <h3
                            className="text-sm font-semibold text-gray-900 hover:text-blue-600 
                                       transition-colors duration-150 mb-2"
                          >
                            {truncate(title, 30)}
                          </h3>
                        </Link>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Precio:
                            </span>
                            <span className="text-sm font-semibold text-gray-900">
                              ${formatNumber(price)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Stock:
                            </span>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                stock
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {stock ? "Disponible" : "Agotado"}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              Categoría:
                            </span>
                            <span
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                                           bg-gray-100 text-gray-800"
                            >
                              {category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Link href={`/products/update/${id}`}>
                          <button
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 
                                           rounded-lg transition-all duration-150"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleOpen(id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 
                                   rounded-lg transition-all duration-150"
                        >
                          <XMarkIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* No Results State */}
          {filteredProducts.length === 0 && searchQuery && (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <MagnifyingGlassIcon className="w-full h-full" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se encontraron productos
              </h3>
              <p className="text-gray-600 mb-6">
                No hay productos que coincidan con &apos;{searchQuery}&apos;
              </p>
              <button
                onClick={handleClearSearch}
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 
                         text-gray-700 font-medium rounded-lg transition-colors duration-200"
              >
                Limpiar búsqueda
              </button>
            </div>
          )}

          {/* Empty State */}
          {products.length === 0 && !searchQuery && (
            <div className="text-center py-16">
              <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay productos
              </h3>
              <p className="text-gray-600 mb-6">
                Comienza agregando tu primer producto.
              </p>
              <Link
                href="/products/create"
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 
                         text-white font-medium rounded-lg transition-colors duration-200"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Añadir Producto
              </Link>
            </div>
          )}
        </div>

        {/* Pagination */}
        {showPageNavigator && !searchQuery && filteredProducts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mt-6">
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Página <span className="font-semibold">{currentPageNo}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  disabled={currentPageNo === 1}
                  onClick={handleOnPrevPress}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    currentPageNo === 1
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  Anterior
                </button>
                <button
                  disabled={!hasMore}
                  onClick={handleOnNextPress}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    !hasMore
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={handleClose}
            />
            <div
              className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-xl 
                          transition-all sm:my-8 sm:w-full sm:max-w-lg"
            >
              <div className="bg-white px-6 pb-4 pt-6">
                <div className="sm:flex sm:items-start">
                  <div
                    className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center 
                                rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
                  >
                    <XMarkIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-semibold leading-6 text-gray-900">
                      Confirmar Borrado
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        ¿Estás seguro que deseas borrar este producto? Esta
                        acción no se puede deshacer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse sm:gap-3">
                <button
                  onClick={handleDeleteProduct}
                  className="inline-flex w-full justify-center rounded-lg bg-red-600 px-4 py-2.5 
                           text-sm font-semibold text-white shadow-sm hover:bg-red-700 
                           transition-colors duration-200 sm:w-auto"
                >
                  Sí, Borrar
                </button>
                <button
                  onClick={handleClose}
                  className="mt-3 inline-flex w-full justify-center rounded-lg bg-white px-4 py-2.5 
                           text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 
                           hover:bg-gray-50 transition-colors duration-200 sm:mt-0 sm:w-auto"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
