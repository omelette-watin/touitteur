/* eslint-disable no-unused-vars */
export interface AuthContextType {
  user: Object | null
  setUser: (user: Object | null) => void
  loading: boolean
}
