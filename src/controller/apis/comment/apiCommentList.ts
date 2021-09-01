import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { fetchComments } from "../../../services/mongo/comment"
import { RequestLocals } from "../../../utils/types"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	query: {
		id?: string
		answerId?: string
		userId?: string
	}
	locals: RequestLocals
}

export const apiCommentList = new WebApi({
	endpoint: "/comment",
	requestQuerySchema: T.object({
		id: T.string().optional(),
		answerId: T.string().optional(),
		userId: T.string().optional(),
	}).optional(),
	method: RequestMethod.GET,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION, AuthRole.USER)],
	handler: async ({ query, locals: { session } }: Context) => {
		const commentList = await fetchComments(query)

		// Hiding User of a given comment
		if (session.role !== AuthRole.ORGANIZATION) {
			commentList.forEach((el) => {
				// @ts-ignore
				el.userId = null
			})
		}

		return commentList
	},
})
