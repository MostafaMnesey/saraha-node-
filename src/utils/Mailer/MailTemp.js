export const mailTemp = ({ title = "Verify your account", otp, text, username = "there" }) => {
  const safeOtp = String(otp ?? "").trim();
  const otpDigits = safeOtp.split("");
  const currentYear = new Date().getFullYear();

  // Generate OTP boxes HTML
  const otpBoxesHtml = otpDigits.length > 0
    ? otpDigits.map((digit, index) => `
        <td style="padding:0 4px;">
          <div style="
            width:48px; 
            height:58px; 
            background: linear-gradient(145deg, #F8FAFC, #EEF2FF);
            border: 2px solid #C7D2FE;
            border-radius:12px; 
            font-size:28px; 
            font-weight:800; 
            color:#1E40AF;
            line-height:58px;
            text-align:center;
            font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          ">${digit}</div>
        </td>
      `).join("")
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light dark" />
  <meta name="supported-color-schemes" content="light dark" />
  <title>${title}</title>
  
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  
  <style>
    /* Reset & Base */
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    
    /* Animations */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    
    @keyframes shimmer {
      0% { background-position: -1000px 0; }
      100% { background-position: 1000px 0; }
    }
    
    .animated-card {
      animation: fadeIn 0.6s ease-out;
    }
    
    .otp-box:hover {
      transform: scale(1.05);
      transition: transform 0.2s ease;
    }
    
    /* Responsive */
    @media only screen and (max-width: 620px) {
      .email-container {
        width: 100% !important;
        margin: 0 auto !important;
      }
      
      .fluid {
        width: 100% !important;
        max-width: 100% !important;
        height: auto !important;
      }
      
      .stack-column {
        display: block !important;
        width: 100% !important;
        max-width: 100% !important;
      }
      
      .mobile-padding {
        padding-left: 20px !important;
        padding-right: 20px !important;
      }
      
      .otp-digit {
        width: 40px !important;
        height: 50px !important;
        font-size: 22px !important;
        line-height: 50px !important;
      }
    }
    
    /* Dark Mode */
    @media (prefers-color-scheme: dark) {
      .dark-bg { background-color: #1a1a2e !important; }
      .dark-card { background-color: #16213e !important; }
      .dark-text { color: #e4e4e7 !important; }
      .dark-muted { color: #a1a1aa !important; }
    }
  </style>
</head>

<body style="margin:0; padding:0; background:#F0F4FF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">

  <!-- Preview Text -->
  <div style="display:none; font-size:1px; color:#F0F4FF; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
    ${otp ? `Your verification code is ${safeOtp}. Valid for 10 minutes.` : title}
    &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847; &#847;
  </div>

  <!-- Main Wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="dark-bg" style="background: linear-gradient(180deg, #F0F4FF 0%, #E0E7FF 100%); min-height:100vh;">
    <tr>
      <td align="center" style="padding:40px 15px;">

        <!-- Email Container -->
        <table role="presentation" class="email-container animated-card" width="600" cellpadding="0" cellspacing="0" border="0"
          style="max-width:600px; width:100%; background:#FFFFFF; border-radius:24px; overflow:hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255,255,255,0.1);">

          <!-- Decorative Top Bar -->
          <tr>
            <td style="height:6px; background: linear-gradient(90deg, #6366F1, #8B5CF6, #EC4899, #6366F1); background-size: 300% 100%; animation: shimmer 3s ease-in-out infinite;"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding:0;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background: linear-gradient(135deg, #0F172A 0%, #1E3A8A 50%, #3730A3 100%);">
                <tr>
                  <td style="padding:32px 40px;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="left" valign="middle">
                          <!-- Logo -->
                          <table cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="background: rgba(255,255,255,0.15); border-radius:12px; padding:10px 14px;">
                                <img width="110"
                                  src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"
                                  alt="Logo" style="display:block; border:0; outline:none;">
                              </td>
                            </tr>
                          </table>
                        </td>
                        <td align="right" valign="middle">
                          <a href="${process.env.FRONTEND_URL || 'http://localhost:4200'}/#/" target="_blank"
                            style="display:inline-block; padding:12px 20px; background: rgba(255,255,255,0.15); border-radius:10px; color:#E0E7FF; text-decoration:none; font-size:13px; font-weight:600; backdrop-filter: blur(10px); border:1px solid rgba(255,255,255,0.2); transition: all 0.3s ease;">
                            🌐 Open Dashboard
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                
                <!-- Wave Decoration -->
                <tr>
                  <td style="font-size:0; line-height:0;">
                    <svg viewBox="0 0 600 40" style="display:block; width:100%;">
                      <path d="M0,40 L0,20 Q150,0 300,20 T600,20 L600,40 Z" fill="#FFFFFF"/>
                    </svg>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body Content -->
          <tr>
            <td class="mobile-padding" style="padding:20px 48px 36px 48px;">

              <!-- Icon Badge -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px auto;">
                <tr>
                  <td align="center">
                    <div style="
                      width:90px; 
                      height:90px; 
                      background: linear-gradient(145deg, #EEF2FF, #E0E7FF);
                      border-radius:22px; 
                      box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.3), inset 0 1px 0 rgba(255,255,255,0.8);
                      text-align:center;
                      line-height:90px;
                    ">
                      ${otp ? `
                        <span style="font-size:42px;">🔐</span>
                      ` : `
                        <span style="font-size:42px;">✉️</span>
                      `}
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Greeting -->
              <p style="margin:0 0 8px 0; font-size:15px; color:#6366F1; font-weight:600; text-transform:uppercase; letter-spacing:1.5px; text-align:center;">
                ${otp ? "Verification Required" : "Hello!"}
              </p>

              <!-- Title -->
              <h1 style="margin:0 0 16px 0; font-size:30px; line-height:1.3; color:#0F172A; font-weight:800; text-align:center; letter-spacing:-0.5px;">
                ${title}
              </h1>

              <!-- Subtitle -->
              <p style="margin:0 0 28px 0; font-size:16px; line-height:1.7; color:#64748B; text-align:center;">
                Hi <strong style="color:#0F172A;">${username}</strong>, 
                ${otp
      ? "we received a request to verify your account. Use the code below to continue:"
      : "thank you for being with us."}
              </p>

              ${otp ? `
              <!-- OTP Section -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 24px auto;">
                <tr>
                  <td align="center">
                    <div style="background: linear-gradient(145deg, #FAFBFF, #F0F4FF); border-radius:20px; padding:28px 20px; border: 1px solid #E0E7FF;">
                      
                      <!-- OTP Digits -->
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                        <tr>
                          ${otpBoxesHtml}
                        </tr>
                      </table>
                      
                      <!-- Timer Badge -->
                      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:18px auto 0 auto;">
                        <tr>
                          <td style="background: linear-gradient(135deg, #FEF3C7, #FDE68A); padding:8px 16px; border-radius:50px;">
                            <span style="font-size:13px; color:#92400E; font-weight:600;">
                              ⏱️ Expires in 10 minutes
                            </span>
                          </td>
                        </tr>
                      </table>
                      
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px auto;">
                <tr>
                  <td style="background: #FEF2F2; border-radius:12px; padding:16px 20px; border-left:4px solid #EF4444;">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding-right:12px;">
                          <span style="font-size:20px;">🛡️</span>
                        </td>
                        <td>
                          <p style="margin:0; font-size:13px; color:#991B1B; line-height:1.5; font-weight:500;">
                            <strong>Security Tip:</strong> Never share this code with anyone. Our team will never ask for your verification code.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
              ` : ""}

              ${text ? `
              <!-- Custom Message -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px auto;">
                <tr>
                  <td style="background: linear-gradient(145deg, #F0FDF4, #DCFCE7); border-radius:16px; padding:24px; border:1px solid #BBF7D0;">
                    <p style="margin:0; font-size:15px; color:#166534; line-height:1.7; text-align:center;">
                      ${text}
                    </p>
                  </td>
                </tr>
              </table>
              ` : ""}

              <!-- CTA Button -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:10px auto 0 auto;">
                <tr>
                  <td align="center">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:4200'}/#/" target="_blank"
                      style="
                        display:inline-block; 
                        padding:16px 40px; 
                        background: linear-gradient(135deg, #6366F1 0%, #4F46E5 50%, #4338CA 100%);
                        border-radius:14px; 
                        color:#FFFFFF; 
                        text-decoration:none; 
                        font-size:15px; 
                        font-weight:700;
                        box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.5), 0 4px 6px -2px rgba(99, 102, 241, 0.3);
                        letter-spacing:0.3px;
                      ">
                      Go to Dashboard →
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Features Section -->
          <tr>
            <td class="mobile-padding" style="padding:0 48px 36px 48px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <!-- Feature 1 -->
                  <td width="33%" style="text-align:center; padding:0 8px;">
                    <div style="background:#F0FDF4; border-radius:14px; padding:20px 12px;">
                      <span style="font-size:28px;">🔒</span>
                      <p style="margin:10px 0 0 0; font-size:12px; color:#166534; font-weight:600;">Secure</p>
                    </div>
                  </td>
                  <!-- Feature 2 -->
                  <td width="33%" style="text-align:center; padding:0 8px;">
                    <div style="background:#EFF6FF; border-radius:14px; padding:20px 12px;">
                      <span style="font-size:28px;">⚡</span>
                      <p style="margin:10px 0 0 0; font-size:12px; color:#1E40AF; font-weight:600;">Fast</p>
                    </div>
                  </td>
                  <!-- Feature 3 -->
                  <td width="33%" style="text-align:center; padding:0 8px;">
                    <div style="background:#FDF4FF; border-radius:14px; padding:20px 12px;">
                      <span style="font-size:28px;">💎</span>
                      <p style="margin:10px 0 0 0; font-size:12px; color:#86198F; font-weight:600;">Premium</p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 48px;">
              <div style="height:1px; background: linear-gradient(90deg, transparent, #E2E8F0, transparent);"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td class="mobile-padding" style="padding:36px 48px; background: linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%);">

              <!-- Stay Connected -->
              <h3 style="margin:0 0 8px 0; font-size:18px; color:#0F172A; font-weight:700; text-align:center;">
                Stay Connected
              </h3>
              
              <p style="margin:0 0 24px 0; font-size:14px; color:#64748B; text-align:center; line-height:1.6;">
                Follow us for the latest updates, tips, and exclusive offers.
              </p>

              <!-- Social Icons -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 28px auto;">
                <tr>
                  <td style="padding:0 6px;">
                    <a href="${process.env.facebookLink || '#'}" target="_blank" style="text-decoration:none;">
                      <div style="width:48px; height:48px; background: linear-gradient(145deg, #1877F2, #0C63D4); border-radius:14px; text-align:center; line-height:48px; box-shadow: 0 4px 12px rgba(24, 119, 242, 0.4);">
                        <img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" width="22" height="22" alt="Facebook" style="vertical-align:middle;">
                      </div>
                    </a>
                  </td>
                  
                  <td style="padding:0 6px;">
                    <a href="${process.env.instegram || '#'}" target="_blank" style="text-decoration:none;">
                      <div style="width:48px; height:48px; background: linear-gradient(145deg, #E4405F, #C13584, #833AB4); border-radius:14px; text-align:center; line-height:48px; box-shadow: 0 4px 12px rgba(228, 64, 95, 0.4);">
                        <img src="https://cdn-icons-png.flaticon.com/512/2111/2111463.png" width="22" height="22" alt="Instagram" style="vertical-align:middle;">
                      </div>
                    </a>
                  </td>
                  
                  <td style="padding:0 6px;">
                    <a href="${process.env.twitterLink || '#'}" target="_blank" style="text-decoration:none;">
                      <div style="width:48px; height:48px; background: linear-gradient(145deg, #1DA1F2, #0C85D0); border-radius:14px; text-align:center; line-height:48px; box-shadow: 0 4px 12px rgba(29, 161, 242, 0.4);">
                        <img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" width="22" height="22" alt="Twitter" style="vertical-align:middle;">
                      </div>
                    </a>
                  </td>
                  
                  <td style="padding:0 6px;">
                    <a href="${process.env.linkedinLink || '#'}" target="_blank" style="text-decoration:none;">
                      <div style="width:48px; height:48px; background: linear-gradient(145deg, #0A66C2, #004182); border-radius:14px; text-align:center; line-height:48px; box-shadow: 0 4px 12px rgba(10, 102, 194, 0.4);">
                        <img src="https://cdn-icons-png.flaticon.com/512/3536/3536505.png" width="22" height="22" alt="LinkedIn" style="vertical-align:middle;">
                      </div>
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Help Links -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto 20px auto;">
                <tr>
                  <td style="padding:0 12px;">
                    <a href="#" style="font-size:13px; color:#6366F1; text-decoration:none; font-weight:500;">Help Center</a>
                  </td>
                  <td style="color:#CBD5E1;">•</td>
                  <td style="padding:0 12px;">
                    <a href="#" style="font-size:13px; color:#6366F1; text-decoration:none; font-weight:500;">Privacy Policy</a>
                  </td>
                  <td style="color:#CBD5E1;">•</td>
                  <td style="padding:0 12px;">
                    <a href="#" style="font-size:13px; color:#6366F1; text-decoration:none; font-weight:500;">Unsubscribe</a>
                  </td>
                </tr>
              </table>

              <!-- Ignore Notice -->
              <div style="background:#F1F5F9; border-radius:10px; padding:14px 18px; margin-bottom:20px;">
                <p style="margin:0; font-size:12px; color:#64748B; text-align:center; line-height:1.6;">
                  💡 If you didn't request this email, you can safely ignore it.
                </p>
              </div>

              <!-- Company Info -->
              <p style="margin:0; font-size:12px; color:#94A3B8; text-align:center; line-height:1.8;">
                © ${currentYear} <strong>Your App</strong>. All rights reserved.<br>
                123 Business Street, Suite 100, City, Country
              </p>

            </td>
          </tr>

          <!-- Bottom Decorative Bar -->
          <tr>
            <td style="height:6px; background: linear-gradient(90deg, #6366F1, #8B5CF6, #EC4899, #6366F1); background-size: 300% 100%;"></td>
          </tr>

        </table>

        <!-- Email Client Tiny Footer -->
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px auto 0 auto;">
          <tr>
            <td align="center">
              <p style="margin:0; font-size:11px; color:#94A3B8;">
                Sent with ❤️ by Your App Team
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
};