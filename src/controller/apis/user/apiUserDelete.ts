import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { deleteUser } from "../../../services/mongo/user"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		_id: string
	}
}

export const apiUserDelete = new WebApi({
	endpoint: "/user",
	requestBodySchema: T.object({
		_id: T.string().trim().mongoObjectId(),
	}),
	method: RequestMethod.DELETE,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION)],
	handler: async ({ body }: Context) => {
		const created = await deleteUser(body)
		return { created }
	},
})
