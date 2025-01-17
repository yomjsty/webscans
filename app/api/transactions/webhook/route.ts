import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let orderId: string;
  let transactionStatus: string;

  try {
    const body = await req.json();
    orderId = body.order_id;
    transactionStatus = body.transaction_status;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const transaction = await db.transaction.findUnique({
    where: { id: orderId },
  });

  if (!transaction) {
    return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
  }

  if (transactionStatus === "settlement") {
    try {
      await db.$transaction([
        db.transaction.update({
          where: { id: orderId },
          data: { status: "completed" },
        }),
        db.user.update({
          where: { id: transaction.userId },
          data: { coins: { increment: transaction.amount } },
        }),
      ]);
    } catch {
      return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
