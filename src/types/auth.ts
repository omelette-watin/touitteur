import { UserType } from "./user"

/* eslint-disable no-unused-vars */
export interface AuthContextType {
  user: UserType | null
  setUser: (user: UserType | null) => void
  loading: boolean
}
