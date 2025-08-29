"use client";
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Notification = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      hideProgressBar={false}
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      className="custom-toast-container"
      toastClassName="custom-toast"
      bodyClassName="custom-toast-body"
      progressClassName="custom-progress-bar"
    />
  );
};

export default Notification;
