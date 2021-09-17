import { expect } from "chai"
import { webApiRequest } from "../.."
import { AuthRole } from "../../../src/controller/auth"
import { cleanDatabase } from "../../db"
import { generateOrganization } from "../../resources/organization"
import { generateUser } from "../../resources/user"
import { WebApiResponseStatus } from "../../setup"

const endpoint = "/user/get"

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

	it("Fail: all users as public", async () => {
		await webApiRequest(endpoint, {
			method: "get",
			expectedStatus: WebApiResponseStatus.UNAUTHORISED,
		})
	})

	Object.values(AuthRole).map((role) => {
		it(`Success: get user as ${role}`, async () => {
			const res = await webApiRequest(endpoint, {
				method: "get",
				auth: {
					organizationId: loginOrganizationId,
					role: role,
					userId: loginUserId,
				},
			})

			expect(res)
				.to.be.an("array")
				.of.length(1)
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
	})
})
