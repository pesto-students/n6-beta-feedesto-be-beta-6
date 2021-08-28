import { AuthRole } from '../controller/auth'
import { OrganizationAuthPayload } from '../controller/auth/organization'
import { UserAuthPayload } from '../controller/auth/user'

export type MobileNumber = { countryCode: string; mobileNo: string }

export type Audits = { createdAt: string; modifiedAt: string }

export type RequestLocals = {
	session: {
		role: AuthRole
		organization: OrganizationAuthPayload
		user: UserAuthPayload
	}
}

export type RequestPagination = { limit?: number; offset?: number }
