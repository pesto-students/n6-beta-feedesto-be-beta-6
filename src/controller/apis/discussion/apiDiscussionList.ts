import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { fetchDiscussions } from "../../../services/mongo/discussion"
import { RequestLocals } from "../../../utils/types"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	query: {
		id?: string
		participantId?: string
		asParticipant?: boolean
	}
	locals: RequestLocals
}

export const apiDiscussionList = new WebApi({
	endpoint: "/discussion",
	requestQuerySchema: T.object({
		id: T.string().optional(),
		participantId: T.string().optional(),
		asParticipant: T.boolean().optional(),
	}).optional(),
	method: RequestMethod.GET,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION, AuthRole.USER)],
	handler: async ({ query, locals }: Context) => {
		let organizationId: string | undefined
		let participantId: string | undefined
		let viewerId: string | undefined

		if (locals.session.role == AuthRole.ORGANIZATION) {
			organizationId = locals.session.organizationId
		} else if (locals.session.role == AuthRole.USER) {
			if (query.asParticipant) participantId = locals.session.userId
			else viewerId = locals.session.userId
		}
		return await fetchDiscussions({
			id: query.id,
			organizationId,
			participantId,
			viewerId,
		})
	},
})
