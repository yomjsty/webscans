import { snap } from "@/lib/midtrans";
import db from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers()
    });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const body = await req.json();
        const { coinAmount, price } = body;

        if (!coinAmount || coinAmount < 1) {
            return NextResponse.json({ error: "Invalid coin amount" }, { status: 400 });
        }

        if (!price || price <= 0) {
            return NextResponse.json({ error: "Invalid price" }, { status: 400 });
        }

        // Generate unique Order ID
        const orderId = `order-${Date.now()}`;

        // Detail item untuk Midtrans
        const itemDetails = [
            {
                id: `coins-${coinAmount}`,
                name: `${coinAmount} coins`,
                price: price,
                quantity: 1,
            }
        ];

        // Pastikan gross_amount = total dari item_details
        const totalPrice = itemDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Buat transaksi Midtrans
        const transaction = await snap.createTransaction({
            transaction_details: {
                order_id: orderId,
                gross_amount: totalPrice, // ✅ Pastikan sesuai dengan total item_details
            },
            item_details: itemDetails,
            customer_details: {
                email: session.user.email,
                first_name: session.user.name,
                id: session.user.id,
                shipping_address: {
                  first_name: session.user.name,
                },
            },
        });

        // Simpan transaksi ke database
        await db.transaction.create({
            data: {
                userId: session.user.id,
                orderId,
                amount: coinAmount,
                type: "buy",
                item: `coins`,
                details: `${coinAmount} coins`,
                status: "pending",
                quantity: 1,
                price: totalPrice,
            },
        });

        return NextResponse.json({ paymentUrl: transaction.redirect_url });
    } catch (error) {
        console.error("Midtrans Error:", error);
        return NextResponse.json({ error: "Failed to create transaction from route" }, { status: 500 });
    }
}
