import { NextResponse } from "next/server";

export const runtime = "nodejs";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maximumBodyLength = 32768;

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      { error: "Please submit the contact form as JSON." },
      { status: 415 },
    );
  }

  // Limit input before parsing; this endpoint accepts a short message, never attachments.
  if (Number(request.headers.get("content-length") || 0) > maximumBodyLength) {
    return NextResponse.json(
      { error: "Your message is too long." },
      { status: 413 },
    );
  }

  let body: Record<string, unknown>;
  try {
    const rawBody = await request.text();
    if (rawBody.length > maximumBodyLength) {
      return NextResponse.json(
        { error: "Your message is too long." },
        { status: 413 },
      );
    }
    const parsed: unknown = JSON.parse(rawBody);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed))
      throw new Error("Invalid form");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: "The form could not be read. Please try again." },
      { status: 400 },
    );
  }

  if (body.website) {
    return NextResponse.json(
      { error: "Your submission could not be accepted." },
      { status: 400 },
    );
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const fieldErrors: Record<string, string> = {};

  if (name.length < 2 || name.length > 100)
    fieldErrors.name = "Please enter a name between 2 and 100 characters.";
  if (email.length > 254 || !emailPattern.test(email))
    fieldErrors.email = "Please enter a valid email address.";
  if (message.length < 20 || message.length > 5000)
    fieldErrors.message =
      "Please enter a message between 20 and 5,000 characters.";

  if (Object.keys(fieldErrors).length) {
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fieldErrors },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !to || !from) {
    return NextResponse.json(
      {
        error: "Messaging is not available yet. Please try again later.",
      },
      { status: 503 },
    );
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `Portfolio inquiry from ${name.replace(/[\r\n]/g, " ")}`,
        // Plain text keeps user-provided content out of HTML templates.
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      }),
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Your message could not be delivered. Please try again later.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      {
        error:
          "The email service is temporarily unavailable. Please try again later.",
      },
      { status: 502 },
    );
  }
}
