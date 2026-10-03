export async function sendOwnerBookingAlert(data: any) {
  const html = `
    <h2>New Booking: ${data.whatsapp}</h2>
    <p><b>Booking ID:</b> ${data.id}</p>
    <p><b>Parent:</b> ${data.parentName}</p>
    <p><b>Student:</b> ${data.studentName} - Class ${data.studentClass} (${data.board})</p>
    <p><b>WhatsApp:</b> ${data.whatsapp}</p>
    <p><b>Email:</b> ${data.email}</p>
    <p><b>Subject:</b> ${data.subject || "-"}</p>
    <p><b>Preferred Time:</b> ${data.preferredTime || "-"}</p>
    <p><b>Concern:</b> ${data.concern || "-"}</p>
    <hr>
    <p>WhatsApp this lead now from 8276926995</p>
  `;

  // Using same resend you already use
  return resend.emails.send({
    from: "EduCreators <support@educreators.org>",
    to: "support@educreators.org",
    subject: `New Booking: ${data.studentName} - ${data.whatsapp}`,
    html,
  });
}
