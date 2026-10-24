import * as z from "zod";


// name, age, email, password
export const signupSchema = z.object({
    name: z
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(30, "Name must be at most 30 characters"),

    age: z
        .number()
        .int()
        .min(18, "Minimum age should be 18")
        .max(100, "Maximum age should be 100")
        .optional(),

    email: z.preprocess(
        (value) => typeof value === "string" ? value.trim().toLowerCase() : value,
        z.email()
    ),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(30, "Password must be atmost 30 characters")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[a-z]/, "Must contain an lowercase letter")
        .regex(/[0-9]/, "Must contain a number")
        .regex(/[!@#$%^&*]/, "Must contain a special character")
});

// email, password 
export const loginSchema = z.object({
    email: z.preprocess(
        (value) => typeof value === "string" ? value.trim().toLowerCase() : value,
        z.email()
    ),

    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(30, "Password must be atmost 30 characters")
        .regex(/[A-Z]/, "Must contain an uppercase letter")
        .regex(/[a-z]/, "Must contain an lowercase letter")
        .regex(/[0-9]/, "Must contain a number")
        .regex(/[!@#$%^&*]/, "Must contain a special character")       
});