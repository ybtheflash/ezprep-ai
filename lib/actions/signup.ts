"use server";
import bcrypt from "bcryptjs";
import connectDB from "../db"; // Import Mongoose connection // Import Mongoose User model
import User from "@/models/user";

export type SignupResult = {
  message: string;
  error?: string;
};

export async function signup(
  name: string,
  email: string,
  phone: string,
  username: string,
  password: string
): Promise<SignupResult> {
  try {
    // Connect to MongoDB
    await connectDB();

    // Check if a user with the same email, username, or phone already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phone }],
    }).select("email username phone");

    if (existingUser) {
      if (existingUser.email === email) {
        return {
          message: "Email already exists",
          error: "email",
        };
      }
      if (existingUser.username === username) {
        return {
          message: "Username already exists",
          error: "username",
        };
      }
      if (existingUser.phone === phone) {
        return {
          message: "Phone number already exists",
          error: "phone",
        };
      }
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      name,
      email,
      phone,
      username,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    return {
      message: "User created successfully",
    };
  } catch (error) {
    console.error("Error during signup:", error);
    return {
      message: "An error occurred",
      error: `${error}`,
    };
  }
}