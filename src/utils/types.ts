import { AuthRole } from "../controller/auth"

export type RequestLocals = {
	session: {
		role: AuthRole
		organizationId: string
		userId: string
	}
}
