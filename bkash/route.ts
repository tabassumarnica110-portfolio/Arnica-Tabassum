import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const { productId, quantity, buyerId, paymentMethod } = await req.json();

  // 1. Product er dam ber koro
  const { data: product } = await supabase
   .from("Product")
   .select("price, farmerId")
   .eq("id", productId)
   .single();

  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  const totalAmount = product.price * quantity;

  // 2. Order create koro (bKash hole Pending Payment)
  const { data: order, error } = await supabase
   .from("Order")
   .insert({
      buyerId,
      productId,
      quantity,
      totalAmount,
      paymentMethod, // "bkash" or "cod"
      status: paymentMethod === "bkash"? "PENDING_PAYMENT" : "PENDING",
      farmerId: product.farmerId,
    })
   .select()
   .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // 3. Sir ke demo dekhano jonno fake bKash URL
  if (paymentMethod === "bkash") {
    return NextResponse.json({
      success: true,
      orderId: order.id,
      bkashURL: `https://checkout.bka.sh/test?amount=${totalAmount}&order=${order.id}`,
      message: "bKash Test Mode - No real money deducted",
    });
  }

  return NextResponse.json({ success: true, order });
}
