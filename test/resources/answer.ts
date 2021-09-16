import faker from "faker"
import { random } from "lodash"
import { addAnswer } from "../../src/services/mongo/answer"
import { fetchDiscussions } from "../../src/services/mongo/discussion"
import { randomValueFromArray } from "../../src/utils/utils"

export async function generateAnswer({ discussionId }: { discussionId: string }) {
	const content = faker.lorem.lines(3)

	const [discussion] = await fetchDiscussions({ _id: discussionId })

	const discussionParticipants = discussion.participantIds as string[]
	const discussionViewers = discussion.viewerIds as string[]
	const discussionUsers = discussionParticipants.concat(discussionViewers)

	const userId = randomValueFromArray(discussionParticipants).toString()

	const upvoteIds: string[] = []
	for (let i = 0; i < random(0, discussionUsers.length); i++) {
		const user = randomValueFromArray(discussionUsers)
		const findUser = upvoteIds.find((el) => el == user)
		if (!findUser) {
			upvoteIds.push(user)
		}
	}

	const downvoteIds: string[] = []
	for (let i = 0; i < random(0, discussionUsers.length); i++) {
		const user = randomValueFromArray(discussionUsers)
		const findUser = downvoteIds.find((el) => el == user)
		if (!findUser) {
			downvoteIds.push(user)
		}
	}

	const created = await addAnswer({
		content,
		discussionId,
		userId,
		upvoteIds,
		downvoteIds,
	})
	return created
}
