import faker from "faker"
import { addUser } from "../../src/services/mongo/user"

export async function generateUser({
	organizationId,
	isAdmin,
}: {
	organizationId: string
	isAdmin?: boolean
}) {
	let name = faker.name.firstName() + " " + faker.name.lastName()
	let email = faker.internet.email()
	const created = await addUser({
		name,
		email,
		googleUserId: "",
		organizationId,
		isAdmin,
	})
	return created
}
