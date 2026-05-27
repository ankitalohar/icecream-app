import nodemailer from 'nodemailer'
import twilio from 'twilio'

export async function deliverOtp(channel, identifier, code) {
  if (process.env.OTP_DEV_MODE === 'true') {
    console.log(`[DEV OTP] ${channel}:${identifier} => ${code}`)
    return
  }

  if (channel === 'email') {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, OTP_EMAIL_FROM } = process.env
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS || !OTP_EMAIL_FROM) {
      throw new Error('Email OTP delivery is not configured.')
    }
    const transport = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })
    await transport.sendMail({
      from: OTP_EMAIL_FROM,
      to: identifier,
      subject: 'Your Vivelle one-time verification code',
      text: `Your verification code is ${code}. It expires in 10 minutes.`,
    })
    return
  }

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_PHONE } = process.env
  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_FROM_PHONE) {
    throw new Error('Mobile OTP delivery is not configured.')
  }
  const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)
  await client.messages.create({
    from: TWILIO_FROM_PHONE,
    to: identifier,
    body: `Your Vivelle verification code is ${code}. It expires in 10 minutes.`,
  })
}
