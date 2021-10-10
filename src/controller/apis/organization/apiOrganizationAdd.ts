import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { addOrganization } from "../../../services/mongo/organization"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		name: string
	}
}

export const apiOrganizationAdd = new WebApi({
	endpoint: "/organization",
	requestBodySchema: T.object({
		name: T.string().trim().nonEmpty(),
	}),
	method: RequestMethod.POST,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION)],
	handler: async ({ body: { name } }: Context) => {
		return await addOrganization({
			name,
		})
	},
})
