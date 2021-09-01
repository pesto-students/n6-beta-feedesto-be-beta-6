import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { updateDiscussion } from "../../../services/mongo/discussion"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		id: string
		update: {
			title?: string
			description?: string
			startDate?: string
			endDate?: string
		}
	}
}

export const apiDiscussionUpdate = new WebApi({
	endpoint: "/discussion",
	requestBodySchema: T.object({
		id: T.string().mongoObjectId(),
		update: T.object({
			title: T.string().optional(),
			description: T.string().optional(),
			startDate: T.string().date(true).optional(),
			endDate: T.string().date(true).optional(),
		}),
	}),
	method: RequestMethod.PUT,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION)],
	handler: ({ body }: Context) => updateDiscussion(body),
})
