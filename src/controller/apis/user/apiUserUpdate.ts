import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { mongoUserUpdate } from "../../../services/mongo/user/mongoUserUpdate"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		id: string
		update: {
			name?: string
			isVerified?: boolean
		}
	}
}

export const apiUserUpdate = new WebApi({
	endpoint: "/user",
	requestBodySchema: T.object({
		id: T.string().mongoObjectId(),
		update: T.object({
			name: T.string().optional(),
			isVerified: T.boolean().optional(),
		}),
	}),
	method: RequestMethod.PUT,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION)],
	handler: async ({ body }: Context) => {
		const created = await mongoUserUpdate(body)
		return { created }
	},
})
