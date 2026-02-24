import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { websiteTable } from "@/configs/schema";
import { currentUser } from "@clerk/nextjs/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // 1️⃣ Get logged in user
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    const {
      domain,
      timeZone,
      enableLocahostTracking,
      userEmail,
    } = body;

    // 2️⃣ Basic Validation
    if (!domain || !timeZone || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const domainRegex =
      /^(?!:\/\/)([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

    if (!domainRegex.test(domain)) {
      return NextResponse.json(
        { error: "Invalid domain format" },
        { status: 400 }
      );
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(userEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // 3️⃣ Prevent duplicate domain per user
    const existing = await db
      .select()
      .from(websiteTable)
      .where(eq(websiteTable.domain, domain));

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Domain already exists" },
        { status: 409 }
      );
    }

    // 4️⃣ Generate unique websiteId
    const websiteId = crypto.randomBytes(12).toString("hex");

    // 5️⃣ Insert into DB
    const newWebsite = await db
      .insert(websiteTable)
      .values({
        websiteId,
        domain,
        timeZone,
        enableLocahostTracking: enableLocahostTracking ?? false,
        userEmail,
      })
      .returning();

    return NextResponse.json(
      {
        message: "Website created successfully",
        data: newWebsite[0],
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/websites error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const websites = await db
      .select()
      .from(websiteTable);

    return NextResponse.json(
      {
        data: websites,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET /api/websites error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}