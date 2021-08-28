import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { mongoCommentAdd } from "../../../services/mongo/comment/mongoCommentAdd"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		answerId: string
		userId: string
		content: string
	}
}

export const apiCommentAdd = new WebApi({
	endpoint: "/answer",
	requestBodySchema: T.object({
		answerId: T.string().mongoObjectId(),
		userId: T.string().mongoObjectId(),
		content: T.string().trim().nonEmpty(),
	}),
	method: RequestMethod.POST,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION, AuthRole.USER)],
	handler: async ({ body }: Context) => {
		const created = await mongoCommentAdd(body)
		return { created }
	},
})
