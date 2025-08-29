"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAppContext } from "../context";
import {
  XMarkIcon,
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import espacioSaludable from "/public/espacio-saludable.png";

interface Props {
  rest?: any;
}

const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const SideDrawer = ({ rest }: Props) => {
  const {
    cart,
    updateCartItemQuantity,
    closeDrawerRight,
    openRight,
    removeFromCart,
  } = useAppContext();

  const [currentPage, setCurrentPage] = useState(1);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    paymentMethod: "efectivo",
    notes: "",
  });

  const itemsPerPage = 4;

  useEffect(() => {
    document.body.style.overflow = openRight ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openRight]);

  const handleOrder = () => {
    const totalPrice = cart.reduce(
      (total, product) => total + product.price * product.quantity,
      0
    );

    let message = `🌸 NUEVO PEDIDO - FLORERIA LAS GARDENIAS 🌸\n\n`;
    message += `👤 Cliente: ${formData.fullName}\n`;
    message += `📱 Teléfono: ${formData.phone}\n`;
    message += `📍 Dirección: ${formData.address}\n`;
    message += `💰 Método de Pago: ${formData.paymentMethod}\n`;
    if (formData.notes) message += `📝 Notas: ${formData.notes}\n`;
    message += `\n📦 PRODUCTOS:\n`;

    cart.forEach((product) => {
      message += `• ${product.title}\n  Precio: $${formatPrice(
        product.price
      )} x ${product.quantity}\n  Subtotal: $${formatPrice(
        product.price * product.quantity
      )}\n\n`;
    });

    message += `💵 TOTAL: $${formatPrice(totalPrice)}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/543794390681?text=${encodedMessage}`;
    window.open(whatsappUrl, "_blank");
  };

  const totalPages = Math.ceil(cart.length / itemsPerPage);
  const paginatedCart = cart.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPrice = cart.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleOrder();
    closeDrawerRight();
    setIsFormVisible(false);
    setFormData({
      fullName: "",
      phone: "",
      address: "",
      paymentMethod: "efectivo",
      notes: "",
    });
  };

  return (
    <>
      {/* Backdrop */}
      {openRight && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={closeDrawerRight}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-out z-50 ${
          openRight ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#F3D1AC]/20 to-[#38513E]/10 p-6 border-b border-[#F3D1AC]/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingBagIcon className="w-6 h-6 text-[#38513E]" />
              <h2 className="text-xl font-semibold text-[#252C24]">
                Mi Carrito
              </h2>
            </div>
            <button
              onClick={closeDrawerRight}
              className="p-2 hover:bg-white/50 rounded-full transition-colors duration-200"
            >
              <XMarkIcon className="w-5 h-5 text-[#576D56]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!isFormVisible ? (
            <div className="p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <h3 className="text-lg font-medium text-[#252C24] mb-2">
                    Tu carrito está vacío
                  </h3>
                  <p className="text-[#576D56]">
                    Agrega algunos productos para comenzar
                  </p>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-4 mb-6">
                    {paginatedCart.map((product) => (
                      <div
                        key={product.id}
                        className="bg-[#F3D1AC]/10 rounded-xl p-4 border border-[#F3D1AC]/30"
                      >
                        <div className="flex items-start space-x-4">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm">
                            <Image
                              src={product.thumbnail}
                              alt={product.title}
                              fill
                              className="object-cover"
                              sizes="64px"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h4 className="font-medium text-[#252C24] text-sm line-clamp-2">
                                {product.title}
                              </h4>
                              <button
                                onClick={() => removeFromCart(product.id)}
                                className="p-1 text-[#AC572E] hover:bg-[#AC572E]/10 rounded-full transition-colors duration-200 ml-2"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>

                            <p className="text-[#38513E] font-semibold mt-1">
                              ${formatPrice(product.price)}
                            </p>

                            <div className="flex items-center justify-between mt-3">
                              <div className="flex items-center bg-white rounded-lg border border-[#F3D1AC]">
                                <button
                                  onClick={() =>
                                    updateCartItemQuantity(product.id, -1)
                                  }
                                  className="p-2 text-[#576D56] hover:text-[#38513E] hover:bg-[#F3D1AC]/20 rounded-l-lg transition-colors duration-200"
                                  disabled={product.quantity <= 1}
                                >
                                  <MinusIcon className="w-4 h-4" />
                                </button>
                                <span className="px-4 py-2 text-[#252C24] font-medium min-w-[3rem] text-center">
                                  {product.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateCartItemQuantity(product.id, 1)
                                  }
                                  className="p-2 text-[#576D56] hover:text-[#38513E] hover:bg-[#F3D1AC]/20 rounded-r-lg transition-colors duration-200"
                                >
                                  <PlusIcon className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="text-right">
                                <p className="text-sm font-semibold text-[#38513E]">
                                  $
                                  {formatPrice(
                                    product.price * product.quantity
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center space-x-2 mb-6">
                      <button
                        onClick={() =>
                          setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="p-2 text-[#576D56] hover:text-[#38513E] hover:bg-[#F3D1AC]/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeftIcon className="w-5 h-5" />
                      </button>
                      <span className="flex items-center px-3 text-sm text-[#252C24]">
                        {currentPage} de {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="p-2 text-[#576D56] hover:text-[#38513E] hover:bg-[#F3D1AC]/20 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRightIcon className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="p-6">
              <h3 className="text-xl font-semibold text-[#252C24] mb-6">
                Información de Entrega
              </h3>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#252C24] mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-white border-2 border-[#F3D1AC] rounded-xl focus:border-[#38513E] focus:outline-none transition-colors duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#252C24] mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-white border-2 border-[#F3D1AC] rounded-xl focus:border-[#38513E] focus:outline-none transition-colors duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#252C24] mb-2">
                    Dirección de Entrega *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    className="w-full px-4 py-3 bg-white border-2 border-[#F3D1AC] rounded-xl focus:border-[#38513E] focus:outline-none transition-colors duration-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#252C24] mb-3">
                    Método de Pago
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 p-3 bg-white border-2 border-[#F3D1AC] rounded-xl cursor-pointer hover:bg-[#F3D1AC]/10 transition-colors duration-200">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="efectivo"
                        checked={formData.paymentMethod === "efectivo"}
                        onChange={handleFormChange}
                        className="text-[#38513E]"
                      />
                      <span className="text-[#252C24]">Efectivo</span>
                    </label>
                    <label className="flex items-center space-x-3 p-3 bg-white border-2 border-[#F3D1AC] rounded-xl cursor-pointer hover:bg-[#F3D1AC]/10 transition-colors duration-200">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="transferencia"
                        checked={formData.paymentMethod === "transferencia"}
                        onChange={handleFormChange}
                        className="text-[#38513E]"
                      />
                      <span className="text-[#252C24]">Transferencia</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#252C24] mb-2">
                    Notas Adicionales
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-white border-2 border-[#F3D1AC] rounded-xl focus:border-[#38513E] focus:outline-none transition-colors duration-200 resize-none"
                    placeholder="Instrucciones especiales, referencias, etc."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsFormVisible(false)}
                    className="flex-1 py-3 px-4 bg-gray-100 text-[#576D56] rounded-xl hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    Volver
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 bg-[#38513E] text-white rounded-xl hover:bg-[#252C24] transition-colors duration-200 font-semibold"
                  >
                    Confirmar Pedido
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isFormVisible && cart.length > 0 && (
          <div className="border-t border-[#F3D1AC]/30 p-6 bg-gradient-to-r from-[#F3D1AC]/10 to-white">
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-[#252C24]">
                Total:
              </span>
              <span className="text-2xl font-bold text-[#38513E]">
                ${formatPrice(totalPrice)}
              </span>
            </div>

            <button
              onClick={() => setIsFormVisible(true)}
              className="w-full py-4 bg-[#38513E] text-white rounded-xl hover:bg-[#252C24] transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Proceder al Pedido
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default SideDrawer;
