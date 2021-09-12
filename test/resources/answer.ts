import faker from "faker"
import { addAnswer } from "../../src/services/mongo/answer"

export async function generateAnswer({
	discussionId,
	userId,
}: {
	discussionId: string
	userId: string
}) {
	const content = faker.lorem.lines(3)

	const created = await addAnswer({
		content,
		discussionId,
		userId,
	})
	return created
}
