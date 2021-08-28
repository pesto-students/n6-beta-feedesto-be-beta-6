import { ForbiddenError, T, WebApi, _ } from '@hkbyte/webapi'
import { mongoUserList } from '../../../../services/mongo/user/mongoUserList'
import { validateEmail } from '../../../../utils/validators'
import { generateOrganizationAuthToken } from '../../../auth/organization'
import { generateUserAuthToken } from '../../../auth/user'

type Context = {
	body: {
		idToken: string
		email: string
	}
}

export const apiUserLogin = new WebApi({
	endpoint: '/auth/login',
	requestBodySchema: T.object({
		idToken: T.string().trim().nonEmpty(),
		email: validateEmail(),
	}),
	handler: async ({ body: { email } }: Context) => {
		const checkEmailExist = await mongoUserList({ email })
		if (_.isEmpty(checkEmailExist)) {
			throw new ForbiddenError('Email does not exist')
		}

		if (checkEmailExist[0].isAdmin) {
			return generateOrganizationAuthToken({
				organizationId: checkEmailExist[0].organizationId,
			})
		}

		return generateUserAuthToken({
			userId: 'user.id',
		})
	},
})
