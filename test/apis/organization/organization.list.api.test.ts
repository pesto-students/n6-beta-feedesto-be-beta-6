import { expect } from "chai"
import { webApiRequest } from "../.."
import { cleanDatabase } from "../../db"
import { generateOrganization } from "../../resources/organization"

const endpoint = "/organization"
describe(`API: ${endpoint}`, () => {
	before(async () => {
		await cleanDatabase()
		await generateOrganization()
		await generateOrganization()
	})

	it("Success: all organizations", async () => {
		const res = await webApiRequest(endpoint, { method: "get" })
		expect(res).length(2)

		expect(res)
			.to.be.an("array")
			.include.a.thing.with.any.keys("_id", "name", "createdAt", "updatedAt")
	})
})
