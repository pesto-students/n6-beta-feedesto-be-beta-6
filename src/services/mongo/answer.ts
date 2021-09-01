import { InternalServerError, InvalidArgumentError } from "@hkbyte/webapi"
import _ from "lodash"
import { LeanDocument } from "mongoose"
import { useAnswerDbModel } from "../../dbModel"
import { Answer } from "../../dbModel"

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

	return insertAnswer._id.toString()
}

export async function deleteAnswer({ _id }: { _id: string }) {
	const answerModel = useAnswerDbModel()

	if (!_id) {
		throw new InvalidArgumentError("Filter missing for deleting answer")
	}

	await answerModel.deleteById(_id)
}
