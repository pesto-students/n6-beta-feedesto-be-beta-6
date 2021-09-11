import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { findScoreByDiscussion } from "../../../services/mongo/answer"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	query: {
		_id: string
	}
}

export const apiDiscussionScoreList = new WebApi({
	endpoint: "/discussion/score",
	requestQuerySchema: T.object({
		_id: T.string().mongoObjectId(),
	}),
	method: RequestMethod.GET,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION)],
	handler: ({ query }: Context) => findScoreByDiscussion(query),
})
