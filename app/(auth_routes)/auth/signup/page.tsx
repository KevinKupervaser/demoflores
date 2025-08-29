"use client";

import React from "react";
import AuthFormContainer from "@components/AuthFormContainer";
import { Input, Button } from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useFormik } from "formik";
import * as yup from "yup";
import { filterFormikErrors } from "@/app/utils/formikHelperts";
import { toast } from "react-toastify";
import Link from "next/link";
import { signIn } from "next-auth/react";

interface Props {
  rest: any;
}

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters"),
});

function SignUp({ rest }: Props) {
  const {
    values,
    handleChange,
    handleSubmit,
    handleBlur,
    isSubmitting,
    errors,
    touched,
  } = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, action) => {
      //   console.log(values);
      action.setSubmitting(true);
      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify(values),
      });

      const { message, error } = (await res.json()) as {
        message: string;
        error: string;
      };

      console.log(message);

      if (res.ok) {
        toast.success(message);
        await signIn("credentials", {
          email,
          password,
        });
      }

      if (!res.ok && error) {
        toast.error(error);
      }
      action.setSubmitting(false);
    },
  });

  const formErrors: string[] = filterFormikErrors(errors, touched, values);

  const { name, email, password } = values;

  type valueKeys = keyof typeof values;
  const error = (name: valueKeys) => {
    return errors[name] && touched[name] ? true : false;
  };

  return (
    <AuthFormContainer title="Crear Nueva Cuenta" onSubmit={handleSubmit}>
      <Input
        name="name"
        label="Name"
        onChange={handleChange}
        value={name}
        onBlur={handleBlur}
        error={error("name")}
        {...rest}
      />
      <Input
        name="email"
        label="Email"
        onChange={handleChange}
        value={email}
        onBlur={handleBlur}
        error={error("email")}
        {...rest}
      />
      <Input
        name="password"
        label="Password"
        type="password"
        onChange={handleChange}
        onBlur={handleBlur}
        value={password}
        error={error("password")}
        {...rest}
      />
      <Button
        disabled={isSubmitting}
        type="submit"
        className="w-full bg-blue-600"
        {...rest}
      >
        CREAR CUENTA
      </Button>
      <div className="flex items-center justify-between">
        <Link href="/auth/signin">Ingresar</Link>
        {/* <Link href="/auth/forget-password">Forget password</Link> */}
      </div>
      <div className="">
        {formErrors.map((err) => {
          return (
            <div key={err} className="space-x-1 flex items-center text-red-500">
              <XMarkIcon className="w-4 h-4" />
              <p className="text-xs">{err}</p>
            </div>
          );
        })}
      </div>
    </AuthFormContainer>
  );
}

export default SignUp;
