export function normalizePhoneForApi(value) {
  const phone = String(value || '').trim().replace(/[\s()-]/g, '')
  return /^[6-9]\d{9}$/.test(phone) ? `+91${phone}` : phone
}
