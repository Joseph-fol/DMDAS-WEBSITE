const { Resend } = require("resend")

const resend = new Resend(process.env.RESEND_API_KEY)
const year = new Date()
const thisYear = year.getFullYear()

const sendManualPurchaseConsentEmail = async (email, fullName, courseCode, courseTitle, amount) => {
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY not configured in environment variables");
        return Promise.resolve({
            success: false,
            error: "Resend API key not configured"
        });
    }

    const formattedAmount = `₦${Number(amount).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;

    const mailOptions = {
        from: 'DMDAS <support@dmdas.com.ng>',
        reply_to: "support@dmdas.com.ng",
        to: email,
        subject: `Confirm your ${courseCode} manual purchase`,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Manual Purchase Confirmation</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;">
                <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);">
                    <div style="background: linear-gradient(135deg, #381E25 0%, #522A33 100%); padding: 40px 30px; text-align: center; border-bottom: 4px solid #F43F5E;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">DMDAS</h1>
                        <p style="color: #FDE7ED; margin: 5px 0 0 0; font-size: 14px;">Manual Purchase Confirmation</p>
                    </div>

                    <div style="padding: 40px 30px; background-color: #ffffff;">
                        <h2 style="color: #381E25; margin: 0 0 10px 0; font-size: 24px; font-weight: 600;">Hi, ${fullName}</h2>
                        <p style="color: #381E25; margin: 10px 0 25px 0; font-size: 16px; line-height: 1.6;">
                            You are about to buy the following manual. Please review the details before continuing with payment.
                        </p>

                        <div style="background-color: #FDE7ED; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                            <p style="color: #381E25; margin: 0 0 10px 0; font-size: 15px;"><strong>Course:</strong> ${courseTitle}</p>
                            <p style="color: #381E25; margin: 0 0 10px 0; font-size: 15px;"><strong>Course code:</strong> ${courseCode}</p>
                            <p style="color: #381E25; margin: 0; font-size: 15px;"><strong>Amount:</strong> ${formattedAmount}</p>
                        </div>

                        <p style="color: #381E25; margin: 0; font-size: 14px; line-height: 1.6;">
                            This is a consent reminder. Your purchase is not complete yet. Continue only if you intend to make this payment. If you did not request this, you can safely ignore this email.
                        </p>
                    </div>

                    <div style="background-color: #381E25; padding: 30px; text-align: center; border-top: 1px solid #522A33;">
                        <p style="color: #FDE7ED; margin: 0 0 8px 0; font-size: 14px;">
                            Need help? Contact <a href="mailto:support@dmdas.com.ng" style="color: #F43F5E; text-decoration: none;">support@dmdas.com.ng</a>
                        </p>
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

module.exports = { sendManualPurchaseConsentEmail }