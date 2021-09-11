//@ts-nocheck
import moment from "moment"
import mongoose from "mongoose"

import { AnswerModel } from "../dbModel/answer/schema"
import { UserModel } from "../dbModel/user/schema"
import { OrganizationModel } from "../dbModel/organizations/schema"
import { DiscussionModel } from "../dbModel/discussion/schema"
import { CommentModel } from "../dbModel/comment/schema"

import usersFromFixtures from "../../specs/fixtures/user.json"
import organizationFromFixtures from "../../specs/fixtures/organization.json"
import discussionsFromFixtures from "../../specs/fixtures/discussion.json"
import answersFromFixtures from "../../specs/fixtures/answer.json"
import commentsFromFixtures from "../../specs/fixtures/comment.json"

let users: any = []
let organizations: any = []
let discussions: any = []
let answers: any = []

mongoose
	.connect("mongodb://localhost:27017/mongo2", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(async () => {
		console.log("Database connected!")

		const createOrganization = async () => {
			const promiseArrayOrganizations = organizationFromFixtures.map(
				async (organization) =>
					OrganizationModel.create({ ...organization, userId: "temp" }),
			)
			organizations = await Promise.all(promiseArrayOrganizations)
		}

		await createOrganization()

		const createUsers = async () => {
			const promiseArrayUsers = usersFromFixtures.map(async (user) =>
				UserModel.create({ ...user, organizationId: organizations[0]._id }),
			)
			users = await Promise.all(promiseArrayUsers)

			const promiseArrayOrganizations = organizationFromFixtures.map(
				async (organization: any) =>
					OrganizationModel.updateOne(
						{ _id: organization._id },
						{ $set: { userId: users[0]._id } },
					),
			)
			await Promise.all(promiseArrayOrganizations)

			console.log(users)
		}

		await createUsers()

		const createDiscussions = async () => {
			const now = moment()

			const promiseArrayDiscussions = discussionsFromFixtures.map(
				async (discussion, i) =>
					DiscussionModel.create({
						...discussion,
						title: `${discussion.title} (${i})`,
						participantIds: [users[2]._id],
						startDate: now.clone().toDate(),
						endDate: now
							.clone()
							.add(i + 60, "minute")
							.toDate(),
						viewerIds: [users[1]._id],
						organizationId: organizations[0]._id,
					}),
			)
			discussions = await Promise.all(promiseArrayDiscussions)
		}

		await createDiscussions()

		const createAnswers = async () => {
			const promiseArrayAnswers: any[] = []

			for (let discussion of discussions) {
				answersFromFixtures.map(async (answer, i) =>
					promiseArrayAnswers.push(
						AnswerModel.create({
							...answer,
							content: `${answer.content} (${i})`,
							userId: users[0]._id,
							discussionId: discussion._id,
							upvoteIds: users.slice(1).map((user: any) => user._id),
						}),
					),
				)
			}

			answers = await Promise.all(promiseArrayAnswers)
		}

		await createAnswers()

		const createComments = async () => {
			const promiseArrayComments: any[] = []

			for (let answer of answers) {
				commentsFromFixtures.map(async (comment, i) =>
					promiseArrayComments.push(
						CommentModel.create({
							...comment,
							content: `${comment.content} (${i})`,
							userId: users[0]._id,
							answerId: answer._id,
							upvoteIds: users.slice(1).map((user: any) => user._id),
						}),
					),
				)
			}
			await Promise.all(promiseArrayComments)
		}

		await createComments()
		console.log("done executing")
	})
	.catch((err) => console.log(err))
