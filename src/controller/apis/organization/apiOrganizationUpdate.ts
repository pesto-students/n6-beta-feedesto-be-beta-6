import { RequestMethod, T, WebApi } from "@hkbyte/webapi"
import { updateOrganization } from "../../../services/mongo/organization"
import { RequestLocals } from "../../../utils/types"
import { AuthRole } from "../../auth"
import authMiddleware from "../../middlewares/authMiddleware"

type Context = {
	body: {
		update: {
			name?: string
		}
	}
	locals: RequestLocals
}

export const apiOrganizationUpdate = new WebApi({
	endpoint: "/organization",
	requestBodySchema: T.object({
		_id: T.string().mongoObjectId(),
		update: T.object({
			name: T.string().optional(),
		}),
	}),
	method: RequestMethod.PUT,
	middlewares: [authMiddleware(AuthRole.ORGANIZATION)],
	handler: async ({ body, locals }: Context) => {
		await updateOrganization({
			_id: locals.session.organizationId,
			update: body.update,
		})
	},
})
