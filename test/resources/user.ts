import faker from "faker"
import { addUser } from "../../src/services/mongo/user"

export async function generateUser({ organizationId }: { organizationId: string }) {
	let name = faker.name.firstName()
	let email = faker.internet.email()
	const created = await addUser({
		name,
		email,
		googleUserId: email,
		organizationId,
	})
	return created
}
