import { object, string, enum as enum_ } from "zod"
 
export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(32, "Password must be less than 32 characters"),
})

export const signUpSchema = object({
  username: string({ required_error: "Username is required" })
    .min(1, "Username is required"),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(32, "Password must be less than 32 characters"),
})

export const downloadSchema = object({
  url: string({ required_error: "URL is required" })
    .min(1, "URL is required"),
  format: enum_(["mp4", "mp3", "ogg", "aac"], { invalid_type_error: "Invalid format", required_error: "Format is required" }),
  quality: enum_(["best", "320kbps", "192kbps", "128kbps", "2160p", "1440p", "1080p", "720p", "480p"], { invalid_type_error: "Invalid quality", required_error: "Quality is required" }),
})

export const downloadDeleteSchema = object({
  file: string({ required_error: "File is required" })
    .min(1, "File is required")
    .max(1000, "File is too long"),
})