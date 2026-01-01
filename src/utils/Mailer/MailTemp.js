export const mailTemp = ({ title = "Verify your account", otp }) => {
  const safeOtp = String(otp ?? "").trim();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>

<body style="margin:0; padding:0; background:#F4F6FB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">

  <!-- Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F4F6FB; padding:40px 0;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px; width:100%; background:#FFFFFF; border-radius:16px; overflow:hidden; box-shadow:0 8px 28px rgba(18, 38, 63, 0.12);">

          <!-- Header -->
          <tr>
            <td style="padding:22px 26px; background:linear-gradient(135deg, #0F172A, #1D4ED8);">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left">
                    <img width="120"
                      src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"
                      alt="Logo" style="display:block; border:0; outline:none;">
                  </td>
                  <td align="right">
                    <a href="http://localhost:4200/#/" target="_blank"
                      style="color:#E0E7FF; text-decoration:none; font-size:14px; font-weight:500;">
                      View in Website →
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:34px 32px 26px 32px; text-align:center;">

              <!-- Icon -->
              <div style="width:72px; height:72px; border-radius:18px; background:#EEF2FF; margin:0 auto 18px auto; display:flex; align-items:center; justify-content:center;">
                <img width="34" height="34"
                  src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png"
                  alt="OTP" style="display:block;">
              </div>

              <h1 style="margin:0; font-size:26px; line-height:1.25; color:#0F172A; font-weight:700;">
                ${title}
              </h1>

              <p style="margin:14px 0 0 0; font-size:15px; line-height:1.65; color:#475569;">
                Use the verification code below to continue. This code is valid for <b>10 minutes</b>.
              </p>

              <!-- OTP Box -->
              <div style="margin:22px auto 10px auto; padding:16px 18px; background:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; display:inline-block;">
                <span style="font-size:26px; letter-spacing:8px; font-weight:800; color:#0F172A; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;">
                  ${safeOtp}
                </span>
              </div>

              <p style="margin:10px 0 0 0; font-size:13px; color:#64748B; line-height:1.6;">
                Don’t share this code with anyone. Our team will never ask you for it.
              </p>

            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 32px;">
              <div style="height:1px; background:#E2E8F0;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:22px 32px 30px 32px; text-align:center;">

              <h3 style="margin:0; font-size:15px; color:#0F172A; font-weight:700;">
                Stay in touch
              </h3>

              <p style="margin:10px 0 18px 0; font-size:13px; color:#64748B;">
                Follow us for updates, tips, and releases.
              </p>

              <!-- Social -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                <tr>
                  <td style="padding:0 8px;">
                    <a href="${
                      process.env.facebookLink
                    }" style="text-decoration:none;">
                      <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="40" height="40" alt="Facebook" style="display:block;">
                    </a>
                  </td>

                  <td style="padding:0 8px;">
                    <a href="${
                      process.env.instegram
                    }" style="text-decoration:none;">
                      <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="40" height="40" alt="Instagram" style="display:block;">
                    </a>
                  </td>

                  <td style="padding:0 8px;">
                    <a href="${
                      process.env.twitterLink
                    }" style="text-decoration:none;">
                      <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="40" height="40" alt="Twitter" style="display:block;">
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:22px 0 0 0; font-size:12px; color:#94A3B8; line-height:1.6;">
                If you didn’t request this code, you can safely ignore this email.
              </p>

            </td>
          </tr>

        </table>

        <!-- Bottom spacing -->
        <div style="height:22px;"></div>

        <!-- Tiny footer -->
        <p style="margin:0; font-size:12px; color:#94A3B8;">
          © ${new Date().getFullYear()} Your App. All rights reserved.
        </p>

      </td>
    </tr>
  </table>
</body>
</html>`;
};
