"use client";

import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import CoverImageUpload from "./CoverImageUpload";
import Image from "next/image";

interface MyProfileProps {
    user: {
        name: string;
        image?: string | null;
        email: string;
    };
}

const profileFormSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    image: z.string().optional(),
});

export default function ProfileForm({ user }: MyProfileProps) {
    const form = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            image: user.image || "",
        },
    });

    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const isDirty = form.formState.isDirty;

    async function onSubmit(values: z.infer<typeof profileFormSchema>) {
        setLoading(true);
        try {
            await authClient.updateUser({
                name: values.name,
                image: values.image,
            });
            toast({
                description: "Profile updated",
            });
            router.refresh();
        } catch {
            toast({
                description: "Something went wrong. Please try again",
                variant: "destructive",
            });
        }
        setLoading(false);
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 pt-4"
            >
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Profile Image</FormLabel>
                            {field.value && (
                                <div className="mt-4">
                                    <Image
                                        src={field.value}
                                        alt="Profile Preview"
                                        className="w-32 h-32 object-cover rounded-full border"
                                        width={128}
                                        height={128}
                                        priority
                                    />
                                </div>
                            )}
                            <FormControl>
                                <CoverImageUpload
                                    onUpload={(url) => {
                                        form.setValue("image", url);
                                        field.onChange(url);
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input {...field} readOnly disabled />
                            </FormControl>
                            <FormDescription>
                                This is your email address. You cannot change
                                your email address
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={!isDirty || loading}>
                    {loading ? (
                        <span className="flex gap-2 items-center">
                            <Loader2 className="animate-spin" /> Updating...
                        </span>
                    ) : (
                        "Update"
                    )}
                </Button>
            </form>
        </Form>
    );
}
