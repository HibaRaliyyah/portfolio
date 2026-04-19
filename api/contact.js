import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const transporter = nodemailer.createTransport({
            host: 'smtp-relay.brevo.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.BREVO_SMTP_USER,
                pass: process.env.BREVO_SMTP_PASS,
            },
        });

        await transporter.sendMail({
            from: `"Portfolio Contact" <${process.env.SENDER_EMAIL}>`,
            to: process.env.SENDER_EMAIL,
            replyTo: email,
            subject: `New message from ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Message:</strong></p>
                <p>${message.replace(/\n/g, '<br/>')}</p>
            `,
        });

        // Confirmation email to sender
        await transporter.sendMail({
            from: `"Hiba Raliyyah" <${process.env.SENDER_EMAIL}>`,
            to: email,
            subject: 'Message Received!',
            html: `
                <h2>Hi ${name}, thanks for reaching out!</h2>
                <p>I've received your message and will get back to you soon.</p>
                <br/>
                <p><em>Your message:</em></p>
                <blockquote>${message.replace(/\n/g, '<br/>')}</blockquote>
            `,
        });

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error('Mail error:', err);
        return res.status(500).json({ error: err.message });
    }
}