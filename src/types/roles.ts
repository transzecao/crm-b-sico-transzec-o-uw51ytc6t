export type Role =
  | 'DESENVOLVEDOR'
  | 'DIRETOR'
  | 'SUPERVISOR_FINANCEIRO'
  | 'SUPERVISOR_COLETA'
  | 'SUPERVISOR_COMERCIAL'
  | 'FUNCIONARIO_FINANCEIRO'
  | 'FUNCIONARIO_COLETA'
  | 'FUNCIONARIO_PROSPECCAO'
  | 'FUNCIONARIO_MARKETING'
  | 'CLIENTE'
  | 'Cliente'
  | 'SUPORTE_TECNICO'

export const ROLE_HIERARCHY: Record<Role, Role[]> = {
  DESENVOLVEDOR: [
    'DIRETOR',
    'SUPERVISOR_FINANCEIRO',
    'SUPERVISOR_COLETA',
    'SUPERVISOR_COMERCIAL',
    'FUNCIONARIO_FINANCEIRO',
    'FUNCIONARIO_COLETA',
    'FUNCIONARIO_PROSPECCAO',
    'FUNCIONARIO_MARKETING',
    'CLIENTE',
    'Cliente',
    'SUPORTE_TECNICO',
  ],
  DIRETOR: [
    'SUPERVISOR_FINANCEIRO',
    'SUPERVISOR_COLETA',
    'SUPERVISOR_COMERCIAL',
    'FUNCIONARIO_FINANCEIRO',
    'FUNCIONARIO_COLETA',
    'FUNCIONARIO_PROSPECCAO',
    'FUNCIONARIO_MARKETING',
    'CLIENTE',
    'Cliente',
    'SUPORTE_TECNICO',
  ],
  SUPERVISOR_FINANCEIRO: ['FUNCIONARIO_FINANCEIRO'],
  SUPERVISOR_COLETA: ['FUNCIONARIO_COLETA'],
  SUPERVISOR_COMERCIAL: ['FUNCIONARIO_PROSPECCAO', 'FUNCIONARIO_MARKETING'],
  FUNCIONARIO_FINANCEIRO: [],
  FUNCIONARIO_COLETA: [],
  FUNCIONARIO_PROSPECCAO: [],
  FUNCIONARIO_MARKETING: [],
  CLIENTE: [],
  Cliente: [],
  SUPORTE_TECNICO: [],
}

export const TOOL_RESPONSIBILITIES: Record<string, Role[]> = {
  finance_cpk: ['SUPERVISOR_FINANCEIRO', 'FUNCIONARIO_FINANCEIRO'],
  freight_calculation: ['SUPERVISOR_COLETA', 'FUNCIONARIO_COLETA'],
  prospeccao: ['SUPERVISOR_COMERCIAL', 'FUNCIONARIO_PROSPECCAO'],
}

export type Permissions = {
  canAccessTool: (toolId: string) => boolean
  isDeveloperOf: (toolId: string) => boolean
  canManageFields: (toolId: string) => boolean
  canManageRules: (toolId: string) => boolean
}

export function createPermissions(role: Role): Permissions {
  const userRoles = [role, ...(ROLE_HIERARCHY[role] || [])]

  const canAccessTool = (toolId: string) => {
    if (role === 'DESENVOLVEDOR' || role === 'DIRETOR') return true
    const allowedRoles = TOOL_RESPONSIBILITIES[toolId] || []
    return allowedRoles.some((r) => userRoles.includes(r as Role))
  }

  const isDeveloperOf = (toolId: string) => {
    if (role === 'DESENVOLVEDOR' || role === 'DIRETOR') return true
    const allowedRoles = TOOL_RESPONSIBILITIES[toolId] || []
    return allowedRoles.some((r) => r.startsWith('SUPERVISOR_') && userRoles.includes(r as Role))
  }

  return {
    canAccessTool,
    isDeveloperOf,
    canManageFields: isDeveloperOf,
    canManageRules: isDeveloperOf,
  }
}
