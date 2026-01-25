"use server";

import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
if (!SERVICE_ROLE) throw new Error("Missing SUPABASE_SERVICE_ROLE_KEY");

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE, {
  auth: { persistSession: false },
});

export async function sendContactEmail(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const subject = String(formData.get("subject") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { error: "Please fill in all required fields." };
  }

  // 1) Save to Supabase (admin key bypasses RLS)
  const { data: inserted, error: dbError } = await supabaseAdmin
    .from("contact_messages")
    .insert({
      name,
      email,
      subject: subject || null,
      message,
      status: "new",
      source: "website",
    })
    .select("id")
    .single();

  if (dbError) {
    console.error("Supabase insert error:", dbError);
    return { error: "Failed to save message. Please try again later." };
  }

  // 2) Send email via Resend
  try {
    const { data, error } = await resend.emails.send({
      from: "Career Expo Syria <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL || "wasim@example.com"],
      subject: `New Contact Inquiry: ${subject || "(no subject)"}`,
      replyTo: email,
      html: `
        <h2>New Inquiry from Career Expo Syria</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || "-"}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: true, warning: "Saved, but email failed to send." };
    }

    // 3) Store Resend id (optional)
    if (data?.id) {
      await supabaseAdmin
        .from("contact_messages")
        .update({ resend_message_id: data.id })
        .eq("id", inserted.id);
    }

    return { success: true };
  } catch (err) {
    console.error("Server error:", err);
    return { success: true, warning: "Saved, but email failed to send." };
  }
}
