import { InternalServerError, InvalidArgumentError } from "@hkbyte/webapi"
import { LeanDocument } from "mongoose"
import { Answer, Comment, useAnswerDbModel, useCommentDbModel, User } from "../../dbModel"

export async function fetchAnswers({
	_id,
	discussionId,
	userId,
	limit,
}: {
	_id?: string
	discussionId?: string
	userId?: string
	limit?: number
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

	return answerModel.findAll({ limit })
}

export async function fetchOrganizationAnswers({
	discussionId,
	limit,
	pageNumber,
}: { discussionId?: string; limit?: number; pageNumber?: number } = {}) {
	const answerModel = useAnswerDbModel()
	const answerList: Answer[] = (await answerModel.findAll({
		discussionId,
		limit,
		pageNumber,
	})) as Answer[]

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
	const answerList: Answer[] = (await answerModel.findAll({
		discussionId,
		limit,
		pageNumber,
	})) as Answer[]

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

			//@ts-ignore
			const isUserComment = comment.userId._id == userId

			return {
				...comment,
				hasUpvoted,
				hasDownvoted,
				upvoteCount: comment.upvoteIds.length,
				downvoteCount: comment.downvoteIds.length,
				upvoteIds: undefined,
				upvoters: undefined,
				downvoteIds: undefined,
				downvoters: undefined,
				userId: isUserComment ? comment.userId : undefined,
				user: isUserComment ? comment.user : undefined,
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

		//@ts-ignore
		const isUserAnswer = answer.userId._id == userId

		return {
			...answer,
			comments: answerComments,
			commentIds: undefined,
			hasUpvoted,
			hasDownvoted,
			upvoteCount: answer.upvoteIds.length,
			downvoteCount: answer.downvoteIds.length,
			upvoteIds: undefined,
			upvoters: undefined,
			downvoteIds: undefined,
			downvoters: undefined,
			userId: isUserAnswer ? answer.userId : undefined,
			user: isUserAnswer ? answer.user : undefined,
		}
	})
}

export async function addAnswer({
	content,
	discussionId,
	userId,
	commentIds,
	upvoteIds,
	downvoteIds,
}: {
	discussionId: string
	userId: string
	content: string
	commentIds?: string[]
	upvoteIds?: string[]
	downvoteIds?: string[]
}): Promise<string> {
	const answerModel = useAnswerDbModel()

	const insertAnswer = await answerModel.create({
		content,
		discussionId,
		userId,
		commentIds,
		upvoteIds,
		downvoteIds,
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

	const updateAnswerUpvotes = await answerModel.findByIdAndUpvoteOrDownvote(answerId, {
		upVoteId: userId,
	})

	return updateAnswerUpvotes
}

export async function addAnswerDownvote({
	answerId,
	userId,
}: {
	answerId: string
	userId: string
}) {
	const answerModel = useAnswerDbModel()

	const updateAnswerUpvotes = await answerModel.findByIdAndUpvoteOrDownvote(answerId, {
		downVoteId: userId,
	})

	return updateAnswerUpvotes
}
export async function findScoreByDiscussion({ _id }: { _id: string }) {
	const answerModel = useAnswerDbModel()
	const commentModel = useCommentDbModel()

	const answers = (await answerModel.findAll({
		discussionId: _id,
	})) as Answer[]

	let usersWithScore: (Partial<User> & {
		numberOfUpvotes: number
		numberOfDownvotes: number
		score: number
		answers: Answer[]
		comments: Comment[]
	})[] = []

	for (let i = 0; i < answers.length; i++) {
		const answer = answers[i]
		const findAnswerUser = usersWithScore.find(
			(user) => user._id.toString() == answer.user?._id.toString(),
		)

		if (!findAnswerUser) {
			usersWithScore.push({
				...answer.user,
				answers: [answer],
				comments: [],
				numberOfUpvotes: answer.upvoteIds.length,
				numberOfDownvotes: answer.downvoteIds.length,
				score: answer.upvoteIds.length - answer.downvoteIds.length,
			})
		} else {
			findAnswerUser.answers.push(answer)
			findAnswerUser.numberOfUpvotes += answer.upvoteIds.length
			findAnswerUser.numberOfDownvotes += answer.downvoteIds.length
			findAnswerUser.score =
				findAnswerUser.numberOfUpvotes - findAnswerUser.numberOfDownvotes
		}

		const comments = (await commentModel.findAll({
			answerId: answer._id,
		})) as Comment[]

		comments.forEach((comment) => {
			const findUser = usersWithScore.find(
				(user) => user._id.toString() == comment.user?._id.toString(),
			)

			if (!findUser) {
				usersWithScore.push({
					...comment.user,
					answers: [],
					comments: [comment],
					numberOfUpvotes: comment.upvoteIds.length,
					numberOfDownvotes: comment.downvoteIds.length,
					score: comment.upvoteIds.length - comment.downvoteIds.length,
				})
			} else {
				findUser.comments.push(comment)
				findUser.numberOfUpvotes += comment.upvoteIds.length
				findUser.numberOfDownvotes += comment.downvoteIds.length
				findUser.score = findUser.numberOfUpvotes - findUser.numberOfDownvotes
			}
		})
	}

	return usersWithScore.sort((a, b) => b.score - a.score)
}

export async function deleteAnswer({ _id }: { _id: string }) {
	const answerModel = useAnswerDbModel()

	if (!_id) {
		throw new InvalidArgumentError("Filter missing for deleting answer")
	}

	await answerModel.deleteById(_id)
}
