import faker from "faker"
import { addOrganization } from "../../src/services/mongo/organization"

export async function generateOrganization({ name }: { name?: string } = {}) {
	if (!name) name = faker.company.companyName()
	const created = await addOrganization({ name })
	return created
}
