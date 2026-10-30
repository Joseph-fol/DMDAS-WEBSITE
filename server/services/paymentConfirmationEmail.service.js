const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const escapeHtml = (value) => String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const sendPaymentConfirmationEmail = async ({
    email,
    fullName,
    courseCode,
    courseTitle,
    repName,
    keycode,
    amount,
    paymentDate,
}) => {
    if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY not configured in environment variables");
        return {
            success: false,
            error: "Resend API key not configured",
        };
    }

    const formattedAmount = `₦${Number(amount).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
    const formattedDate = new Date(paymentDate).toLocaleString("en-NG", {
        dateStyle: "medium",
        timeStyle: "short",
    });

    return resend.emails.send({
        from: "DMDAS <support@dmdas.com.ng>",
        reply_to: "support@dmdas.com.ng",
        to: email,
        subject: `Payment confirmed for ${courseCode}`,
        html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Payment Confirmation</title>
            </head>
            <body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;">
                <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);">
                    <div style="background: linear-gradient(135deg, #381E25 0%, #522A33 100%); padding: 40px 30px; text-align: center; border-bottom: 4px solid #F43F5E;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px;">DMDAS</h1>
                        <p style="color: #FDE7ED; margin: 5px 0 0; font-size: 14px;">Payment Confirmation</p>
                    </div>

                    <div style="padding: 40px 30px;">
                        <h2 style="color: #381E25; margin: 0 0 10px; font-size: 24px;">Payment successful, ${escapeHtml(fullName)}</h2>
                        <p style="color: #381E25; margin: 10px 0 25px; font-size: 16px; line-height: 1.6;">
                            Your payment for the ${escapeHtml(courseTitle)} has been confirmed.
                        </p>

                        <div style="background-color: #FDE7ED; padding: 20px; border-radius: 8px;">
                            <p style="color: #381E25; margin: 0 0 10px; font-size: 15px;"><strong>Course code:</strong> ${escapeHtml(courseCode)}</p>
                            <p style="color: #381E25; margin: 0 0 10px; font-size: 15px;"><strong>Course title:</strong> ${escapeHtml(courseTitle)}</p>
                            <p style="color: #381E25; margin: 0 0 10px; font-size: 15px;"><strong>Manual representative:</strong> ${escapeHtml(repName)}</p>
                            <p style="color: #381E25; margin: 0 0 10px; font-size: 15px;"><strong>Pickup keycode:</strong> ${escapeHtml(keycode)}</p>
                            <p style="color: #381E25; margin: 0 0 10px; font-size: 15px;"><strong>Amount paid:</strong> ${formattedAmount}</p>
                            <p style="color: #381E25; margin: 0; font-size: 15px;"><strong>Date:</strong> ${escapeHtml(formattedDate)}</p>
                        </div>

                        <p style="color: #381E25; margin: 25px 0 0; font-size: 14px; line-height: 1.6;">
                            Your manual is ready for pickup. Please keep this email for your records.
                        </p>
                    </div>

                    <div style="background-color: #381E25; padding: 30px; text-align: center;">
                        <p style="color: #FDE7ED; margin: 0; font-size: 13px;">
                            Need help? Contact <a href="mailto:support@dmdas.com.ng" style="color: #F43F5E;">support@dmdas.com.ng</a>
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `,
    });
};

module.exports = { sendPaymentConfirmationEmail };
