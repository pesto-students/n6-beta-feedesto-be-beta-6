import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { mongoUserDelete } from "../../../services/mongo/user/mongoUserDelete"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		id: string
	}
}

export const apiUserDelete = new WebApi({
	endpoint: "/user",
	requestBodySchema: T.object({
		id: T.string().trim().mongoObjectId(),
	}),
	method: RequestMethod.DELETE,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION)],
	handler: async ({ body }: Context) => {
		const created = await mongoUserDelete(body)
		return { created }
	},
})