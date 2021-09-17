import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import dayjs from "dayjs"
import { fetchDiscussions } from "../../../services/mongo/discussion"
import { RequestLocals } from "../../../utils/types"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	query: {
		_id?: string
		participantId?: string
		asParticipant?: boolean
	}
	locals: RequestLocals
}

export const apiDiscussionList = new WebApi({
	endpoint: "/discussion",
	requestQuerySchema: T.object({
		_id: T.string().optional(),
		participantId: T.string().mongoObjectId().optional(),
		asParticipant: T.boolean().optional(),
	}).optional(),
	method: RequestMethod.GET,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION, AuthRole.USER)],
	handler: async ({ query, locals }: Context) => {
		let organizationId: string | undefined
		let participantId: string | undefined
		let viewerId: string | undefined

		// Setting filters depending on Auth role
		if (locals.session.role == AuthRole.ORGANIZATION) {
			organizationId = locals.session.organizationId
		} else if (locals.session.role == AuthRole.USER) {
			if (query.asParticipant) participantId = locals.session.userId
			else viewerId = locals.session.userId
		}

		// Filtering response data based on Auth role
		return (
			await fetchDiscussions({
				_id: query._id,
				organizationId,
				participantId,
				viewerId,
			})
		).map((el) => {
			const isViewer = el.viewerIds.find(
				(el: string) => el == locals.session.userId,
			)
			const isParticipant = el.participantIds.find(
				(el: string) => el == locals.session.userId,
			)

			const now = new Date()
			const isLive =
				dayjs(el.startDate.toString()).isBefore(now) &&
				dayjs(el.endDate.toString()).isAfter(now)

			const isInputAllowed =
				isParticipant && isLive && locals.session.role === AuthRole.USER
			const isActionAllowed =
				isViewer && isLive && locals.session.role === AuthRole.USER

			return {
				...el,
				participants: organizationId ? el.participants : undefined,
				participantIds: organizationId ? el.participantIds : undefined,
				isViewer,
				isParticipant,
				isInputAllowed,
				isActionAllowed,
				viewers: organizationId ? el.viewers : undefined,
				viewerIds: organizationId ? el.viewerIds : undefined,
			}
		})
	},
})
