import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { Answer, Comment, User } from "../../../dbModel"
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
		const [{ documents: answerList }]: { documents: Answer[] }[] =
			(await fetchAnswers(query)) as any

		// Hiding User of a given answer
		if (session.role !== AuthRole.ORGANIZATION) {
			answerList.forEach((el) => {
				// @ts-ignore
				if (session.userId != el.userId) el.userId = null
			})
		}

		return answerList.map((answer) => {
			const hasUpvoted: boolean =
				answer.upvoteIds.findIndex((user: User) => {
					return session.userId == user._id.toString()
				}) > -1

			const hasDownvoted: boolean =
				answer.downvoteIds.findIndex((user: User) => {
					return session.userId == user._id.toString()
				}) > -1

			const answerComments = answer.comments.map((comment: Comment) => {
				const hasUpvoted: boolean =
					comment.upvoteIds.findIndex((user: User) => {
						return session.userId == user._id.toString()
					}) > -1

				const hasDownvoted: boolean =
					comment.downvoteIds.findIndex((user: User) => {
						return session.userId == user._id.toString()
					}) > -1
				return {
					...comment,
					hasUpvoted,
					hasDownvoted,
					upvoteCount: comment.upvoteIds.length,
					downvoteCount: comment.downvoteIds.length,
					upvoteIds: undefined,
					downvoteIds: undefined,
					userId: undefined,
				}
			})

			return {
				...answer,
				hasUpvoted,
				hasDownvoted,
				upvoteCount: answer.upvoteIds.length,
				downvoteCount: answer.downvoteIds.length,
				comments: answerComments,
				commentIds: undefined,
				downvotes: answer.downvoteIds,
				downvoteIds: undefined,
				upvotes: answer.upvoteIds,
				upvoteIds: undefined,
			}
		})
	},
})
