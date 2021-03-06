import faker from "faker"
import { addUser } from "../../src/services/mongo/user"
import { generateOrganization } from "./organization"

export async function generateUser({
	organizationId,
	isAdmin,
}: {
	organizationId?: string
	isAdmin?: boolean
} = {}) {
	let name = faker.name.firstName() + " " + faker.name.lastName()
	let email = faker.internet.email()
	let googleAvatarUrl = faker.internet.avatar()
	if (!organizationId) {
		organizationId = (await generateOrganization()).id
	}

	const created = await addUser({
		name,
		email,
		googleUserId: "",
		organizationId,
		isAdmin,
		googleAvatarUrl,
	})
	return { id: created, name, email, organizationId }
}
