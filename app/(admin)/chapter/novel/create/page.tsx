"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { Badge } from "@/components/ui/badge";
import slugify from "slugify";
import { createChapterSchema } from "@/lib/schema";
import { Editor } from "@/components/editor";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function Page() {
    const form = useForm<z.infer<typeof createChapterSchema>>({
        resolver: zodResolver(createChapterSchema),
        defaultValues: {
            alternativeTitle: "",
            slug: "",
            content: "",
            title: "",
            price: 12,
            parentSeries: [],
            isPremium: false,
            isPublished: false,
        },
    });

    const router = useRouter();
    const id = useId();
    const [open, setOpen] = useState<boolean>(false);
    const [novels, setNovels] = useState<{ id: string; title: string }[]>([]);
    const [loadingDraft, setLoadingDraft] = useState(false);
    const [loadingCreate, setLoadingCreate] = useState(false);
    const { toast } = useToast();

    // Fetch available novel series
    useEffect(() => {
        async function fetchNovels() {
            try {
                const response = await fetch("/api/novel");
                if (!response.ok) throw new Error("Failed to fetch novels");
                const data = await response.json();
                setNovels(data.novels);
            } catch (error) {
                console.error(error);
            }
        }
        fetchNovels();
    }, []);

    const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const titleValue = event.target.value;
        const generatedSlug = slugify(titleValue, {
            lower: true,
            strict: true,
        });
        form.setValue("title", titleValue);
        form.setValue("slug", generatedSlug);
    };

    async function onSubmit(
        values: z.infer<typeof createChapterSchema>,
        isPublished: boolean
    ) {
        if (isPublished) {
            setLoadingCreate(true);
        } else {
            setLoadingDraft(true);
        }

        try {
            const response = await fetch("/api/create/novel/chapter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...values, isPublished }),
            });

            if (response.ok) {
                toast({
                    description: isPublished
                        ? "Novel created"
                        : "Saved to draft",
                });
                router.push("/chapter/novel");
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

        if (isPublished) {
            setLoadingCreate(false);
        } else {
            setLoadingDraft(false);
        }
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Create Your Chapter</CardTitle>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Chapter</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            onChange={handleTitleChange}
                                            placeholder="e.g. Chapter 1"
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
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Content</FormLabel>
                                    <FormControl>
                                        <Editor
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* Parent Series Dropdown */}
                        <FormField
                            control={form.control}
                            name="parentSeries"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Parent Series</FormLabel>
                                    <FormControl>
                                        <Popover
                                            open={open}
                                            onOpenChange={setOpen}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id={id}
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={open}
                                                    className="w-full justify-between bg-background px-3 font-normal"
                                                >
                                                    <span
                                                        className={cn(
                                                            "truncate",
                                                            !field.value
                                                                .length &&
                                                                "text-muted-foreground"
                                                        )}
                                                    >
                                                        {field.value.length > 0
                                                            ? novels
                                                                  .filter(
                                                                      (novel) =>
                                                                          field.value.includes(
                                                                              novel.id
                                                                          )
                                                                  )
                                                                  .map(
                                                                      (novel) =>
                                                                          novel.title
                                                                  )
                                                                  .join(", ")
                                                            : "Select Novel"}
                                                    </span>
                                                    <ChevronDown
                                                        size={16}
                                                        className="shrink-0 text-muted-foreground/80"
                                                    />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0">
                                                <Command>
                                                    <CommandInput placeholder="Search novel..." />
                                                    <CommandList>
                                                        <CommandEmpty>
                                                            No novel found.
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {novels.map(
                                                                (novel) => (
                                                                    <CommandItem
                                                                        key={
                                                                            novel.id
                                                                        }
                                                                        value={
                                                                            novel.id
                                                                        }
                                                                        onSelect={() => {
                                                                            form.setValue(
                                                                                "parentSeries",
                                                                                [
                                                                                    novel.id,
                                                                                ]
                                                                            );
                                                                            setOpen(
                                                                                false
                                                                            );
                                                                        }}
                                                                    >
                                                                        {
                                                                            novel.title
                                                                        }
                                                                        {field.value.includes(
                                                                            novel.id
                                                                        ) && (
                                                                            <Check
                                                                                size={
                                                                                    16
                                                                                }
                                                                                className="ml-auto"
                                                                            />
                                                                        )}
                                                                    </CommandItem>
                                                                )
                                                            )}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </FormControl>
                                    <FormDescription>
                                        Please select only one serie.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isPremium"
                            render={({ field }) => (
                                <FormItem className="flex flex-col gap-1">
                                    <Label htmlFor="premium">Premium</Label>
                                    <FormControl>
                                        <Checkbox
                                            id="premium"
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {form.watch("isPremium") && (
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Price <Badge>coins</Badge>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                placeholder="Enter price"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <div className="flex gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() =>
                                    form.handleSubmit((values) =>
                                        onSubmit(values, false)
                                    )()
                                }
                                disabled={loadingDraft || loadingCreate}
                            >
                                {loadingDraft ? (
                                    <span className="flex gap-2 items-center">
                                        <Loader2 className="animate-spin" />{" "}
                                        Saving to Draft...
                                    </span>
                                ) : (
                                    "Save to Draft"
                                )}
                            </Button>
                            <Button
                                type="button"
                                onClick={() =>
                                    form.handleSubmit((values) =>
                                        onSubmit(values, true)
                                    )()
                                }
                                disabled={loadingDraft || loadingCreate}
                            >
                                {loadingCreate ? (
                                    <span className="flex gap-2 items-center">
                                        <Loader2 className="animate-spin" />{" "}
                                        Creating...
                                    </span>
                                ) : (
                                    "Create"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
