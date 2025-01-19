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

export const createNovelSchema = z.object({
    title: z.string().min(2, { message: "Title must be atleast 2 characters long" }),
    slug: z.string(),
    alternativeTitle: z.string().optional(),
    synopsis: z.string().min(10, { message: "Synopsis must be atleast 10 characters long" }),
    author: z.string().min(2, { message: "Author must be atleast 2 characters long" }),
    coverImage: z.string().url({ message: "Please upload your image" }),
    genre: z.array(z.string()).min(1, { message: "Please select atleast one genre" }),
    status: z.enum(["ongoing", "completed", "hiatus", "canceled", "discontinued", "upcoming"]),
    releaseYear: z.string().regex(/^\d{4}$/, { message: "Please enter a valid year" }),
})

export const createChapterSchema = z.object({
    title: z.string().min(2, { message: "Title must be atleast 2 characters long" }),
    slug: z.string(),
    alternativeTitle: z.string().optional(),
    content: z.string().min(10, { message: "Content must be atleast 10 characters long" }),
    price: z.number().min(0, { message: "Put 0 if the chapter is free" }).optional(),
    parentSeries: z.array(z.string()).min(1, { message: "Please select one serie only" }),
    isPremium: z.boolean().optional(),
    isPublished: z.boolean().optional(),
})