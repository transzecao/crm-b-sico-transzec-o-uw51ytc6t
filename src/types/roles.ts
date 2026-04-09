export type UserRole =
  | 'DESENVOLVEDOR'
  | 'DIRETOR'
  | 'SUPERVISOR_FINANCEIRO'
  | 'SUPERVISOR_COLETA'
  | 'SUPERVISOR_COMERCIAL'
  | 'FUNCIONARIO_FINANCEIRO'
  | 'FUNCIONARIO_COLETA'
  | 'FUNCIONARIO_PROSPECCAO'
  | 'FUNCIONARIO_MARKETING'
  | 'Cliente'
  | 'Cliente'
  | 'SUPORTE_TECNICO'

export const ROLE_HIERARCHY: Record<UserRole, UserRole[]> = {
  DESENVOLVEDOR: [
    'DIRETOR',
    'SUPERVISOR_FINANCEIRO',
    'SUPERVISOR_COLETA',
    'SUPERVISOR_COMERCIAL',
    'FUNCIONARIO_FINANCEIRO',
    'FUNCIONARIO_COLETA',
    'FUNCIONARIO_PROSPECCAO',
    'FUNCIONARIO_MARKETING',
    'Cliente',
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
    'Cliente',
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
  Cliente: [],

  SUPORTE_TECNICO: [],
}

export const TOOL_RESPONSIBILITIES: Record<string, UserRole[]> = {
  finance_cpk: ['SUPERVISOR_FINANCEIRO', 'FUNCIONARIO_FINANCEIRO'],
  freight_calculation: ['SUPERVISOR_COLETA', 'FUNCIONARIO_COLETA'],
  prospeccao: ['SUPERVISOR_COMERCIAL', 'FUNCIONARIO_PROSPECCAO'],
  lead_registration: ['SUPERVISOR_COMERCIAL', 'FUNCIONARIO_PROSPECCAO', 'FUNCIONARIO_MARKETING'],
}

export type Permissions = {
  canAccessTool: (toolId: string) => boolean
  isDeveloperOf: (toolId: string) => boolean
  canManageFields: (toolId: string) => boolean
  canManageRules: (toolId: string) => boolean
}

export function createPermissions(
  role: UserRole,
  dbPermissions: Record<string, any> = {},
): Permissions {
  const userRoles = [role, ...(ROLE_HIERARCHY[role] || [])]

  const canAccessTool = (toolId: string) => {
    if (role === 'DESENVOLVEDOR' || role === 'DIRETOR') return true

    if (dbPermissions[toolId]) {
      return dbPermissions[toolId].can_access === true
    }

    const allowedRoles = TOOL_RESPONSIBILITIES[toolId] || []
    return allowedRoles.some((r) => userRoles.includes(r as UserRole))
  }

  const isDeveloperOf = (toolId: string) => {
    if (role === 'DESENVOLVEDOR' || role === 'DIRETOR') return true

    if (dbPermissions[toolId]) {
      return dbPermissions[toolId].is_developer === true
    }

    const allowedRoles = TOOL_RESPONSIBILITIES[toolId] || []
    return allowedRoles.some(
      (r) => r.startsWith('SUPERVISOR_') && userRoles.includes(r as UserRole),
    )
  }

  return {
    canAccessTool,
    isDeveloperOf,
    canManageFields: isDeveloperOf,
    canManageRules: isDeveloperOf,
  }
}
