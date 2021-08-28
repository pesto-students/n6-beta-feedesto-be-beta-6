import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { mongoOrganizationList } from "../../../services/mongo/organization/mongoOrganizationList"

export const apiOrganizationList = new WebApi({
	endpoint: "/organization",
	requestBodySchema: T.object({}).optional(),
	method: RequestMethod.GET,
	middlewares: [],
	handler: async () => {
		return await mongoOrganizationList()
	},
})
