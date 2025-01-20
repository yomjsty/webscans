import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import db from "@/lib/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function page() {
    const coinBought = await db.transaction.findMany({
        where: {
            item: "coins",
            status: "completed",
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const coinSpent = await db.transaction.findMany({
        where: {
            item: "chapter",
            status: "completed",
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const totalCoinBoughtRupiah = coinBought.reduce((acc, transaction) => {
        return acc + transaction.price;
    }, 0);

    const totalCoinSpentRupiah = coinSpent.reduce((acc, transaction) => {
        return acc + transaction.price;
    }, 0);

    return (
        <div className="space-y-4">
            <div className="">
                <h1 className="text-2xl font-bold">Transactions</h1>
            </div>
            <Tabs defaultValue="tab-1">
                <TabsList className="h-auto gap-2 rounded-none border-b border-border bg-transparent px-0 py-1 text-foreground">
                    <TabsTrigger
                        value="tab-1"
                        className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                    >
                        Coin Bought
                    </TabsTrigger>
                    <TabsTrigger
                        value="tab-2"
                        className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                    >
                        Coin Spent
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="tab-1">
                    <Table className="border">
                        <TableHeader className="bg-transparent">
                            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                                <TableHead>Date</TableHead>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Price
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
                            {coinBought.map((transaction) => (
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
                                    <TableCell>{transaction.details}</TableCell>
                                    <TableCell>
                                        {transaction.quantity}
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        {transaction.status}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {transaction.price.toLocaleString(
                                            "id-ID"
                                        )}{" "}
                                        {transaction.item === "coins"
                                            ? "Rupiah"
                                            : "coins"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="border">
                        <div className="flex justify-between text-sm font-bold my-3 mx-3 ">
                            <div>Total</div>
                            <div>
                                {totalCoinBoughtRupiah.toLocaleString("id-ID")}{" "}
                                Rupiah
                            </div>
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="tab-2">
                    <Table className="border">
                        <TableHeader className="bg-transparent">
                            <TableRow className="*:border-border hover:bg-transparent [&>:not(:last-child)]:border-r">
                                <TableHead>Date</TableHead>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Item</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">
                                    Price
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
                            {coinSpent.map((transaction) => (
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
                                    <TableCell>{transaction.details}</TableCell>
                                    <TableCell>
                                        {transaction.quantity}
                                    </TableCell>
                                    <TableCell className="capitalize">
                                        {transaction.status}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {transaction.price.toLocaleString(
                                            "id-ID"
                                        )}{" "}
                                        {transaction.item === "coins"
                                            ? "Rupiah"
                                            : "coins"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="border">
                        <div className="flex justify-between text-sm font-bold my-3 mx-3 ">
                            <div>Total</div>
                            <div>
                                {totalCoinSpentRupiah.toLocaleString("id-ID")}{" "}
                                Coins
                            </div>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
