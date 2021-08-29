import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { mongoDiscussionAdd } from "../../../services/mongo/discussion/mongoDiscussionAdd"
import { RequestLocals } from "../../../utils/types"
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
	locals: RequestLocals
}

export const apiDiscussionAdd = new WebApi({
	endpoint: "/discussion",
	requestBodySchema: T.object({
		title: T.string().nonEmpty(),
		description: T.string().nonEmpty(),
		startDate: T.string().date(true).nonEmpty(),
		endDate: T.string().date(true).nonEmpty(),
		participantIds: T.array(T.string().mongoObjectId()),
		viewerIds: T.array(T.string().mongoObjectId()),
	}),
	method: RequestMethod.POST,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION)],
	handler: async ({ body, locals }: Context) => {
		const organizationId = locals.session.organizationId
		const created = await mongoDiscussionAdd({ ...body, organizationId })
		return { created }
	},
})
