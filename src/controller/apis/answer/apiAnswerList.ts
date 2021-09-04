import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import {
	fetchOrganizationAnswers,
	fetchUserAnswers,
} from "../../../services/mongo/answer"
import { RequestLocals } from "../../../utils/types"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	query: {
		_id?: string
		discussionId?: string
		userId?: string
		limit?: number
		pageNumber?: number
	}
	locals: RequestLocals
}

export const apiAnswerList = new WebApi({
	endpoint: "/answer",
	requestQuerySchema: T.object({
		_id: T.string().mongoObjectId().optional(),
		discussionId: T.string().mongoObjectId().optional(),
		userId: T.string().mongoObjectId().optional(),
		limit: T.number().optional(),
		pageNumber: T.number().optional(),
	}).optional(),
	method: RequestMethod.GET,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION, AuthRole.USER)],
	handler: async ({ query, locals: { session } }: Context) => {
		if (session.role === AuthRole.ORGANIZATION) {
			return fetchOrganizationAnswers({
				discussionId: query.discussionId,
				limit: query.limit,
				pageNumber: query.pageNumber,
			})
		} else {
			return fetchUserAnswers({
				userId: session.userId,
				discussionId: query.discussionId,
				limit: query.limit,
				pageNumber: query.pageNumber,
			})
		}
	},
})
