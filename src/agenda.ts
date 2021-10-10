import Agenda from "agenda"

import configs from "./utils/configs"

import { useDiscussionDbModel } from "./dbModel"
import eventEmitter from "./eventEmitter"

const { host, port, name } = configs.mongodb

export const agenda = new Agenda()

agenda.database(`mongodb://${host}:${port}/${name}`, `agendaJobs`)
const defineAgendas = async function () {
	//define job consumers here
	agenda.define("send email report", { concurrency: 1 }, (job, done) => {
		console.log("ada", job)
		done()
		job.remove()
	})

	agenda.define("startDiscussion", { concurrency: 1 }, async (job: any, done) => {
		const discussionDbModel = useDiscussionDbModel()

		const { discussionId } = job.attrs.data

		if (!discussionId) {
			job.remove()
			done()
		}

		const updatedDiscussion = await discussionDbModel.findByIdAndUpdateStatus(
			discussionId,
			{ isLive: true },
		)

		// emitEvent to FrontEnd socket
		let topic = ""
		if (updatedDiscussion) {
			topic = `${updatedDiscussion.organizationId}`
			eventEmitter.emit("emitToFrontEndClient", {
				topic,
				model: "discussionDbModel",
				object: updatedDiscussion,
				action: "update",
			})
		}

		done()
		job.remove()
	})

	agenda.define("endDiscussion", { concurrency: 1 }, async (job: any, done) => {
		const discussionDbModel = useDiscussionDbModel()

		const { discussionId } = job.attrs.data

		if (!discussionId) {
			job.remove()
			done()
		}

		const updatedDiscussion = await discussionDbModel.findByIdAndUpdateStatus(
			discussionId,
			{ isLive: false },
		)

		// emitEvent to FrontEnd socket
		let topic = ""
		if (updatedDiscussion) {
			topic = `${updatedDiscussion.organizationId}`
			eventEmitter.emit("emitToFrontEndClient", {
				topic,
				model: "discussionDbModel",
				object: updatedDiscussion,
				action: "update",
			})
		}

		done()
		job.remove()
	})

	agenda.on("ready", () => {
		agenda.processEvery("5 second")
		agenda.start()
	})

	// Log job start and completion/failure
	agenda.on("start", (job) => {
		console.log(`Job <${job.attrs.name}> starting`)
	})
	agenda.on("success", (job) => {
		console.log(`Job <${job.attrs.name}> succeeded`)
	})
	agenda.on("fail", (error, job) => {
		console.log(`Job <${job.attrs.name}> failed:`, error)
	})
}

defineAgendas()
