import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const district = searchParams.get("district") || "Jashore"; // default JSTU

  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({
      temp: 32,
      description: "Sunny - Mock Data for Demo",
      district,
      note: "Add OPENWEATHER_API_KEY in Vercel to get live data"
    });
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${district},BD&units=metric&appid=${apiKey}`
    );
    const data = await res.json();

    return NextResponse.json({
      district: data.name,
      temp: data.main.temp,
      humidity: data.main.humidity,
      description: data.weather[0].description,
      advice: data.main.temp > 35? "Aj prochur pani din" : "Fosol er jonno valo din"
    });
  } catch (error) {
    return NextResponse.json({ error: "Weather fetch failed" }, { status: 500 });
  }
}
