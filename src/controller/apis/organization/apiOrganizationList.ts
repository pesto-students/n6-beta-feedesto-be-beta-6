import { RequestMethod, T, WebApi } from '@hkbyte/webapi'
import { mongoOrganizationList } from '../../../services/mongo/organization/mongoOrganizationList'
import authMiddleware from '../../middlewares/authMiddleware'

export const apiOrganizationList = new WebApi({
	endpoint: '/organization',
	requestBodySchema: T.object({}).optional(),
	method: RequestMethod.GET,
	middlewares: [authMiddleware()],
	handler: async () => {
		return await mongoOrganizationList()
	},
})
