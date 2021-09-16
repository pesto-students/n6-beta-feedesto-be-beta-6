import { expect } from "chai"
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

	it("Success: all users as admin", async () => {
		const res = await webApiRequest(endpoint, {
			method: "get",
			auth: {
				organizationId: loginOrganizationId,
				role: AuthRole.ORGANIZATION,
				userId: loginUserId,
			},
		})
		expect(res).length(2)

		expect(res)
			.to.be.an("array")
			.include.a.thing.with.any.keys(
				"_id",
				"name",
				"organizationId",
				"organization",
				"verified",
				"verifiedAt",
				"createdAt",
				"updatedAt",
			)
	})

	it("Fail: all users as public", async () => {
		await webApiRequest(endpoint, {
			method: "get",
			expectedStatus: WebApiResponseStatus.UNAUTHORISED,
		})
	})

	it("Fail: all users as user", async () => {
		await webApiRequest(endpoint, {
			method: "get",
			auth: {
				role: AuthRole.USER,
				userId: loginUserId,
			},
			expectedStatus: WebApiResponseStatus.FORBIDDEN,
		})
	})
})
