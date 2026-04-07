import { z } from 'zod'
import { validateCPF } from '@/utils/validators'

export const driverSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cpf: z.string().refine((val) => validateCPF(val), { message: 'CPF inválido' }),
  cnh: z.string().optional(),
  baseSalary: z.number().min(1212, 'Salário base não pode ser inferior a R$ 1212'),
  periculosidade: z.boolean().optional().default(false),
  vrDaily: z.number().min(0).optional().default(0),
  vtMensal: z.number().min(0).optional().default(0),
  cestaBasica: z.number().min(0).optional().default(0),
  seguroVida: z.number().min(0).optional().default(0),
  toxAnual: z.number().min(0).optional().default(0),
  rat: z.number().min(0).optional().default(0),
})

export type DriverFormData = z.infer<typeof driverSchema>
