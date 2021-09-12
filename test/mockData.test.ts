import { expect } from "chai"
import { Discussion, Organization, User } from "../src/dbModel"
import { fetchDiscussions } from "../src/services/mongo/discussion"
import { fetchOrganizations } from "../src/services/mongo/organization"
import { fetchUsers } from "../src/services/mongo/user"
import { cleanDatabase } from "./db"
import { generateDiscussion } from "./resources/dicussion"
import { generateOrganization } from "./resources/organization"
import { generateUser } from "./resources/user"

let users: User[] = []
let organizations: Organization[] = []
let discussions: Discussion[] = []
// let answers: Answer[] = []

describe("mock test:", () => {
	before(async () => {
		await cleanDatabase()
	})

	it("generates organizations", async () => {
		const generateOrganizationCount: number = 10

		for (let i = 0; i < generateOrganizationCount; i++) {
			await generateOrganization()
		}
		const organizationList = await fetchOrganizations()
		if (organizationList) {
			organizations = organizationList as Organization[]
		}

		expect(organizations.length).to.equal(10)
	})

	it("generates users", async () => {
		const generateUserCount: number = 200

		for (let i = 0; i < generateUserCount; i++) {
			const organizationId = organizations[i % 10]._id
			await generateUser({ organizationId, isAdmin: i % 10 === 0 ? true : false })
		}
		const userList = await fetchUsers()
		if (userList) {
			users = userList as User[]
		}

		expect(users.length).to.equal(200)
	})

	it("generates discussions", async () => {
		const generateDiscussionCount: number = 50

		for (let i = 0; i < generateDiscussionCount; i++) {
			const organizationId = organizations[i % 10]._id
			await generateDiscussion({
				organizationId,
			})
		}

		const discussionList = await fetchDiscussions()
		if (discussionList) {
			discussions = discussionList as Discussion[]
		}

		expect(discussions.length).to.equal(50)
	})
})
