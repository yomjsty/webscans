"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface ActionButtonProps {
    Id: string;
    type: string;
    category: string;
    title: string;
    group: string;
}

export default function ActionButton({
    Id,
    type,
    category,
    title,
    group,
}: ActionButtonProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleEdit = (id: string) => {
        router.push(`/${category}/${type}/edit/${id}`);
    };

    const handleDelete = async (id: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/delete/${group}/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                router.refresh();
                toast({
                    description: `${type} deleted successfully.`,
                });
            } else {
                const errorData = await response.json();
                toast({
                    description:
                        errorData.error || `Failed to delete the ${type}.`,
                    variant: "destructive",
                });
            }
        } catch {
            toast({
                description: `An error occurred while deleting the ${type}.`,
                variant: "destructive",
            });
        }
        setLoading(false);
    };

    return (
        <div className="flex gap-2 justify-end w-full">
            <Button
                variant="outline"
                aria-label={`Edit novel ${Id}`}
                onClick={() => handleEdit(Id)}
            >
                Edit <Pencil className="h-4 w-4" />
            </Button>
            <Dialog>
                <DialogTrigger asChild>
                    <Button
                        variant="destructive"
                        aria-label={`Delete novel ${Id}`}
                    >
                        Delete <Trash2 className="h-4 w-4" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader className="space-y-2">
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription className="flex flex-col gap-1">
                            <span className="text-primary font-medium">
                                Deleting {category} : {title}
                            </span>
                            This action cannot be undone. This will permanently
                            delete the novel series along with the chapters.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            aria-label={`Delete novel ${Id}`}
                            onClick={() => handleDelete(Id)}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex gap-2 items-center">
                                    <Loader2 className="animate-spin" />{" "}
                                    Deleting...
                                </span>
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
