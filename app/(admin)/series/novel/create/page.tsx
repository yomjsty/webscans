"use client";

import { useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { createNovelSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tag, TagInput } from "emblor";
import { useId, useState } from "react";
import CoverImageUpload from "@/components/CoverImageUpload";
import slugify from "slugify";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
    const form = useForm<z.infer<typeof createNovelSchema>>({
        resolver: zodResolver(createNovelSchema),
        defaultValues: {
            alternativeTitle: "",
            author: "",
            coverImage: "",
            genre: [],
            releaseYear: "",
            slug: "",
            status: "ongoing",
            synopsis: "",
            title: "",
        },
    });

    const router = useRouter();
    const id = useId();
    const [, setTags] = useState<Tag[]>([]);
    const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const titleValue = event.target.value;
        const generatedSlug = slugify(titleValue, {
            lower: true,
            strict: true,
        });
        form.setValue("title", titleValue);
        form.setValue("slug", generatedSlug);
    };

    async function onSubmit(values: z.infer<typeof createNovelSchema>) {
        setLoading(true);
        try {
            const response = await fetch("/api/create/novel", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(values),
            });

            if (response.ok) {
                toast({
                    description: "Novel created",
                });
                router.push("/series/novel");
            } else {
                const errorData = await response.json();
                toast({
                    description: errorData.message,
                    variant: "destructive",
                });
            }
        } catch {
            toast({
                description: "Something went wrong, please try again.",
                variant: "destructive",
            });
        }
        setLoading(false);
    }

    function setCoverImage(url: string) {
        form.setValue("coverImage", url);
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Create Your Novel</CardTitle>
                <CardDescription>
                    Start your storytelling journey by crafting an engaging
                    novel. Add details, set the scene, and bring your characters
                    to life!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={handleTitleChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="slug"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Slug</FormLabel>
                                    <FormControl>
                                        <Input {...field} readOnly />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="alternativeTitle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Alternative Title{" "}
                                        <Badge variant="outline">
                                            optional
                                        </Badge>
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="synopsis"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Synopsis</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="author"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Author</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="genre"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Genre</FormLabel>
                                    <FormControl>
                                        <TagInput
                                            id={id}
                                            tags={(field.value || []).map(
                                                (tag, index) => ({
                                                    id: index.toString(),
                                                    text: tag,
                                                    value: tag,
                                                })
                                            )}
                                            setTags={(newTags) => {
                                                const updatedTags =
                                                    newTags as Tag[];
                                                field.onChange(
                                                    updatedTags.map(
                                                        (tag) => tag.text
                                                    )
                                                );
                                                setTags(updatedTags);
                                            }}
                                            placeholder="Add a tag, separate with Enter or comma"
                                            styleClasses={{
                                                inlineTagsContainer:
                                                    "border-input rounded-lg bg-background shadow-sm shadow-black/5 transition-shadow focus-within:border-ring focus-within:outline-none focus-within:ring-[3px] focus-within:ring-ring/20 p-1 gap-1",
                                                input: "w-full min-w-[80px] focus-visible:outline-none shadow-none px-2 h-7",
                                                tag: {
                                                    body: "h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                                                    closeButton:
                                                        "absolute -inset-y-px -end-px p-0 rounded-e-lg flex size-7 transition-colors outline-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 text-muted-foreground/80 hover:text-foreground",
                                                },
                                            }}
                                            activeTagIndex={activeTagIndex}
                                            setActiveTagIndex={
                                                setActiveTagIndex
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="canceled">
                                                    Canceled
                                                </SelectItem>
                                                <SelectItem value="completed">
                                                    Completed
                                                </SelectItem>
                                                <SelectItem value="discontinued">
                                                    Discontinued
                                                </SelectItem>
                                                <SelectItem value="hiatus">
                                                    Hiatus
                                                </SelectItem>
                                                <SelectItem value="ongoing">
                                                    Ongoing
                                                </SelectItem>
                                                <SelectItem value="upcoming">
                                                    Upcoming
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="releaseYear"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Release Year</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="number" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="coverImage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cover Image</FormLabel>
                                    <FormControl>
                                        <div>
                                            <CoverImageUpload
                                                onUpload={(url) => {
                                                    setCoverImage(url);
                                                    field.onChange(url);
                                                }}
                                            />

                                            {field.value && (
                                                <div className="mt-4">
                                                    <p>Cover Image URL:</p>
                                                    <code className="break-words text-sm bg-gray-100 p-2 rounded">
                                                        {field.value}
                                                    </code>
                                                </div>
                                            )}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={loading}>
                            {loading ? (
                                <span className="flex gap-2 items-center">
                                    <Loader2 className="animate-spin" />{" "}
                                    Creating...
                                </span>
                            ) : (
                                "Create"
                            )}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
