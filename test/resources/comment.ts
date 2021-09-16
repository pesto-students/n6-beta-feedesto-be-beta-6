import faker from "faker"
import { random } from "lodash"
import { fetchAnswers } from "../../src/services/mongo/answer"
import { addComment } from "../../src/services/mongo/comment"
import { fetchDiscussions } from "../../src/services/mongo/discussion"
import { randomValueFromArray } from "../../src/utils/utils"

export async function generateComment({ answerId }: { answerId: string }) {
	const content = faker.lorem.lines(2)

	const [answer] = await fetchAnswers({
		_id: answerId,
	})

	const [discussion] = await fetchDiscussions({
		_id: answer.discussionId.toString(),
	})

	const discussionParticipants = discussion.participantIds as string[]
	const discussionViewers = discussion.viewerIds as string[]
	const discussionUsers = discussionParticipants.concat(discussionViewers)

	const userId = randomValueFromArray(discussionParticipants).toString()

	const upvoteIds: string[] = []
	for (let i = 0; i < random(0, discussionUsers.length); i++) {
		const user = randomValueFromArray(discussionUsers)

		// Filling only unique user ids
		const findUser = upvoteIds.find((el) => el == user)
		if (!findUser) {
			upvoteIds.push(user)
		}
	}

	const downvoteIds: string[] = []
	for (let i = 0; i < random(0, discussionUsers.length); i++) {
		const user = randomValueFromArray(discussionUsers)

		// Filling only unique user ids
		const findUser = downvoteIds.find((el) => el == user)
		if (!findUser) {
			downvoteIds.push(user)
		}
	}

	const created = await addComment({
		content,
		answerId,
		userId,
		upvoteIds,
		downvoteIds,
	})
	return created
}
