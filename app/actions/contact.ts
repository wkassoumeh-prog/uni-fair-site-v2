"use server";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const subject = formData.get('subject') as string;
  const message = formData.get('message') as string;

  if (!name || !email || !message) {
    return { error: 'Please fill in all required fields.' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'Career Expo Syria <onboarding@resend.dev>', // You should verify your domain in Resend
      to: [process.env.CONTACT_EMAIL || 'wasim@example.com'], // Your destination email
      subject: `New Contact Inquiry: ${subject}`,
      replyTo: email,
      html: `
        <h2>New Inquiry from Career Expo Syria</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { error: 'Failed to send email. Please try again later.' };
    }

    return { success: true };
  } catch (err) {
    console.error('Server error:', err);
    return { error: 'A server error occurred. Please try again later.' };
  }
}

