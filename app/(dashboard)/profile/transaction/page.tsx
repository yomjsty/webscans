import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getServerSession } from "@/actions/getServerSession";
import { redirect } from "next/navigation";
import db from "@/lib/db";

export default async function page() {
    const session = await getServerSession();

    if (!session) {
        redirect("/login");
    }

    const transactions = await db.transaction.findMany({
        where: {
            userId: session.user.id,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    return (
        <div>
            <Table>
                <TableHeader className="bg-transparent">
                    <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                        <TableHead>Date</TableHead>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
                    {transactions.map((transaction) => (
                        <TableRow
                            key={transaction.orderId}
                            className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r"
                        >
                            <TableCell className="font-medium">
                                {transaction.createdAt.toLocaleDateString()}
                            </TableCell>
                            <TableCell>{transaction.orderId}</TableCell>
                            <TableCell className="capitalize">
                                {transaction.type}
                            </TableCell>
                            <TableCell className="capitalize">
                                {transaction.item}
                            </TableCell>
                            <TableCell>{transaction.amount}</TableCell>
                            <TableCell>{transaction.quantity}</TableCell>
                            <TableCell className="capitalize">
                                {transaction.status}
                            </TableCell>
                            <TableCell className="text-right">
                                {transaction.price.toLocaleString("id-ID")}{" "}
                                {transaction.item === "coins"
                                    ? "Rupiah"
                                    : "coins"}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <p className="mt-4 text-center text-sm text-muted-foreground">
                Table with vertical lines
            </p>
        </div>
    );
}
