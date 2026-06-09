import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

function requireSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) {
    throw new Error("SMTP_HOST, SMTP_USER ve SMTP_PASS tanımlı olmalı");
  }
  const port = Number(process.env.SMTP_PORT ?? "465");
  return { host, port, user, pass };
}

function createTransport() {
  const { host, port, user, pass } = requireSmtpConfig();
  const options: SMTPTransport.Options = {
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  };
  return nodemailer.createTransport(options);
}

export function getMailFrom(): string {
  return process.env.MAIL_FROM ?? process.env.SMTP_USER ?? "reports@stradabilisim.com.tr";
}

export function getMailTo(): string {
  return process.env.MAIL_TO ?? "irfan@stradabilisim.com";
}

export async function sendMail(opts: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}): Promise<void> {
  const transport = createTransport();
  await transport.sendMail({
    from: `Strada Reports <${getMailFrom()}>`,
    to: opts.to,
    replyTo: opts.replyTo,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });
}
