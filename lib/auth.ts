import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Officer from "@/models/Officer";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectToDatabase();

        // 🆕 Special case for verified users coming from OTP flow
        if (credentials.password === "verified") {
          // Check officers collection first
          const officer = await Officer.findOne({ 
            email: credentials.email.trim().toLowerCase(),
            is_verified: true  // 🆕 Only allow verified users
          });

          if (officer) {
            return {
              id: officer._id.toString(),
              email: officer.email,
              name: officer.name,
              role: "officer",
              department: officer.department
            };
          }

          // Check users collection
          const user = await User.findOne({ 
            email: credentials.email.trim().toLowerCase(),
            is_verified: true  // 🆕 Only allow verified users
          });

          if (user) {
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
              role: user.role || "citizen",
              department: user.department || null
            };
          }

          return null;
        }

        // 🔄 Your existing password authentication logic
        // Check officers collection first
        const officer = await Officer.findOne({
          email: credentials.email.trim().toLowerCase()
        });

        if (officer && officer.password && officer.is_verified) {  // 🆕 Added is_verified check
          const isValid = await bcrypt.compare(credentials.password, officer.password);
          if (isValid) {
            return {
              id: officer._id.toString(),
              email: officer.email,
              name: officer.name,
              role: "officer",
              department: officer.department
            };
          }
        }

        // Check users collection
        const user = await User.findOne({
          email: credentials.email.trim().toLowerCase()
        });

        if (user && user.password && user.is_verified) {  // 🆕 Added is_verified check
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (isValid) {
            return {
              id: user._id.toString(),
              email: user.email,
              name: user.name,
              role: user.role || "citizen",
              department: user.department || null
            };
          }
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.department = user.department;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.sub;
        (session.user as any).role = token.role;
        (session.user as any).department = token.department;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt"
  }
};
