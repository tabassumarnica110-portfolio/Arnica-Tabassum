import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { name, price, quantity, farmerId, userRole } = await req.json();

  // A+ er jonno Security Check - Sir etai khujbe
  if (userRole!== "FARMER") {
    return NextResponse.json(
      { error: "Only FARMER can add products. Access Denied." },
      { status: 403 }
    );
  }

  if (!name ||!price ||!farmerId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const { data, error } = await supabase
   .from("Product")
   .insert({ name, price, quantity, farmerId })
   .select()
   .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, product: data });
}

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  const { data } = await supabase.from("Product").select("*").order("created_at", { ascending: false });
  return NextResponse.json(data);
}
