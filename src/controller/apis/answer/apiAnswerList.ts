import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { fetchAnswers } from "../../../services/mongo/answer"
import { RequestLocals } from "../../../utils/types"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	query: {
		_id?: string
		discussionId?: string
		userId?: string
	}
	locals: RequestLocals
}

export const apiAnswerList = new WebApi({
	endpoint: "/answer",
	requestQuerySchema: T.object({
		_id: T.string().mongoObjectId().optional(),
		discussionId: T.string().mongoObjectId().optional(),
		userId: T.string().mongoObjectId().optional(),
	}).optional(),
	method: RequestMethod.GET,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION, AuthRole.USER)],
	handler: async ({ query, locals: { session } }: Context) => {
		const answerList = await fetchAnswers(query)

		// Hiding User of a given answer
		if (session.role !== AuthRole.ORGANIZATION) {
			answerList.forEach((el) => {
				// @ts-ignore
				if (session.userId != el.userId) el.userId = null
			})
		}

		return answerList
	},
})
