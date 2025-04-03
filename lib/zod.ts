import { object, string, enum as enum_ } from "zod"
 
export const signInSchema = object({
  email: string({ required_error: "Email is required" }).email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(6, "Password must be more than 6 characters")
    .max(48, "Password must be less than 48 characters"),
})

export const signUpSchema = object({
  username: string({ required_error: "Username is required" }),
  email: string({ required_error: "Email is required" })
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(6, "Password must be more than 6 characters")
    .max(48, "Password must be less than 48 characters"),
})

export const downloadSchema = object({
  url: string({ required_error: "URL is required" }),
  format: enum_(["mp4", "mp3"], { invalid_type_error: "Invalid format", required_error: "Format is required" }),
  quality: enum_(["320K", "192K", "128K", "2160", "1440", "1080", "720", "480"], { invalid_type_error: "Invalid quality", required_error: "Quality is required" }),
})

export const downloadPlaylistSchema = object({
  url: string({ required_error: "URL is required" }),
})

export const downloadDeleteSchema = object({
  file: string({ required_error: "File is required" }).max(1000, "File is too long"),
})