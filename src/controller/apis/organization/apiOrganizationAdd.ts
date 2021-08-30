import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { addOrganization } from "../../../services/mongo/organization"

type Context = {
	body: {
		name: string
		userId: string
	}
}

export const apiOrganizationAdd = new WebApi({
	endpoint: "/organization",
	requestBodySchema: T.object({
		name: T.string().trim().nonEmpty(),
		userId: T.string().mongoObjectId(),
	}),
	method: RequestMethod.POST,
	middlewares: [],
	handler: async ({ body: { name, userId } }: Context) => {
		return await addOrganization({
			name,
			userId,
		})
	},
})
