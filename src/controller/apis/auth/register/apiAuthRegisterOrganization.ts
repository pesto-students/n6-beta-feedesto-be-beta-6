import { T, WebApi } from "@hkbyte/webapi"
import { addOrganization } from "../../../../services/mongo/organization"
import { addUser } from "../../../../services/mongo/user"
import { validateEmail } from "../../../../utils/validators"
import { generateOrganizationAuthToken } from "../../../auth/organization"

type Context = {
	body: {
		name: string
		organizationName: string
		email: string
		googleUserId: string
		googleAvatarUrl?: string
	}
}

export const apiAuthRegisterOrganization = new WebApi({
	endpoint: "/auth/register/organization",
	requestBodySchema: T.object({
		name: T.string().trim().nonEmpty(),
		organizationName: T.string().trim().nonEmpty(),
		email: validateEmail(),
		googleUserId: T.string().trim().nonEmpty(),
		googleAvatarUrl: T.string().trim().optional(),
	}),
	handler: async ({
		body: { name, email, organizationName, googleUserId, googleAvatarUrl },
	}: Context) => {
		const organizationId = await addOrganization({
			name: organizationName,
		})

		const userId = await addUser({
			email,
			name,
			organizationId,
			googleUserId,
			googleAvatarUrl,
			isAdmin: true,
		})

		return generateOrganizationAuthToken({
			organizationId,
			userId,
		})
	},
})
