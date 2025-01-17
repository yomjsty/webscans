import { z } from "zod";

export const formSchema = z.object({
    name: z.string().min(2, { message: "Name must be atleast 2 characters long" }).max(50),
    email: z.string().email({ message: "Please enter a valid email address" }),
    password: z.string().min(8, { message: "Password must be atleast 8 characters long" }).max(50),
});

export const loginFormSchema = formSchema.pick({
    email: true,
    password: true,
});