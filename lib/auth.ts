// app/api/auth/[...nextauth]/route.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db"; // Import Mongoose connection // Import Mongoose User model
import { DefaultSession, User as NextAuthUser } from "next-auth";
import User from "@/models/user";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      name: string;
      username: string;
      email: string;
      phone: string;
      image?: string;
      isAdmin: boolean
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    name: string;
    email: string;
    username: string;
    phone: string;
    isAdmin: boolean;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Connect to MongoDB
        await connectDB();

        // Find user by email
        const user = await User.findOne({ email: credentials.email.toLowerCase() })
          .select('id name email username phone password isAdmin'); // Add isAdmin to selected fields

        if (!user) {
          throw new Error("Invalid credentials");
        }

        // Compare passwords
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid credentials");
        }

        // Return user data (excluding password)
        return {
          id: (user as any)._id.toString(), // Convert ObjectId to string
          name: user.name,
          email: user.email,
          username: user.username,
          phone: user.phone,
          isAdmin: user.isAdmin
        };
      },
    })
  ],
  secret: process.env.JWT_SECRET!,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.username = user.username;
        token.phone = user.phone;
        token.isAdmin = user.isAdmin;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        id: token.id as string,
        name: token.name as string,
        email: token.email as string,
        username: token.username as string,
        phone: token.phone as string,
        isAdmin: token.isAdmin as boolean,
      };
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  }
};