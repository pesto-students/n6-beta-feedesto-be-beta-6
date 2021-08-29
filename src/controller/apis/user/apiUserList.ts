import { RequestMethod, WebApi } from "@hkbyte/webapi"
import { mongoUserList } from "../../../services/mongo/user/mongoUserList"
import { RequestLocals } from "../../../utils/types"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	locals: RequestLocals
}

export const apiUserList = new WebApi({
	endpoint: "/user",
	method: RequestMethod.GET,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION)],
	handler: async ({ locals }: Context) => {
		const organizationId = locals.session.organizationId

		return await mongoUserList({
			organizationId,
		})
	},
})
