import { InternalServerError, InvalidArgumentError } from "@hkbyte/webapi"
import { LeanDocument } from "mongoose"
import { Answer, Comment, useAnswerDbModel, User } from "../../dbModel"
import { checkAndGetObjectId } from "../../utils/utils"

export async function fetchAnswers({
	_id,
	discussionId,
	userId,
}: {
	_id?: string
	discussionId?: string
	userId?: string
} = {}): Promise<LeanDocument<Answer>[]> {
	const answerModel = useAnswerDbModel()

	if (_id) {
		const answer = await answerModel.findById(_id)
		return answer ? [answer] : []
	}

	if (discussionId) {
		return answerModel.findAll({ discussionId })
	}

	if (userId) {
		return answerModel.findAll({ userId })
	}

	return answerModel.findAll()
}

export async function fetchOrganizationAnswers({
	discussionId,
	limit,
	pageNumber,
}: { discussionId?: string; limit?: number; pageNumber?: number } = {}) {
	const answerModel = useAnswerDbModel()
	const [{ documents: answerList }]: { documents: Answer[] }[] =
		(await answerModel.findAll({ discussionId, limit, pageNumber })) as any

	return answerList.map((answer) => {
		const answerComments = answer.comments.map((comment: Comment) => {
			return {
				...comment,
				upvoteCount: comment.upvoteIds.length,
				downvoteCount: comment.downvoteIds.length,
			}
		})
		return {
			...answer,
			comments: answerComments,
			upvoteCount: answer.upvoteIds.length,
			downvoteCount: answer.downvoteIds.length,
		}
	})
}

export async function fetchUserAnswers({
	userId,
	discussionId,
	limit,
	pageNumber,
}: {
	userId: string
	discussionId?: string
	limit?: number
	pageNumber?: number
}) {
	const answerModel = useAnswerDbModel()
	const [{ documents: answerList }]: { documents: Answer[] }[] =
		(await answerModel.findAll({ discussionId, limit, pageNumber })) as any

	return answerList.map((answer) => {
		const answerComments = answer.comments.map((comment: Comment) => {
			// Checking Upvotes & Downvotes
			const hasUpvoted: boolean =
				comment.upvoteIds.findIndex((user: User) => {
					return userId == user._id.toString()
				}) > -1
			const hasDownvoted: boolean =
				comment.downvoteIds.findIndex((user: User) => {
					return userId == user._id.toString()
				}) > -1

			const isUserComment = comment.userId == checkAndGetObjectId(userId)

			return {
				...comment,
				hasUpvoted,
				hasDownvoted,
				upvoteCount: comment.upvoteIds.length,
				downvoteCount: comment.downvoteIds.length,
				upvoteIds: undefined,
				downvoteIds: undefined,
				userId: isUserComment ? comment.userId : undefined,
			}
		})

		const hasUpvoted: boolean =
			answer.upvoteIds.findIndex((user: User) => {
				return userId == user._id.toString()
			}) > -1
		const hasDownvoted: boolean =
			answer.downvoteIds.findIndex((user: User) => {
				return userId == user._id.toString()
			}) > -1
		const isUserAnswer = answer.userId == userId
		return {
			...answer,
			comments: answerComments,
			commentIds: undefined,
			upvotes: undefined,
			upvoteIds: undefined,
			hasUpvoted,
			upvoteCount: answer.upvoteIds.length,
			downvotes: undefined,
			downvoteIds: undefined,
			hasDownvoted,
			downvoteCount: answer.downvoteIds.length,
			userId: isUserAnswer ? answer.userId : undefined,
		}
	})
}

export async function addAnswer({
	content,
	discussionId,
	userId,
}: {
	discussionId: string
	userId: string
	content: string
}): Promise<string> {
	const answerModel = useAnswerDbModel()

	const insertAnswer = await answerModel.create({
		content,
		discussionId,
		userId,
	})
	if (!insertAnswer) {
		throw new InternalServerError("Something went wrong: unable to add answer")
	}

	return insertAnswer.id.toString()
}

export async function addAnswerUpvote({
	answerId,
	userId,
}: {
	answerId: string
	userId: string
}) {
	const answerModel = useAnswerDbModel()

	const [answer] = await fetchAnswers({ _id: answerId })
	if (!answer) {
		throw new InvalidArgumentError("Answer not found")
	}

	const findUserUpvoted = answer.upvoteIds.find((el: any) => el.toString() == userId)
	if (findUserUpvoted) {
		throw new InvalidArgumentError("User has already upvoted to this answer")
	}

	const updateAnswerUpvotes = await answerModel.findByIdAndUpdate(answerId, {
		upvoteIds: [...answer.upvoteIds.map((el: any) => el.toString()), userId],
	})
	if (!updateAnswerUpvotes) {
		throw new InternalServerError("Something went wrong: unable to add answer upvote")
	}
}

export async function addAnswerDownvote({
	answerId,
	userId,
}: {
	answerId: string
	userId: string
}) {
	const answerModel = useAnswerDbModel()

	const [answer] = await fetchAnswers({ _id: answerId })
	if (!answer) {
		throw new InvalidArgumentError("Answer not found")
	}

	const findUserUpvoted = answer.downvoteIds.find((el: any) => el.toString() == userId)
	if (findUserUpvoted) {
		throw new InvalidArgumentError("User has already downvoted to this answer")
	}

	const updateAnswerUpvotes = await answerModel.findByIdAndUpdate(answerId, {
		downvoteIds: [...answer.downvoteIds.map((el: any) => el.toString()), userId],
	})
	if (!updateAnswerUpvotes) {
		throw new InternalServerError(
			"Something went wrong: unable to add answer downvote",
		)
	}
}

export async function deleteAnswer({ _id }: { _id: string }) {
	const answerModel = useAnswerDbModel()

	if (!_id) {
		throw new InvalidArgumentError("Filter missing for deleting answer")
	}

	await answerModel.deleteById(_id)
}
