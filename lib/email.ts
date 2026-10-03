import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

// Existing - keep it
export async function sendBookingConfirmationEmail(to: string, data: any) {
  try {
    await resend.emails.send({
      from: "EduCreators <support@educreators.org>",
      to,
      subject: `Booking Confirmed - ${data.studentName}`,
      html: `<p>Thanks ${data.parentName}! Booking for ${data.studentName} received. We will WhatsApp you within 2 hours.</p>`,
    });
  } catch (e) { console.error(e); }
}

// Existing - you deleted this, that's why build failed - RESTORE IT
export async function sendWeeklyReportEmail(to: string, data: any) {
  try {
    await resend.emails.send({
      from: "EduCreators <support@educreators.org>",
      to,
      subject: `Weekly Report`,
      html: `<p>Weekly report for ${data.studentName || ""}</p>`,
    });
  } catch (e) { console.error(e); }
}

// NEW - owner alert for your 9052416158 test
export async function sendOwnerBookingAlert(data: any) {
  try {
    await resend.emails.send({
      from: "EduCreators <support@educreators.org>",
      to: "support@educreators.org",
      subject: `New Booking: ${data.studentName} - ${data.whatsapp}`,
      html: `
        <h2>New Booking: ${data.whatsapp}</h2>
        <p><b>ID:</b> ${data.id}</p>
        <p><b>Parent:</b> ${data.parentName}</p>
        <p><b>Student:</b> ${data.studentName} - Class ${data.studentClass} (${data.board})</p>
        <p><b>WhatsApp:</b> ${data.whatsapp}</p>
        <p><b>Email:</b> ${data.email}</p>
      `,
    });
  } catch (e) { console.error(e); }
}
