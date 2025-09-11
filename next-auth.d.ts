import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: 'citizen' | 'officer';
      department?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: 'citizen' | 'officer';
    department?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: 'citizen' | 'officer';
    department?: string;
  }
}
