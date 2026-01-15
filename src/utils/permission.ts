export const hasAnyRole = (userRoles: string[], requiredRoles: string[]) => {
  if (!requiredRoles || requiredRoles.length === 0) return true
  if (!userRoles || userRoles.length === 0) return false
  return requiredRoles.some(r => userRoles.includes(r))
}

