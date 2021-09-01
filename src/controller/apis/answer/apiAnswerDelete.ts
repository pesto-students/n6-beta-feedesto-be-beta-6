import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { deleteAnswer } from "../../../services/mongo/answer"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		_id: string
	}
}

export const apiAnswerDelete = new WebApi({
	endpoint: "/answer",
	requestBodySchema: T.object({
		_id: T.string().trim().mongoObjectId(),
	}),
	method: RequestMethod.DELETE,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION)],
	handler: ({ body }: Context) => deleteAnswer(body),
})
