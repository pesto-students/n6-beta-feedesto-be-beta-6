import dayjs from "dayjs"
import faker from "faker"
import { addDiscussion } from "../../src/services/mongo/discussion"

export async function generateDiscussion({ organizationId }: { organizationId: string }) {
	const title = faker.random.words()
	const description = faker.lorem.paragraphs(3)
	const startDate = faker.date
		.between(dayjs().subtract(15, "days").toDate(), dayjs().add(15, "days").toDate())
		.toString()
	const endDate = faker.date
		.between(dayjs().subtract(15, "days").toDate(), dayjs().add(15, "days").toDate())
		.toString()

	const created = await addDiscussion({
		title,
		organizationId,
		description,
		startDate,
		endDate,
		participantIds: [],
		viewerIds: [],
	})
	return created
}
