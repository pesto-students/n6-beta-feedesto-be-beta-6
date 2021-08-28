import { BadRequestError, T, WebApi, _ } from "@hkbyte/webapi"
import { mongoOrganizationList } from "../../../../services/mongo/organization/mongoOrganizationList"
import { mongoUserAdd } from "../../../../services/mongo/user/mongoUserAdd"
import { validateEmail } from "../../../../utils/validators"
import { generateUserAuthToken } from "../../../auth/user"

type Context = {
	body: {
		name: string
		email: string
		googleUserId: string
		organizationId: string
	}
}

export const apiAuthRegisterUser = new WebApi({
	endpoint: "/auth/register/user",
	requestBodySchema: T.object({
		name: T.string().trim().nonEmpty(),
		email: validateEmail(),
		googleUserId: T.string().trim().nonEmpty(),
		organizationId: T.string().trim().nonEmpty(),
	}),
	handler: async ({ body }: Context) => {
		const checkOrganizationExist = await mongoOrganizationList({
			id: body.organizationId,
		})
		if (_.isEmpty(checkOrganizationExist)) {
			throw new BadRequestError("Organization not found !")
		}

		const userId = await mongoUserAdd(body)

		return generateUserAuthToken({
			userId,
		})
	},
})
