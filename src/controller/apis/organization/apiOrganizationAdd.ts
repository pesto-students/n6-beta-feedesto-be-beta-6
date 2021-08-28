import { RequestMethod, T, WebApi } from '@hkbyte/webapi'
import { mongoOrganizationAdd } from '../../../services/mongo/organization/mongoOrganizationAdd'
import authMiddleware from '../../middlewares/authMiddleware'

type Context = {
	body: {
		name: string
	}
}

export const apiOrganizationAdd = new WebApi({
	endpoint: '/organization',
	requestBodySchema: T.object({
		name: T.string().nonEmpty(),
	}).optional(),
	method: RequestMethod.POST,
	middlewares: [authMiddleware()],
	handler: async ({ body }: Context) => {
		const created = await mongoOrganizationAdd(body)
		return { created }
	},
})
