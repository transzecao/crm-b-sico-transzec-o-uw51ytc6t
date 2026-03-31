import pb from '@/lib/pocketbase/client'

export interface AIAnalysisResponse {
  trend: string
  recommendation: string
  forecast_cpk: number
  margin_error: number
  avg_current_cpk: number
}

export const getAICostAnalysis = () =>
  pb.send<AIAnalysisResponse>('/backend/v1/ai/analyze-costs', { method: 'GET' })
