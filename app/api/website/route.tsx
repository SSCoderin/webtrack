import { NextRequest, NextResponse } from "next/server";
import { eq, and, or, ilike } from "drizzle-orm";

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
    } = body;
    const userEmail = user.primaryEmailAddress?.emailAddress;

    // 2️⃣ Basic Validation
    if (!domain || !timeZone || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    let cleanDomain = domain
      .replace(/^https?:\/\//, "") // remove http:// or https://
      .replace(/\/$/, ""); // remove trailing slash

    const domainRegex =
      /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$|^localhost(?::\d+)?$/;

    if (!domainRegex.test(cleanDomain)) {
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
  const clerkUser = await currentUser();

  if (!clerkUser || !clerkUser.primaryEmailAddress?.emailAddress) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = clerkUser.primaryEmailAddress.emailAddress;

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");

    let query = db
      .select()
      .from(websiteTable)
      .where(eq(websiteTable.userEmail, email));

    // If search exists → filter by domain OR timezone
    if (search) {
      query = db
        .select()
        .from(websiteTable)
        .where(
          and(
            eq(websiteTable.userEmail, email),
            or(
              ilike(websiteTable.domain, `%${search}%`),
              ilike(websiteTable.timeZone, `%${search}%`)
            )
          )
        );
    }

    const websites = await query;

    return NextResponse.json(
      { data: websites },
      { status: 200 }
    );

  } catch (error) {
    console.error("GET /api/website error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // 1️⃣ Get logged-in user
    const clerkUser = await currentUser();

    if (!clerkUser || !clerkUser.primaryEmailAddress?.emailAddress) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const email = clerkUser.primaryEmailAddress.emailAddress;

    // 2️⃣ Get websiteId from query params
    const { searchParams } = new URL(req.url);
    const websiteId = searchParams.get("websiteId");

    if (!websiteId) {
      return NextResponse.json(
        { error: "websiteId is required" },
        { status: 400 }
      );
    }

    // 3️⃣ Check if website exists and belongs to user
    const existing = await db
      .select()
      .from(websiteTable)
      .where(eq(websiteTable.websiteId, websiteId));

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Website not found" },
        { status: 404 }
      );
    }

    if (existing[0].userEmail !== email) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    // 4️⃣ Delete website
    await db
      .delete(websiteTable)
      .where(eq(websiteTable.websiteId, websiteId));

    return NextResponse.json(
      { message: "Website deleted successfully" },
      { status: 200 }
    );

  } catch (error) {
    console.error("DELETE /api/websites error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
