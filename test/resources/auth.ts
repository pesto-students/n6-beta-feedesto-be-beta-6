import { InvalidArgumentError } from "@hkbyte/webapi"
import { AuthObject } from ".."
import { AuthRole } from "../../src/controller/auth"
import { generateOrganizationAuthToken } from "../../src/controller/auth/organization"
import { generateUserAuthToken } from "../../src/controller/auth/user"
import { generateOrganization } from "./organization"
import { generateUser } from "./user"

export async function generateAuthToken({
	role,
	userId,
	organizationId,
}: AuthObject): Promise<string> {
	const isOrganization = (role && role === AuthRole.ORGANIZATION) || organizationId
	const isUser = (role && role === AuthRole.USER) || userId

	if (isOrganization) {
		return getOrganizationAuthToken(organizationId)
	}
	if (isUser) {
		return getUserAuthToken({ userId })
	}

	throw new InvalidArgumentError("Invalid Auth parameters")
}

async function getOrganizationAuthToken(organizationId: string | undefined) {
	if (!organizationId) organizationId = (await generateOrganization()).id
	const userId = (await generateUser()).id
	const adminAuth = await generateOrganizationAuthToken({ organizationId, userId })
	return `${AuthRole.ORGANIZATION} ${adminAuth.token}`
}

async function getUserAuthToken({
	userId,
	isAdmin,
}: {
	userId?: string
	isAdmin?: boolean
}) {
	if (!userId) {
		const user = await generateUser({ isAdmin })
		userId = user.id
	}

	const userAuth = await generateUserAuthToken({ userId })
	return `${AuthRole.USER} ${userAuth.token}`
}
