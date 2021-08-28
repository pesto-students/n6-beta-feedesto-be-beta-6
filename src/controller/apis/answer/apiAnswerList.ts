import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { mongoAnswerList } from "../../../services/mongo/answer/mongoAnswerList"
import { RequestLocals } from "../../../utils/types"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	query: {
		id?: string
		discussionId?: string
		userId?: string
	}
	locals: RequestLocals
}

export const apiAnswerList = new WebApi({
	endpoint: "/answer",
	requestQuerySchema: T.object({
		id: T.string().optional(),
		participantId: T.string().optional(),
		asParticipant: T.boolean().optional(),
	}).optional(),
	method: RequestMethod.GET,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION, AuthRole.USER)],
	handler: async ({ query, locals: { session } }: Context) => {
		const answerList = await mongoAnswerList(query)

		// Hiding User of a given answer
		if (session.role !== AuthRole.ORGANIZATION) {
			answerList.forEach((el) => {
				// @ts-ignore
				el.userId = null
			})
		}

		return answerList
	},
})
