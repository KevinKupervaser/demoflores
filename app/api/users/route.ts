import startDb from "@/app/lib/db";
// import EmailVerificationToken from "@/app/models/emailVerificationToken";
import UserModel from "@/app/models/userModel";
import { NewUserRequest } from "@/app/types";
import { NextResponse } from "next/server";
// import crypto from "crypto";
// import { sendEmail } from "@/app/lib/email";

export const POST = async (req: Request) => {
  const body = (await req.json()) as NewUserRequest;
  await startDb();

  const newUser = await UserModel.create({
    ...body,
  });

  //   const token = crypto.randomBytes(32).toString("hex");
  //   await EmailVerificationToken.create({ user: newUser._id, token });

  //   const verifyUrl = `${process.env.VERIFICATION_URL}?token=${token}&userId=${newUser._id}`;

  //   await sendEmail({
  //     profile: { name: newUser.name, email: newUser.email },
  //     subject: "verification",
  //     linkUrl: verifyUrl,
  //   });

  return NextResponse.json({ message: "Usuario creado con exito!" });
};
