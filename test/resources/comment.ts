import faker from "faker"
import { random } from "lodash"
import { User } from "../../src/dbModel"
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

	const discussionParticipants = discussion.participantIds as User[]
	const discussionViewers = discussion.viewerIds as User[]
	const discussionUsers = discussionParticipants.concat(discussionViewers)

	const userId = randomValueFromArray(discussionParticipants)._id.toString()

	const upvoteIds: string[] = []

	for (let i = 0; i < random(0, discussionUsers.length); i++) {
		upvoteIds.push(randomValueFromArray(discussionUsers)._id)
	}

	const downvoteIds: string[] = []
	for (let i = 0; i < random(0, discussionUsers.length); i++) {
		downvoteIds.push(randomValueFromArray(discussionUsers)._id)
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
