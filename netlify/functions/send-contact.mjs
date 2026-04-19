import nodemailer from 'nodemailer';

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' },
    });
  }

  // Try EVERY possible way to get the keys
  const getEnv = async (key) => {
    // 1. Check Netlify global (production)
    if (typeof Netlify !== 'undefined' && Netlify.env.get(key)) return Netlify.env.get(key);

    // 2. Check process.env (standard Node)
    if (process.env[key]) return process.env[key];
    if (process.env[`VITE_${key}`]) return process.env[`VITE_${key}`];

    // 3. Local fallback: Manual .env parsing
    try {
      const { readFileSync, existsSync } = await import('node:fs');
      const { resolve } = await import('node:path');
      const envPath = resolve(process.cwd(), '.env');

      if (existsSync(envPath)) {
        const envContent = readFileSync(envPath, 'utf8');
        const match = envContent.match(new RegExp(`^${key}=(.*)$|^VITE_${key}=(.*)$`, 'm'));
        if (match) return (match[1] || match[2] || '').trim();
      }
    } catch (e) {
      // Ignore fs errors in production
    }

    return null;
  };

  const smtpUser = await getEnv('BREVO_SMTP_USER');
  const smtpPass = await getEnv('BREVO_SMTP_PASS');
  const senderEmail = (await getEnv('SENDER_EMAIL')) || 'hibaraliyyah12@gmail.com';

  if (!smtpUser || !smtpPass) {
    return new Response(JSON.stringify({
      error: `Missing Keys. (Found User: ${!!smtpUser}, Pass: ${!!smtpPass})`
    }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await req.json();
    const { name, email, message } = body;

    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: { user: smtpUser, pass: smtpPass },
    });

    // Notify Hiba
    await transporter.sendMail({
      from: `"Portfolio" <${senderEmail}>`,
      to: 'hibaraliyyah12@gmail.com',
      replyTo: email,
      subject: `📬 New Message from ${name}`,
      html: `<div style="font-family:sans-serif; padding:20px;">
                <h2>New Message!</h2>
                <p><strong>From:</strong> ${name} (${email})</p>
                <p>${message}</p>
            </div>`,
    });

    // Thanks User
    await transporter.sendMail({
      from: `"Hiba Raliyyah" <${senderEmail}>`,
      to: email,
      subject: `Thanks for the message, ${name}!`,
      html: `<p>Hi ${name}, thanks for reaching out! I've received your message and will get back to you soon.</p>`,
    });

    return new Response(JSON.stringify({ success: true }), {
      status: 200, headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
};

export const config = { path: '/api/contact' };
