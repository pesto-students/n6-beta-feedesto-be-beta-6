import { AuthRole } from "../controller/auth"

export type MobileNumber = { countryCode: string; mobileNo: string }

export type Audits = { createdAt: string; modifiedAt: string }

export type RequestLocals = {
	session: {
		role: AuthRole
		organizationId: string
		userId: string
	}
}

export type RequestPagination = { limit?: number; offset?: number }
