import { parseIsoDate } from "../../../utils/utils"
import { collection } from "../collections"
import { mongoRunner } from "../mongoRunner"
import { checkAndGetObjectId } from "../utils"

export type Organization = {
	id: string
	name: string
	userId: string
	createdAt: string
	modifiedAt: string
}

export async function mongoOrganizationList({
	id,
	name,
}: {
	id?: string
	name?: string
} = {}): Promise<Organization[]> {
	const tokenFindFilter: any = {}
	if (id) tokenFindFilter._id = checkAndGetObjectId(id)
	if (name) tokenFindFilter.name = name

	const db = await mongoRunner()

	const queryBuilder = db.collection(collection.organizations).find(tokenFindFilter)

	const organizationList = await queryBuilder.toArray()
	return organizationList.map((el) => {
		return {
			id: el._id,
			name: el.name,
			userId: el.userId,
			createdAt: parseIsoDate(el.createdAt),
			modifiedAt: parseIsoDate(el.modifiedAt),
		}
	})
}
