import dayjs from "dayjs"
import faker from "faker"
import { random } from "lodash"
import { User } from "../../src/dbModel"
import { addDiscussion } from "../../src/services/mongo/discussion"
import { fetchUsers } from "../../src/services/mongo/user"
import { randomValueFromArray } from "../../src/utils/utils"

export async function generateDiscussion({ organizationId }: { organizationId: string }) {
	const title = faker.random.words()
	const description = faker.lorem.paragraphs(3)
	const startDate = faker.date
		.between(dayjs().subtract(15, "days").toDate(), dayjs().add(15, "days").toDate())
		.toString()
	const endDate = faker.date
		.between(dayjs().subtract(15, "days").toDate(), dayjs().add(15, "days").toDate())
		.toString()

	const orgUsers = (
		(await fetchUsers({
			organizationId: organizationId.toString(),
		})) as User[]
	).filter((el) => !el.isAdmin)

	const participantIds: string[] = []
	for (let i = 0; i < random(1, orgUsers.length); i++) {
		const user = randomValueFromArray(orgUsers)
		const findUser = participantIds.find((el) => el == user._id)
		if (!findUser) {
			participantIds.push(user._id)
		}
	}

	const viewerIds: string[] = []
	for (let i = 0; i < random(0, orgUsers.length); i++) {
		const user = randomValueFromArray(orgUsers)
		const findUser = viewerIds.find((el) => el == user._id)
		if (!findUser) {
			viewerIds.push(user._id)
		}
	}

	const created = await addDiscussion({
		title,
		organizationId,
		description,
		startDate,
		endDate,
		participantIds,
		viewerIds,
	})
	return created
}
