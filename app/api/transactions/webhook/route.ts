import { NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { order_id, transaction_status } = body;

    console.log("Webhook received:", body);

    // Cek transaksi di database
    const transaction = await db.transaction.findUnique({
      where: { orderId: order_id },
    });

    if (!transaction) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    // Update transaksi jika berhasil
    if (transaction_status === "settlement") {
      await db.$transaction([
        db.transaction.update({
          where: { orderId: order_id },
          data: { status: "completed" },
        }),
        db.user.update({
          where: { id: transaction.userId },
          data: { coins: { increment: transaction.amount } },
        }),
      ]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
