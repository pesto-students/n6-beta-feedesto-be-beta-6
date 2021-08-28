import { ForbiddenError, T, WebApi, _ } from "@hkbyte/webapi"
import { mongoUserList } from "../../../../services/mongo/user/mongoUserList"
import { generateOrganizationAuthToken } from "../../../auth/organization"
import { generateUserAuthToken } from "../../../auth/user"

type Context = {
	body: {
		googleUserId: string
	}
}

export const apiAuthLogin = new WebApi({
	endpoint: "/auth/login",
	requestBodySchema: T.object({
		googleUserId: T.string().trim().nonEmpty(),
	}),
	handler: async ({ body: { googleUserId } }: Context) => {
		const [user] = await mongoUserList({ googleUserId })
		if (!user) {
			throw new ForbiddenError("User does not exist")
		}

		if (user.isAdmin) {
			return generateOrganizationAuthToken({ organizationId: user.organizationId })
		}

		return generateUserAuthToken({ userId: user.id })
	},
})