import { RequestMethod, WebApi } from "@hkbyte/webapi"
import { fetchUsers } from "../../../services/mongo/user"
import { RequestLocals } from "../../../utils/types"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	locals: RequestLocals
}

export const apiUserGet = new WebApi({
	endpoint: "/user/get",
	method: RequestMethod.GET,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION, AuthRole.USER)],
	handler: async ({ locals }: Context) => {
		const userId = locals.session.userId

		return await fetchUsers({
			id: userId,
		})
	},
})
