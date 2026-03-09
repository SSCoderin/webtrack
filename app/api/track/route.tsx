import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/configs/db";
import { pageViewTable } from "@/configs/schema";
import { UAParser } from "ua-parser-js";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parser = new UAParser(req.headers.get("user-agent") || "") ;
        const osInfo = parser.getOS()?.name;
        const browserInfo = parser.getBrowser()?.name;
        const deviceInfo = parser.getDevice()?.model;
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || req.headers.get('x-real-ip') || '71.23.12.54'

        const geore = await fetch(`http://ip-api.com/json/${ip}`)
        const geoInfo = await geore.json()
             


        console.log("Received data:", body);
        console.log("OS Information:", osInfo);
        console.log("Browser Information:", browserInfo);
        console.log("deviceInfo", deviceInfo)
        console.log("geoInfo", geoInfo)
        console.log("ip", ip)

        return NextResponse.json(
            {
                message: "Data received successfully",
                data: body
            },
            { status: 200 }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}