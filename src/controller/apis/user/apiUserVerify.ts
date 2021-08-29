import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { mongoUserUpdate } from "../../../services/mongo/user/mongoUserUpdate"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		userId: string
		status: boolean
	}
}

export const apiUserVerify = new WebApi({
	endpoint: "/user/verify",
	requestBodySchema: T.object({
		userId: T.string().mongoObjectId(),
		status: T.boolean().optional(),
	}),
	method: RequestMethod.PUT,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION)],
	handler: async ({ body }: Context) => {
		await mongoUserUpdate({ id: body.userId, update: { isVerified: body.status } })
	},
})
