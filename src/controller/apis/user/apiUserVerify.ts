import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { updateUser } from "../../../services/mongo/user"
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
		await updateUser({ id: body.userId, update: { isVerified: body.status } })
	},
})
