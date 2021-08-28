import { T, WebApi } from "@hkbyte/webapi"
import { mongoOrganizationAdd } from "../../../../services/mongo/organization/mongoOrganizationAdd"
import { mongoOrganizationUpdate } from "../../../../services/mongo/organization/mongoOrganizationUpdate"
import { mongoUserAdd } from "../../../../services/mongo/user/mongoUserAdd"
import { validateEmail } from "../../../../utils/validators"
import { generateOrganizationAuthToken } from "../../../auth/organization"

type Context = {
	body: {
		name: string
		organizationName: string
		email: string
		googleUserId: string
	}
}

export const apiAuthRegisterOrganization = new WebApi({
	endpoint: "/auth/register/organization",
	requestBodySchema: T.object({
		name: T.string().trim().nonEmpty(),
		organizationName: T.string().trim().nonEmpty(),
		email: validateEmail(),
		googleUserId: T.string().trim().nonEmpty(),
	}),
	handler: async ({
		body: { name, email, organizationName, googleUserId },
	}: Context) => {
		const organizationId = await mongoOrganizationAdd({ name: organizationName })

		const userId = await mongoUserAdd({
			email,
			name,
			organizationId,
			googleUserId,
			isAdmin: true,
		})

		await mongoOrganizationUpdate({
			id: organizationId,
			update: { userId },
		})

		return generateOrganizationAuthToken({
			organizationId,
		})
	},
})