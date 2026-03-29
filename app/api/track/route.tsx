

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/configs/db";
import { pageViewTable } from "@/configs/schema";
import { eq, and } from "drizzle-orm";
import { UAParser } from "ua-parser-js";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("this is a track req body ",body);


    const parser = new UAParser(req.headers.get("user-agent") || "");
    const os = parser.getOS()?.name || "";
    const browser = parser.getBrowser()?.name || "";
    const device = parser.getDevice()?.model || "Desktop";

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      req.headers.get("x-real-ip") ||
      "0.0.0.0";

    // GEO LOCATION
    const geoRes = await fetch(`http://ip-api.com/json/${ip}`);
    const geo = await geoRes.json();

    const city = geo.city || "";
    const region = geo.regionName || "";
    const country = geo.country || "";

    const {
      type,
      websiteId,
      domain,
      visitorID,
      url,
      referrer,
      entryTime,
      exitTime,
      totalactivetime,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
      refparams
    } = body;

    /**
     * ENTRY EVENT
     */
    if (type === "entry") {
      await db.insert(pageViewTable).values({
        visitorID,
        websiteID: websiteId,
        domain,
        url,
        type,
        referrer,
        entryTime: entryTime?.toString(),

        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,

        refParams: refparams,

        device,
        os,
        browser,

        city,
        region,
        country,
        countryCode: geo.countryCode,
        latitude: geo.lat,
        longitude: geo.lon,


        ipAddress: ip
      });

      return NextResponse.json({ message: "Entry tracked" });
    }

    /**
     * EXIT EVENT
     */
    if (type === "exit") {
      await db
        .update(pageViewTable)
        .set({
          exitTime: exitTime?.toString(),
          totalActiveTime: totalactivetime
        })
        .where(
          and(
            eq(pageViewTable.visitorID, visitorID),
            eq(pageViewTable.websiteID, websiteId),
            eq(pageViewTable.url, url)
          )
        );

      return NextResponse.json({ message: "Exit tracked" });
    }

    return NextResponse.json({ message: "Unknown event" });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { error: "Tracking failed" },
      { status: 500 }
    );
  }
}