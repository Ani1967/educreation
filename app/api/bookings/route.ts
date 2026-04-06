import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bookings } from "@/lib/db/schema";
import { sendBookingConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      parent_name,
      student_name,
      whatsapp,
      email,
      class: studentClass,
      board,
      subject,
      preferred_time,
      concern,
    } = body;

    if (!parent_name || !student_name || !whatsapp || !studentClass || !board) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [booking] = await db
      .insert(bookings)
      .values({
        parentName: parent_name,
        studentName: student_name,
        whatsapp,
        email: email || null,
        class: studentClass,
        board,
        subject: subject || null,
        preferredTime: preferred_time || null,
        concern: concern || null,
        source: "website",
      })
      .returning();

    // Send confirmation email if email was provided
    if (email) {
      sendBookingConfirmationEmail(email, {
        parentName: parent_name,
        studentName: student_name,
        studentClass,
        board,
        subject: subject || undefined,
        preferredTime: preferred_time || undefined,
      }).catch((e) => console.error("Booking email failed:", e));
    }

    return NextResponse.json({ success: true, id: booking.id });
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json(
      { error: "Failed to save booking" },
      { status: 500 }
    );
  }
}
