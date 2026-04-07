export function validateCIOT(ciot: string): boolean {
  const cleanCIOT = ciot.replace(/[^\d]+/g, '')
  if (cleanCIOT.length !== 12) return false
  const weights = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3]
  let sum = 0
  for (let i = 0; i < 11; i++) {
    sum += parseInt(cleanCIOT[i]) * weights[i]
  }
  const mod = sum % 11
  const digit = mod < 2 ? 0 : 11 - mod
  return parseInt(cleanCIOT[11]) === digit
}

export function validateRNTRC(rntrc: string): boolean {
  const cleanRNTRC = rntrc.replace(/[^\d]+/g, '')
  if (cleanRNTRC.length !== 8) return false
  if (!['0', '1', '2'].includes(cleanRNTRC[0])) return false
  if (/^(\d)\1{7}$/.test(cleanRNTRC)) return false
  return true
}
