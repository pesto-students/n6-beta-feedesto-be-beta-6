import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { mongoDiscussionList } from "../../../services/mongo/discussion/mongoDiscussionList"
import { RequestLocals } from "../../../utils/types"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		id?: string
		asParticipant?: boolean
	}
	locals: RequestLocals
}

export const apiDiscussionList = new WebApi({
	endpoint: "/discussion",
	requestBodySchema: T.object({
		id: T.string().optional(),
		participantId: T.string().optional(),
		asParticipant: T.boolean().optional(),
	}).optional(),
	method: RequestMethod.GET,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION, AuthRole.USER)],
	handler: async ({ body, locals }: Context) => {
		let organizationId: string | undefined
		let participantId: string | undefined
		let viewerId: string | undefined

		if (locals.session.role == AuthRole.ORGANIZATION) {
			organizationId = locals.session.organizationId
		} else if (locals.session.role == AuthRole.USER) {
			if (body.asParticipant) participantId = locals.session.userId
			else viewerId = locals.session.userId
		}
		return await mongoDiscussionList({
			id: body.id,
			organizationId,
			participantId,
			viewerId,
		})
	},
})
