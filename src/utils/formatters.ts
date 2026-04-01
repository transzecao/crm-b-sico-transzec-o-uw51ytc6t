export const formatCnpj = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 14) // Strict 14 digits format
  let formatted = digits
  if (digits.length > 2) formatted = `${digits.slice(0, 2)}.${digits.slice(2)}`
  if (digits.length > 5) formatted = `${formatted.slice(0, 6)}.${digits.slice(5)}`
  if (digits.length > 8) formatted = `${formatted.slice(0, 10)}/${digits.slice(8)}`
  if (digits.length > 12) formatted = `${formatted.slice(0, 15)}-${digits.slice(12, 14)}`
  return formatted
}

export const formatCpf = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  let formatted = digits
  if (digits.length > 3) formatted = `${digits.slice(0, 3)}.${digits.slice(3)}`
  if (digits.length > 6) formatted = `${formatted.slice(0, 7)}.${digits.slice(6)}`
  if (digits.length > 9) formatted = `${formatted.slice(0, 11)}-${digits.slice(9, 11)}`
  return formatted
}

export const isValidCpf = (cpf: string) => {
  const digits = cpf.replace(/\D/g, '')
  if (digits.length !== 11 || /^(\d)\1{10}$/.test(digits)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(digits.charAt(i)) * (10 - i)
  let rev = 11 - (sum % 11)
  if (rev === 10 || rev === 11) rev = 0
  if (rev !== parseInt(digits.charAt(9))) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(digits.charAt(i)) * (11 - i)
  rev = 11 - (sum % 11)
  if (rev === 10 || rev === 11) rev = 0
  return rev === parseInt(digits.charAt(10))
}

export const isValidPlate = (plate: string) => {
  return /^[a-zA-Z]{3}-?\d{4}$|^[a-zA-Z]{3}\d[a-zA-Z]\d{2}$/.test(
    plate.replace(/[^a-zA-Z0-9]/g, ''),
  )
}

export const formatCurrency = (value?: number | null) => {
  if (value == null || isNaN(Number(value))) return 'R$ 0,00'
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    Math.max(0, Number(value)),
  )
}
