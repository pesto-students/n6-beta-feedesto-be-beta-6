import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { deleteComment } from "../../../services/mongo/comment"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		_id: string
	}
}

export const apiCommentDelete = new WebApi({
	endpoint: "/comment",
	requestBodySchema: T.object({
		_id: T.string().trim().mongoObjectId(),
	}),
	method: RequestMethod.DELETE,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION)],
	handler: ({ body }: Context) => deleteComment(body),
})
