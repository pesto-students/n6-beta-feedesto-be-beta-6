import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { fetchUsers } from "../../../services/mongo/user"
import { RequestLocals } from "../../../utils/types"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	locals: RequestLocals
	query: {
		isSuperAdmin?: boolean
	}
}

export const apiUserList = new WebApi({
	endpoint: "/user",
	method: RequestMethod.GET,
	requestQuerySchema: T.object({
		isSuperAdmin: T.boolean(),
	}),
	middlewares: [authMiddleware(AuthRole.ORGANIZATION)],
	handler: async ({ locals, query: { isSuperAdmin } }: Context) => {
		const organizationId = locals.session.organizationId

		return await fetchUsers({
			organizationId: isSuperAdmin == true ? undefined : organizationId,
		})
	},
})
