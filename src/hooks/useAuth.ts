import { AuthContext } from "@/contexts/AuthContext"
import useContextAndErrorIfNull from "./useContextAndErrorIfNull"

const useAuth = () => useContextAndErrorIfNull(AuthContext)

export default useAuth
