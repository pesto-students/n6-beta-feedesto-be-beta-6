import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { addComment } from "../../../services/mongo/comment"
import { RequestLocals } from "../../../utils/types"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		answerId: string
		userId: string
		content: string
	}
	locals: RequestLocals
}

export const apiCommentAdd = new WebApi({
	endpoint: "/comment",
	requestBodySchema: T.object({
		answerId: T.string().mongoObjectId(),
		userId: T.string().mongoObjectId().optional(),
		content: T.string().trim().nonEmpty(),
	}),
	method: RequestMethod.POST,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION, AuthRole.USER)],
	handler: async ({ body, locals }: Context) => {
		if (locals.session.role === AuthRole.USER) {
			body.userId = locals.session.userId
		}
		const created = await addComment(body)
		return { created }
	},
})
