import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { addAnswerDownvote } from "../../../services/mongo/answer"
import { RequestLocals } from "../../../utils/types"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		answerId: string
		userId: string
	}
	locals: RequestLocals
}

export const apiAnswerAddDownvote = new WebApi({
	endpoint: "/answer/downvote",
	requestBodySchema: T.object({
		answerId: T.string().mongoObjectId(),
		userId: T.string().mongoObjectId().optional(),
	}),
	method: RequestMethod.POST,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION, AuthRole.USER)],
	handler: async ({ body, locals }: Context) => {
		if (locals.session.role === AuthRole.USER) {
			body.userId = locals.session.userId
		}
		await addAnswerDownvote(body)
	},
})
