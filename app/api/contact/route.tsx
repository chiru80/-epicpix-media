import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    let name = "";
    let email = "";
    let company = "";
    let service = "";
    let budget = "";
    let timeline = "";
    let message = "";

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      name = body.name || "";
      email = body.email || "";
      company = body.company || "";
      service = body.service || "";
      budget = body.budget || "";
      timeline = body.timeline || "";
      message = body.message || "";
    } else {
      const formData = await request.formData();
      name = (formData.get("name") as string) || "";
      email = (formData.get("email") as string) || "";
      company = (formData.get("company") as string) || "";
      service = (formData.get("service") as string) || "";
      budget = (formData.get("budget") as string) || "";
      timeline = (formData.get("timeline") as string) || "";
      message = (formData.get("message") as string) || "";
    }

    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    try {
      const supabase = createClient();
      await supabase.from("inquiries").insert({
        name,
        email,
        company,
        service,
        budget,
        timeline,
        message,
        status: "lead",
      });
    } catch (dbError) {
      console.warn("Could not insert inquiry into database:", dbError);
    }

    // Redirect to contact page with success parameter if form was standard submit
    if (!contentType.includes("application/json")) {
      return NextResponse.redirect(new URL("/contact?success=true", request.url));
    }

    return NextResponse.json({ success: true, message: "Inquiry received" });
  } catch (error: any) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to submit inquiry" },
      { status: 500 }
    );
  }
}

