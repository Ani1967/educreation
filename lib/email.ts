import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendBookingConfirmationEmail(
  to: string,
  data: {
    parentName: string;
    studentName: string;
    studentClass: string;
    board: string;
    subject?: string;
    preferredTime?: string;
  }
) {
  try {
    await resend.emails.send({
      from: "EduCreators <support@educreators.org>",
      to: to,
      subject: `Booking Confirmed - ${data.studentName}`,
      html: `
        <h2>Thanks ${data.parentName}!</h2>
        <p>Your booking for <b>${data.studentName} - Class ${data.studentClass}</b> is received.</p>
        <p>We will WhatsApp you within 2 hours.</p>
      `,
    });
  } catch (e) {
    console.error("Customer email failed:", e);
  }
}

export async function sendOwnerBookingAlert(data: {
  id?: string;
  parentName: string;
  studentName: string;
  whatsapp: string;
  email: string;
  studentClass: string;
  board: string;
  subject?: string;
  preferredTime?: string;
  concern?: string;
}) {
  try {
    await resend.emails.send({
      from: "EduCreators <support@educreators.org>",
      to: "support@educreators.org",
      subject: `New Booking: ${data.studentName} - ${data.whatsapp}`,
      html: `
        <h2>New Booking: ${data.whatsapp}</h2>
        <p><b>ID:</b> ${data.id || "-"}</p>
        <p><b>Parent:</b> ${data.parentName}</p>
        <p><b>Student:</b> ${data.studentName} - Class ${data.studentClass} (${data.board})</p>
        <p><b>WhatsApp:</b> ${data.whatsapp}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Subject:</b> ${data.subject || "-"}</p>
        <p><b>Preferred Time:</b> ${data.preferredTime || "-"}</p>
        <p><b>Concern:</b> ${data.concern || "-"}</p>
        <hr>
        <p>WhatsApp this lead NOW from 8276926995</p>
      `,
    });
  } catch (e) {
    console.error("Owner alert failed:", e);
  }
}
