const { Resend } = require("resend")

const resend = new Resend(process.env.RESEND_API_KEY)
const year = new Date()
const thisYear = year.getFullYear()

const sendWelcomeEmail = async (email, fullName) => {
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY not configured in environment variables");
        return Promise.resolve({
            success: false,
            error: "Resend API key not configured"
        });
    }

    const mailOptions = {
        from: 'DMDAS <support@dmdas.com.ng>',
        reply_to: "support@dmdas.com.ng",
        to: email,
        subject: "Welcome to DMDAS - Your Account is Ready",
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to DMDAS </title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;">
                
                <!-- Main Container -->
                <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);">

                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #381E25 0%, #522A33 100%); padding: 40px 30px; text-align: center; border-bottom: 4px solid #F43F5E;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px;">DMDAS</h1>
                        <p style="color: #FDE7ED; margin: 5px 0 0 0; font-size: 14px;">A Digital Manual Distribution and Accountability System</p>
                    </div>

                    <!-- Greeting Section -->
                    <div style="padding: 40px 30px; background-color: #ffffff; border-bottom: 1px solid #e2e8f0;">
                        <h2 style="color: #381E25; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">Welcome, ${fullName}! </h2>
                        <p style="color: #381E25; margin: 10px 0 0 0; font-size: 16px; line-height: 1.6;">Your account has been successfully created and is ready to use.</p>
                    </div>

                    <!-- Main Content -->
                    <div style="padding: 40px 30px; background-color: #FDE7ED;">

                        <!-- What's Next Section -->
                        <div style="background-color: #ffffff; padding: 25px; border-radius: 8px;  margin-bottom: 30px;">
                            <h3 style="color: #381E25; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">What's Next?</h3>
                            <ul style="margin: 0; padding-left: 20px; list-style: none;">
                                <li style="color: #381E25; margin-bottom: 12px; font-size: 15px; line-height: 1.6;">
                                    <span style="color: #F43F5E; font-weight: 600;">✓</span> Log in to your dashboard to explore available manuals
                                </li>
                                <li style="color: #381E25; margin-bottom: 12px; font-size: 15px; line-height: 1.6;">
                                    <span style="color: #F43F5E; font-weight: 600;">✓</span> Review account guidelines and best practices
                                </li>
                                <li style="color: #381E25; margin-bottom: 0; font-size: 15px; line-height: 1.6;">
                                    <span style="color: #F43F5E; font-weight: 600;">✓</span> Buy your first manual when ready
                                </li>
                            </ul>
                        </div>

                        <!-- CTA Button -->
                        <div style="text-align: center; margin-bottom: 30px;">
                            <a href="https://app.dmdas.com.ng/signin" style="display: inline-block; background: linear-gradient(135deg, #F43F5E 0%, #D0304E 100%); color: #ffffff; text-decoration: none; padding: 14px 40px; border-radius: 6px; font-weight: 600; font-size: 16px; transition: all 0.3s ease; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(171, 53, 0, 0.3);">
                                Go to Dashboard
                            </a>
                        </div>

                        <!-- Support Section -->
                        <div style="background-color: #FFF0F3; padding: 20px; border-radius: 8px;  margin-bottom: 20px;">

                            <p style="color: #381E25; margin: 0; font-size: 14px; line-height: 1.6;">
                                <strong>Need Help?</strong> Our support team is here to assist you. Contact us at <a href="mailto:support@dmdas.com.ng" style="color: #F43F5E; text-decoration: none; font-weight: 600;">support@dmdas.com.ng</a>
                            </p>
                        </div>

                    </div>

                    <!-- Footer -->
                    <div style="background-color: #381E25; padding: 30px; text-align: center; border-top: 1px solid #522A33;">
                        <!-- Contact Info -->
                        <div style="border-top: 1px solid #522A33; padding-top: 20px;">
                            <p style="color: #FDE7ED; margin: 0 0 8px 0; font-size: 15px;">
                                <strong style="color: #ffffff;">DMDAS</strong> | A Digital Manual Distibution and Accountability System
                            </p>
                            <p style="color: #FDE7ED; margin: 0 0 15px 0; font-size: 14px;">
                                Email: <a href="mailto:support@dmdas.com.ng" style="color: #F43F5E; text-decoration: none;">support@dmdas.com.ng</a>
                            </p>
                        </div>

                        <!-- Legal Links -->
                        <div style="border-top: 1px solid #522A33; padding-top: 15px; margin-top: 15px;">
                            <p style="margin: 0; font-size: 12px;">
                                <a href="#" style="color: #FDE7ED; text-decoration: none; margin-right: 15px;">Privacy Policy</a>
                                <a href="#" style="color: #FDE7ED; text-decoration: none; margin-right: 15px;">Terms of Service</a>
                                <a href="#" style="color: #FDE7ED; text-decoration: none;">Unsubscribe</a>
                            </p>
                        </div>

                        <!-- Copyright -->
                        <p style="color: #FDE7ED; margin: 15px 0 0 0; font-size: 13px;">
                            © ${thisYear} DMDAS. All rights reserved.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    return await resend.emails.send(mailOptions)
}

module.exports = { sendWelcomeEmail }
