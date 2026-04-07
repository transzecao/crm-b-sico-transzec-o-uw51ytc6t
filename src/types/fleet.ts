export type FieldType = 'text' | 'number' | 'select'

export interface DynamicField {
  id: string
  label: string
  type: FieldType | string
  required: boolean
  mappedParam: string
  values?: string[]
}

export interface Driver {
  id: string
  name: string
  cpf: string
  cnh: 'D' | 'E' | string
  baseSalary: number
  periculosidade: boolean
  vrDaily: number
  vtMensal: number
  cestaBasica: number
  seguroVida: number
  toxAnual: number
  rat: number
  encargos: {
    fgts: number
    ferias: number
    decimo: number
    pis: number
  }
  customFields?: Record<string, number>
}
