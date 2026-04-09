export function validateEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export function validateEmailDomain(email: string): boolean {
  const blockedDomains = ['example.com', 'test.com', 'mailinator.com']
  const domain = email.split('@')[1]
  return domain ? !blockedDomains.includes(domain.toLowerCase()) : false
}

export function isBusinessEmail(email: string): boolean {
  const personalDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com']
  const domain = email.split('@')[1]
  return domain ? !personalDomains.includes(domain.toLowerCase()) : false
}

export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase()
}
