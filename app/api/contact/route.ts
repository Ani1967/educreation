import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message, subject } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email and message are required" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Notify Aniruddha
    await resend.emails.send({
      from: process.env.REPORT_FROM_EMAIL || "reports@educreators.org",
      to: "anirudhakar@gmail.com",
      subject: `[EduCreation Contact] ${subject || "New message"} — from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#eee;padding:32px;border-radius:12px;">
          <h2 style="color:#d4a843;margin:0 0 8px;">New Contact Message</h2>
          <p style="color:#666;margin:0 0 24px;font-size:13px;">Via educreators.org contact form</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="color:#888;font-size:13px;padding:8px 0;border-bottom:1px solid #1e1e1e;width:100px;">Name</td><td style="color:#fff;font-size:14px;padding:8px 0;border-bottom:1px solid #1e1e1e;">${name}</td></tr>
            <tr><td style="color:#888;font-size:13px;padding:8px 0;border-bottom:1px solid #1e1e1e;">Email</td><td style="font-size:14px;padding:8px 0;border-bottom:1px solid #1e1e1e;"><a href="mailto:${email}" style="color:#d4a843;">${email}</a></td></tr>
            <tr><td style="color:#888;font-size:13px;padding:8px 0;border-bottom:1px solid #1e1e1e;">Subject</td><td style="color:#fff;font-size:14px;padding:8px 0;border-bottom:1px solid #1e1e1e;">${subject || "General enquiry"}</td></tr>
          </table>
          <div style="margin-top:24px;background:#161616;border-left:3px solid #d4a843;border-radius:0 8px 8px 0;padding:16px 20px;">
            <p style="margin:0;color:#ccc;font-size:14px;line-height:1.7;">${message.replace(/\n/g, "<br/>")}</p>
          </div>
        </div>
      `,
    });

    // Auto-reply to sender
    await resend.emails.send({
      from: process.env.REPORT_FROM_EMAIL || "reports@educreators.org",
      to: email,
      subject: "We received your message — EduCreation",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#eee;padding:32px;border-radius:12px;">
          <h2 style="color:#d4a843;margin:0 0 8px;">EduCreation</h2>
          <p style="color:#666;margin:0 0 24px;font-size:13px;">We got your message</p>
          <p style="color:#ccc;font-size:14px;line-height:1.7;">Hi ${name},</p>
          <p style="color:#ccc;font-size:14px;line-height:1.7;">Thanks for reaching out. We've received your message and will get back to you within 24 hours.</p>
          <p style="color:#ccc;font-size:14px;line-height:1.7;">In the meantime, you can also WhatsApp us at <strong style="color:#d4a843;">+91 90524 16158</strong> for a faster response.</p>
          <p style="color:#555;font-size:12px;margin-top:32px;">— Team EduCreation · Kolkata, India</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact email error:", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
