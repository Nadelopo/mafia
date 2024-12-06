export const randomizer = (
  playersCount: number,
  rolesDistribution: { id: number; count: number }[]
): number[] | null => {
  const roles = []
  for (const roleData of rolesDistribution) {
    for (let i = 0; i < roleData.count; i++) {
      roles.push(roleData.id)
    }
  }

  if (roles.length !== playersCount) {
    return null
  }

  for (let i = roles.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[roles[i], roles[j]] = [roles[j], roles[i]]
  }

  return roles
}
