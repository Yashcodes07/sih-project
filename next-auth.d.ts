import NextAuth, { DefaultSession } from "next-auth";
// included to use typescript and sesssions from next auth 
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}