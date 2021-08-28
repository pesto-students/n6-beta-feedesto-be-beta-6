import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { mongoDiscussionAdd } from "../../../services/mongo/discussion/mongoDiscussionAdd"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		title: string
		description: string
		startDate: string
		endDate: string
		participantIds: string[]
		viewerIds: string[]
	}
}

export const apiDiscussionAdd = new WebApi({
	endpoint: "/discussion",
	requestBodySchema: T.object({
		title: T.string().nonEmpty(),
		description: T.string().nonEmpty(),
		startDate: T.string().nonEmpty(),
		endDate: T.string().nonEmpty(),
		participantIds: T.array(T.string().mongoObjectId()),
		viewerIds: T.array(T.string().mongoObjectId()),
	}),
	method: RequestMethod.POST,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION)],
	handler: async ({ body }: Context) => {
		const created = await mongoDiscussionAdd(body)
		return { created }
	},
})
