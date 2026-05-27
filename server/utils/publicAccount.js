export function publicAccount(account, role) {
  return {
    id: account._id.toString(),
    role,
    name: account.name,
    email: account.email,
    phone: account.phone || '',
    address: account.address || '',
    addresses: account.addresses || [],
    profilePhoto: account.profilePhoto || '',
    wishlist: account.wishlist || [],
    emailVerified: Boolean(account.emailVerified),
    phoneVerified: Boolean(account.phoneVerified),
    lastLoginAt: account.lastLoginAt,
  }
}
