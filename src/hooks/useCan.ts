import { AuthContext } from "@/context/AuthContext"
import { validateUserPermissions } from "@/utils/validateUserPermissions"
import { useContext } from "react"

type UseCanParams = {
  permissions?: string[]
  roles?: string[]
}

export function useCan({ permissions = [], roles = [] }: UseCanParams) {
  const { user, isAuthenticated } = useContext(AuthContext)

  if (!isAuthenticated) {
    return false
  }
  else if (user !== undefined) {

    const userHasValidPermissions = validateUserPermissions({
      user,
      permissions,
      roles
    })

    return userHasValidPermissions

  }





}