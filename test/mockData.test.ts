import { expect } from "chai"
import { Answer, Comment, Discussion, Organization, User } from "../src/dbModel"
import { fetchAnswers } from "../src/services/mongo/answer"
import { fetchComments } from "../src/services/mongo/comment"
import { fetchDiscussions } from "../src/services/mongo/discussion"
import { fetchOrganizations } from "../src/services/mongo/organization"
import { fetchUsers } from "../src/services/mongo/user"
import { randomValueFromArray } from "../src/utils/utils"
import { cleanDatabase } from "./db"
import { generateAnswer } from "./resources/answer"
import { generateComment } from "./resources/comment"
import { generateDiscussion } from "./resources/dicussion"
import { generateOrganization } from "./resources/organization"
import { generateUser } from "./resources/user"

let users: User[] = []
let organizations: Organization[] = []
let discussions: Discussion[] = []
let answers: Answer[] = []
let comments: Comment[] = []

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
			const organizationId = randomValueFromArray(organizations)._id
			await generateUser({
				organizationId,
				isAdmin: i % 10 === 0 ? true : false,
			})
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

	it("generates answers", async () => {
		const generateAnswerCount: number = 500

		for (let i = 0; i < generateAnswerCount; i++) {
			const discussion = randomValueFromArray(discussions)

			await generateAnswer({ discussionId: discussion._id.toString() })
		}

		const [answerData] = await fetchAnswers({ limit: generateAnswerCount })

		if (answerData) {
			const { documents: answerList } = answerData as any
			answers = answerList as Answer[]
		}

		expect(answers.length).to.equal(500)
	})

	it("generates comments", async () => {
		const generateCommentCount: number = 500

		for (let i = 0; i < generateCommentCount; i++) {
			const answer = randomValueFromArray(answers)

			await generateComment({
				answerId: answer._id.toString(),
			})
		}

		const commentList = await fetchComments()
		if (commentList) {
			comments = commentList as Comment[]
		}

		expect(comments.length).to.equal(500)
	})
})
