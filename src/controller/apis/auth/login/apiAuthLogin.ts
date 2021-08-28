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
		idToken: T.string().trim().nonEmpty(),
	}),
	handler: async ({ body: { googleUserId } }: Context) => {
		const checkUserExist = await mongoUserList({ googleUserId })
		if (_.isEmpty(checkUserExist)) {
			throw new ForbiddenError("User does not exist")
		}

		if (checkUserExist[0].isAdmin) {
			return generateOrganizationAuthToken({
				organizationId: checkUserExist[0].organizationId,
			})
		}

		return generateUserAuthToken({
			userId: "user.id",
		})
	},
})
