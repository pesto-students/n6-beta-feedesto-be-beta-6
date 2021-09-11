import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { findScoreByDiscussion } from "../../../services/mongo/answer"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		_id: string
	}
}

export const apiDiscussionUpdate = new WebApi({
	endpoint: "/discussion/score",
	requestBodySchema: T.object({
		_id: T.string().mongoObjectId(),
	}),
	method: RequestMethod.POST,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION)],
	handler: ({ body }: Context) => findScoreByDiscussion(body),
})
