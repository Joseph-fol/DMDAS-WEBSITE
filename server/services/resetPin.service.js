const { Resend } = require("resend")

const resend = new Resend(process.env.RESEND_API_KEY)
const year = new Date()
const thisYear = year.getFullYear()

const sendPinResetEmail = async (email, fullName, otp) => {
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY not configured in environment variables");
        return Promise.resolve({
            success: false,
            error: "Resend API key not configured"
        });
    }

    const mailOptions = {
        from: 'DMDAS Security <security@dmdas.com.ng>',
        to: email,
        subject: "Your DMDAS PIN Reset Code",
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Your PIN Reset Code</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;">
                <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);">

                    <div style="background: linear-gradient(135deg, #381E25 0%, #522A33 100%); padding: 40px 30px; text-align: center; border-bottom: 4px solid #F43F5E;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">DMDAS</h1>
                        <p style="color: #FDE7ED; margin: 5px 0 0 0; font-size: 14px;">PIN Reset Request</p>
                    </div>

                    <div style="padding: 40px 30px; background-color: #ffffff;">
                        <h2 style="color: #381E25; margin: 0 0 B10px 0; font-size: 24px; font-weight: 600;">Hi, ${fullName}</h2>
                        <p style="color: #381E25; margin: 10px 0 25px 0; font-size: 16px; line-height: 1.6;">We received a request to reset your PIN. Use the code below to set up a new one.</p>
                        
                        <div style="text-align: center; background-color: #FDE7ED; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                            <p style="color: #381E25; margin: 0; font-size: 16px;">Your PIN reset code is:</p>
                            <p style="color: #F43F5E; margin: 10px 0 0 0; font-size: 32px; font-weight: 700; letter-spacing: 4px;">${otp}</p>
                        </div>

                        <p style="color: #381E25; font-size: 14px; line-height: 1.6;">This code will expire in 10 minutes. If you did not request a PIN reset, please ignore this email or contact support if you have concerns.</p>
                    </div>

                    <div style="background-color: #381E25; padding: 30px; text-align: center; border-top: 1px solid #522A33;">
                        <p style="color: #FDE7ED; margin: 0; font-size: 13px;">
                            © ${thisYear} DMDAS. All rights reserved.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `
    };

    return await resend.emails.send(mailOptions);
};

module.exports = { sendPinResetEmail }