import { z } from "zod";

export const SignUpSchema = z.object({
    firstName: z.string().trim().min(1, "First name is required"),
    lastName: z.string().trim().min(1, "Last name is required"),
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const SignInSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required")
        .email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});


export const CodeSchema = z.object({
    code: z.string().length(4, "Code must be 4 digits"),
})

export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
export type SignInSchemaType = z.infer<typeof SignInSchema>;
export type CodeSchemaType = z.infer<typeof CodeSchema>;
