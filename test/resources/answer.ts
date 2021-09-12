import faker from "faker"
import { random } from "lodash"
import { User } from "../../src/dbModel"
import { addAnswer } from "../../src/services/mongo/answer"
import { fetchDiscussions } from "../../src/services/mongo/discussion"
import { fetchUsers } from "../../src/services/mongo/user"
import { randomValueFromArray } from "../../src/utils/utils"

export async function generateAnswer({
	discussionId,
	userId,
}: {
	discussionId: string
	userId: string
}) {
	const content = faker.lorem.lines(3)

	const [discussion] = await fetchDiscussions({
		_id: discussionId,
	})

	const orgUsers = (
		(await fetchUsers({
			organizationId: discussion.organizationId.toString(),
		})) as User[]
	).filter((el) => !el.isAdmin)

	const upvoteIds: string[] = []

	for (let i = 0; i < random(0, orgUsers.length); i++) {
		upvoteIds.push(randomValueFromArray(orgUsers)._id)
	}

	const downvoteIds: string[] = []
	for (let i = 0; i < random(0, orgUsers.length); i++) {
		downvoteIds.push(randomValueFromArray(orgUsers)._id)
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
