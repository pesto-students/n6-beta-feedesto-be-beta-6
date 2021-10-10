import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { deleteDiscussion } from "../../../services/mongo/discussion"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		_id: string
	}
}

export const apiDiscussionDelete = new WebApi({
	endpoint: "/discussion",
	requestBodySchema: T.object({
		_id: T.string().trim().mongoObjectId(),
	}),
	method: RequestMethod.DELETE,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION)],
	handler: ({ body }: Context) => deleteDiscussion(body),
})
