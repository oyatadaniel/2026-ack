import axios from "axios";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { email, password } = credentials;
        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

        try {
          // Prevent axios from throwing on non-2xx responses
          const res = await axios.post(
            `${BACKEND_URL}/auth/login`,
            credentials,
            { validateStatus: () => true },
          );

          if (res.status === 200) {
            return res.data; // Successful login → pass user to NextAuth
          } else {
            // Forward backend error message to frontend
            throw new Error(res.data.message || "Login failed");
          }
        } catch (error) {
          console.log("Authorize error:", error.message);
          throw new Error(error.message || "Login failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
    updateAge: 60 * 60,
  },
  jwt: {
    maxAge: 15 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: "/authentication/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
});
