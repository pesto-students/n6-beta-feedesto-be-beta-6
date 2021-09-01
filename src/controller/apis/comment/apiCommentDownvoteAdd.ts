import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { addCommentDownvote } from "../../../services/mongo/comment"
import { RequestLocals } from "../../../utils/types"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		commentId: string
		userId: string
	}
	locals: RequestLocals
}

export const apiCommentAddDownvote = new WebApi({
	endpoint: "/comment/downvote",
	requestBodySchema: T.object({
		commentId: T.string().mongoObjectId(),
		userId: T.string().mongoObjectId().optional(),
	}),
	method: RequestMethod.POST,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION, AuthRole.USER)],
	handler: async ({ body, locals }: Context) => {
		if (locals.session.role === AuthRole.USER) {
			body.userId = locals.session.userId
		}
		await addCommentDownvote(body)
	},
})
