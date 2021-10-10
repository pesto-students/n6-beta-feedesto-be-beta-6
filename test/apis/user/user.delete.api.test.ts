import { webApiRequest } from "../.."
import { AuthRole } from "../../../src/controller/auth"
import { cleanDatabase } from "../../db"
import { generateOrganization } from "../../resources/organization"
import { generateUser } from "../../resources/user"
import { WebApiResponseStatus } from "../../setup"

const endpoint = "/user"

describe(`API: ${endpoint}`, () => {
	let loginUserId: string
	let loginOrganizationId: string

	before(async () => {
		await cleanDatabase()

		const organization = await generateOrganization()
		loginOrganizationId = organization.id

		const user = await generateUser({
			isAdmin: true,
			organizationId: loginOrganizationId,
		})
		loginUserId = user.id

		await generateUser({ organizationId: loginOrganizationId })
	})

	it("Success: as admin", async () => {
		await webApiRequest(endpoint, {
			method: "delete",
			auth: {
				organizationId: loginOrganizationId,
				role: AuthRole.ORGANIZATION,
				userId: loginUserId,
			},
		})
	})

	it("Fail: as public", async () => {
		await webApiRequest(endpoint, {
			method: "delete",
			expectedStatus: WebApiResponseStatus.UNAUTHORISED,
		})
	})

	it("Fail: as user", async () => {
		await webApiRequest(endpoint, {
			method: "delete",
			auth: {
				role: AuthRole.USER,
				userId: loginUserId,
			},
			expectedStatus: WebApiResponseStatus.FORBIDDEN,
		})
	})
})
