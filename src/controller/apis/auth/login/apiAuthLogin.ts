import { ForbiddenError, T, WebApi } from "@hkbyte/webapi"
import { fetchUsers } from "../../../../services/mongo/user"
import { AuthRole } from "../../../auth"
import { generateOrganizationAuthToken } from "../../../auth/organization"
import { generateUserAuthToken } from "../../../auth/user"

type Context = {
	body: {
		loginType: AuthRole
		googleUserId: string
	}
}

export const apiAuthLogin = new WebApi({
	endpoint: "/auth/login",
	requestBodySchema: T.object({
		loginType: T.string().trim().nonEmpty(),
		googleUserId: T.string().trim().nonEmpty(),
	}),
	handler: async ({ body: { loginType, googleUserId } }: Context) => {
		const [user] = await fetchUsers({ googleUserId })

		if (!user) {
			throw new ForbiddenError("User does not exist")
		}

		if (loginType == AuthRole.ORGANIZATION && user.isAdmin) {
			return generateOrganizationAuthToken({
				organizationId: user.organizationId.toString(),
				userId: user._id,
			})
		}

		return generateUserAuthToken({ userId: user._id })
	},
})
