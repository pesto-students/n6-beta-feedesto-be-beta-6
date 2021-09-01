import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { updateUser } from "../../../services/mongo/user"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		_id: string
		update: {
			name?: string
			isVerified?: boolean
		}
	}
}

export const apiUserUpdate = new WebApi({
	endpoint: "/user",
	requestBodySchema: T.object({
		_id: T.string().mongoObjectId(),
		update: T.object({
			name: T.string().optional(),
			isVerified: T.boolean().optional(),
		}),
	}),
	method: RequestMethod.PUT,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION)],
	handler: async ({ body }: Context) => {
		await updateUser(body)
	},
})
