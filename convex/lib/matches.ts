import type { Id } from "../_generated/dataModel"

export function orderedPair(
  userIdA: Id<"users">,
  userIdB: Id<"users">,
): [Id<"users">, Id<"users">] {
  return userIdA < userIdB ? [userIdA, userIdB] : [userIdB, userIdA]
}
