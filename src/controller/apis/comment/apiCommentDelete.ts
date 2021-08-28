import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { mongoCommentDelete } from "../../../services/mongo/comment/mongoCommentDelete"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		id: string
	}
}

export const apiCommentDelete = new WebApi({
	endpoint: "/comment",
	requestBodySchema: T.object({
		id: T.string().trim().mongoObjectId(),
	}),
	method: RequestMethod.DELETE,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION)],
	handler: ({ body }: Context) => mongoCommentDelete(body),
})
