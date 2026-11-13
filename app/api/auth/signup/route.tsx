import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

// Sign up endpoint for new users
export async function POST(request: NextRequest) {
  const supabase = createClient();
  
  try {
    const body = await request.json();
    const { email, password, fullName, role } = body;
    
    // Validate input
    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { error: "Email, password, full name, and role are required" },
        { status: 400 }
      );
    }
    
    // Validate role
    const validRoles = ["CLIENT", "FREELANCER"];
    if (!validRoles.includes(role.toUpperCase())) {
      return NextResponse.json(
        { error: "Invalid role. Must be CLIENT or FREELANCER" },
        { status: 400 }
      );
    }
    
    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role.toUpperCase(),
        },
      },
    });
    
    if (authError) {
      console.error("Signup error:", authError);
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      );
    }
    
    // The user will be auto-created in users table by database trigger
    // Return success - user needs to verify email
    return NextResponse.json({
      success: true,
      message: "Account created! Please check your email to verify.",
      user: {
        id: authData.user?.id,
        email: authData.user?.email,
        full_name: fullName,
        role,
      },
    });
  } catch (error) {
    console.error("Unexpected signup error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}

// GET endpoint for role options
export async function GET() {
  return NextResponse.json({
    roles: ["CLIENT", "FREELANCER"],
  });
}
