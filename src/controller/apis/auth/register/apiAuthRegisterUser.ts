import { BadRequestError, T, WebApi, _ } from "@hkbyte/webapi"
import { fetchOrganizations } from "../../../../services/mongo/organization"
import { addUser } from "../../../../services/mongo/user"
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
		organizationId: T.string().trim().mongoObjectId(),
	}),
	handler: async ({ body }: Context) => {
		const checkOrganizationExist = await fetchOrganizations({
			id: body.organizationId,
		})
		if (_.isEmpty(checkOrganizationExist)) {
			throw new BadRequestError("Organization not found !")
		}

		const userId = await addUser(body)

		return generateUserAuthToken({
			userId,
		})
	},
})
