import { Lead, Interaction } from '@/stores/useCrmStore'

/**
 * Calculates the AI probability of closing a deal based on historical behavior patterns.
 * @param lead The lead to evaluate
 * @param interactions All interactions available in the system
 * @returns A percentage number representing the probability of winning the lead
 */
export function calculateAIProbability(lead: Lead, interactions: Interaction[]): number {
  if (lead.stage === 'Ganho') return 100
  if (lead.stage === 'Perda') return 0

  let base = 15 // Base probability for a new lead

  // Stage weight factor (closer to the end = higher probability)
  switch (lead.stage) {
    case 'Negociação':
      base += 40
      break
    case 'Qualificação':
      base += 25
      break
    case '1º contato sem resposta':
    case '2º contato sem resposta':
      base -= 10
      break
    case '3º contato sem resposta':
      base -= 15
      break
    case 'Primeiro contato':
      base += 5
      break
  }

  // Score weight factor
  if (lead.score === 'Hot') base += 20
  else if (lead.score === 'Warm') base += 10
  else if (lead.score === 'Cold') base -= 10

  // Behavioral / Interaction factor (simulate pattern matching from won leads)
  // More interactions generally mean more engagement, up to a healthy threshold
  const leadInteractions = interactions.filter((i) => i.companyId === lead.companyId)
  const interactionScore = Math.min(leadInteractions.length * 4, 25)
  base += interactionScore

  // Penalty for stalled leads
  if (lead.isStalled) {
    base -= 20
  }

  // Cap between 5% and 98% for realistic active deals
  return Math.max(5, Math.min(base, 98))
}
