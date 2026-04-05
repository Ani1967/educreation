import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

export interface WeeklyReportEmailData {
  parentName: string;
  studentName: string;
  studentClass: string;
  studentBoard: string;
  mentorName: string;
  weekLabel: string;         // e.g. "31 Mar – 6 Apr 2026"
  sessionsCompleted: number;
  conceptsCovered: string[];
  progressSummary: string;
  mentorNote: string;
  dashboardUrl: string;
}

export function buildWeeklyReportHtml(data: WeeklyReportEmailData): string {
  const {
    parentName, studentName, studentClass, studentBoard,
    mentorName, weekLabel, sessionsCompleted,
    conceptsCovered, progressSummary, mentorNote, dashboardUrl,
  } = data;

  const conceptChips = conceptsCovered.length > 0
    ? conceptsCovered.map((c) => `
        <span style="display:inline-block;padding:4px 12px;background:#1a1a3a;border:1px solid #2a2a5a;border-radius:20px;color:#8899ff;font-size:13px;margin:3px 4px 3px 0;">${c}</span>
      `).join("")
    : `<span style="color:#555;font-size:14px;">No concepts logged this week.</span>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Weekly Report — ${studentName}</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#1a1500,#0a0a0a);border:1px solid #2a2a1a;border-radius:16px 16px 0 0;padding:32px 40px;">
            <div style="font-size:22px;font-weight:800;color:#d4a843;letter-spacing:-0.5px;">EduCreation</div>
            <div style="font-size:13px;color:#666;margin-top:4px;">Weekly Progress Report</div>
            <div style="font-size:13px;color:#555;margin-top:8px;">${weekLabel}</div>
          </td>
        </tr>

        <!-- Greeting -->
        <tr>
          <td style="background:#111;border-left:1px solid #1e1e1e;border-right:1px solid #1e1e1e;padding:32px 40px 24px;">
            <p style="margin:0 0 8px;font-size:18px;font-weight:700;color:#fff;">
              Hi ${parentName} 👋
            </p>
            <p style="margin:0;font-size:14px;color:#888;line-height:1.6;">
              Here's ${studentName}'s learning update for the week — ${studentClass}, ${studentBoard}.
              Mentor: <strong style="color:#aaa;">${mentorName}</strong>
            </p>
          </td>
        </tr>

        <!-- Stats bar -->
        <tr>
          <td style="background:#111;border-left:1px solid #1e1e1e;border-right:1px solid #1e1e1e;padding:0 40px 24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td width="50%" style="background:#161616;border:1px solid #1e1e1e;border-radius:10px;padding:16px 20px;text-align:center;">
                  <div style="font-size:32px;font-weight:800;color:#d4a843;">${sessionsCompleted}</div>
                  <div style="font-size:12px;color:#555;margin-top:4px;">Sessions Completed</div>
                </td>
                <td width="8px"></td>
                <td width="50%" style="background:#161616;border:1px solid #1e1e1e;border-radius:10px;padding:16px 20px;text-align:center;">
                  <div style="font-size:32px;font-weight:800;color:#d4a843;">${conceptsCovered.length}</div>
                  <div style="font-size:12px;color:#555;margin-top:4px;">Concepts Covered</div>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Concepts covered -->
        <tr>
          <td style="background:#111;border-left:1px solid #1e1e1e;border-right:1px solid #1e1e1e;padding:0 40px 24px;">
            <div style="font-size:11px;font-weight:700;color:#444;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;">
              What Was Covered
            </div>
            <div>${conceptChips}</div>
          </td>
        </tr>

        <!-- Progress summary -->
        ${progressSummary ? `
        <tr>
          <td style="background:#111;border-left:1px solid #1e1e1e;border-right:1px solid #1e1e1e;padding:0 40px 24px;">
            <div style="font-size:11px;font-weight:700;color:#444;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:10px;">
              Progress This Week
            </div>
            <p style="margin:0;font-size:14px;color:#bbb;line-height:1.8;">${progressSummary}</p>
          </td>
        </tr>` : ""}

        <!-- Mentor note -->
        ${mentorNote ? `
        <tr>
          <td style="background:#111;border-left:1px solid #1e1e1e;border-right:1px solid #1e1e1e;padding:0 40px 24px;">
            <div style="background:#161616;border-left:3px solid #d4a843;border-radius:0 10px 10px 0;padding:16px 20px;">
              <div style="font-size:11px;font-weight:700;color:#666;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">
                A note from ${mentorName}
              </div>
              <p style="margin:0;font-size:14px;color:#ccc;line-height:1.7;font-style:italic;">"${mentorNote}"</p>
            </div>
          </td>
        </tr>` : ""}

        <!-- CTA -->
        <tr>
          <td style="background:#111;border-left:1px solid #1e1e1e;border-right:1px solid #1e1e1e;padding:0 40px 32px;text-align:center;">
            <a href="${dashboardUrl}" style="display:inline-block;padding:12px 28px;background:linear-gradient(135deg,#d4a843,#f0c060);border-radius:8px;color:#000;font-weight:700;font-size:14px;text-decoration:none;">
              View Full Dashboard →
            </a>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#0d0d0d;border:1px solid #1a1a1a;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
            <p style="margin:0;font-size:12px;color:#444;line-height:1.6;">
              EduCreation · Personalised Learning for CBSE &amp; ICSE Students<br/>
              You're receiving this because you're registered as a parent on our platform.<br/>
              <a href="${dashboardUrl}" style="color:#666;text-decoration:none;">Manage preferences</a>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function sendWeeklyReportEmail(
  to: string,
  data: WeeklyReportEmailData
): Promise<{ id?: string; error?: string }> {
  const html = buildWeeklyReportHtml(data);

  const { data: result, error } = await resend.emails.send({
    from: process.env.REPORT_FROM_EMAIL || "reports@educreators.org",
    to,
    subject: `${data.studentName}'s Weekly Learning Report — ${data.weekLabel}`,
    html,
  });

  if (error) return { error: error.message };
  return { id: result?.id };
}
