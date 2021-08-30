import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { mongoAnswerAdd } from "../../../services/mongo/answer/mongoAnswerAdd"
import { RequestLocals } from "../../../utils/types"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		discussionId: string
		userId: string
		content: string
	}
	locals: RequestLocals
}

export const apiAnswerAdd = new WebApi({
	endpoint: "/answer",
	requestBodySchema: T.object({
		discussionId: T.string().mongoObjectId(),
		userId: T.string().mongoObjectId().optional(),
		content: T.string().trim().nonEmpty(),
	}),
	method: RequestMethod.POST,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION, AuthRole.USER)],
	handler: async ({ body, locals }: Context) => {
		if (locals.session.role === AuthRole.USER) {
			body.userId = locals.session.userId
		}
		const created = await mongoAnswerAdd(body)
		return { created }
	},
})
