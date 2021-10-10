import { RequestMethod, WebApi } from "@hkbyte/webapi"
import { fetchOrganizations } from "../../../services/mongo/organization"

export const apiOrganizationList = new WebApi({
	endpoint: "/organization",
	method: RequestMethod.GET,
	handler: async () => fetchOrganizations(),
})
