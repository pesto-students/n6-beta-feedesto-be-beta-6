import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { mongoAnswerAdd } from "../../../services/mongo/answer/mongoAnswerAdd"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		discussionId: string
		userId: string
		content: string
	}
}

export const apiAnswerAdd = new WebApi({
	endpoint: "/answer",
	requestBodySchema: T.object({
		discussionId: T.string().mongoObjectId(),
		userId: T.string().mongoObjectId(),
		content: T.string().trim().nonEmpty(),
	}),
	method: RequestMethod.POST,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION, AuthRole.USER)],
	handler: async ({ body }: Context) => {
		const created = await mongoAnswerAdd(body)
		return { created }
	},
})
