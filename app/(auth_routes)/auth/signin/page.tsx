"use client";

import React from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "@material-tailwind/react";
import AuthFormContainer from "@components/AuthFormContainer";
import { filterFormikErrors } from "@/app/utils/formikHelperts";
import { useFormik } from "formik";
import Link from "next/link";
import * as yup from "yup";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Props {
  rest: any;
}

const validationSchema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export default function SignIn({ rest }: Props) {
  const router = useRouter();
  const {
    values,
    isSubmitting,
    touched,
    errors,
    handleSubmit,
    handleBlur,
    handleChange,
  } = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: async (values, actions) => {
      const signInRes = await signIn("credentials", {
        ...values,
        redirect: false,
      });

      if (signInRes?.error === "CredentialsSignin") {
        toast.error("Error el Email/Contraseña no coinciden!");
      }

      if (!signInRes?.error) {
        router.refresh();
      }
    },
  });

  const errorsToRender = filterFormikErrors(errors, touched, values);

  type valueKeys = keyof typeof values;

  const { email, password } = values;
  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  return (
    <AuthFormContainer title="" onSubmit={handleSubmit}>
      <Input
        name="email"
        label="Email"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("email")}
        {...rest}
      />
      <Input
        name="password"
        label="Password"
        value={password}
        onChange={handleChange}
        onBlur={handleBlur}
        error={error("password")}
        type="password"
        {...rest}
      />
      <Button
        type="submit"
        className="w-full bg-blue-600"
        disabled={isSubmitting}
        {...rest}
      >
        Ingresar
      </Button>
      <div className="flex items-center justify-between">
        <Link href="/auth/signup">Crear Cuenta</Link>
        {/* <Link href="/auth/forget-password">Forget password</Link> */}
      </div>
      <div className="">
        {errorsToRender.map((item) => {
          return (
            <div
              key={item}
              className="space-x-1 flex items-center text-red-500"
            >
              <XMarkIcon className="w-4 h-4" />
              <p className="text-xs">{item}</p>
            </div>
          );
        })}
      </div>
    </AuthFormContainer>
  );
}
