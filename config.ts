import CredentialsProvider from "next-auth/providers/credentials";
import { SessionUserProfile, SignInCredentials } from "./app/types";
import { NextAuthOptions } from "next-auth";

// comment

declare module "next-auth" {
  interface Session {
    user: SessionUserProfile;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, request) {
        const { email, password } = credentials as SignInCredentials;
        // send request to your api route where you can sign in you user and send error or success response to this function.
        const { user, error } = await fetch(
          // deployment
          // "http://localhost:3000/api/users/signin",
          process.env.API_SING_IN_ENDPOINT!,
          {
            method: "POST",
            body: JSON.stringify({ email, password }),
          }
        ).then(async (res) => await res.json());

        if (error) return null;
        return { id: user.id, ...user };
      },
    }),
  ],

  callbacks: {
    async jwt(params) {
      if (params.user) {
        params.token = { ...params.user, ...params.user };
      }
      return params.token;
    },
    async session(params) {
      const user = params.token as typeof params.token & SessionUserProfile;
      if (user) {
        params.session.user = {
          ...params.session.user,
          id: user.id,
          name: user.name,
          role: user.role,
        };
      }
      return params.session;
    },
  },
};
