import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { mongoDiscussionDelete } from "../../../services/mongo/discussion/mongoDiscussionDelete"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		id: string
	}
}

export const apiDiscussionDelete = new WebApi({
	endpoint: "/discussion",
	requestBodySchema: T.object({
		id: T.string().trim().mongoObjectId(),
	}),
	method: RequestMethod.DELETE,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION)],
	handler: ({ body }: Context) => mongoDiscussionDelete(body),
})
