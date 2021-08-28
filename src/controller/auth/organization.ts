import jwt from 'jsonwebtoken'
import { JWT_ISSUER, JWT_SECRET } from '.'
import { PreconditionsFailedError } from '../../utils/errors'

export type OrganizationAuthPayload = {
	organizationId: string
}

export async function generateOrganizationAuthToken({
	organizationId,
}: {
	organizationId: string
}) {
	return createOrganizationToken(organizationId)
}

export function validateOrganizationAuthToken(token: string) {
	try {
		const { organizationId }: any = jwt.verify(token, JWT_SECRET, {
			issuer: JWT_ISSUER,
		})
		return organizationId
	} catch (err) {
		if (err instanceof jwt.TokenExpiredError) {
			throw new PreconditionsFailedError('Auth Token Expired')
		}
		throw err
	}
}

function createOrganizationToken(organizationId: string) {
	const token = jwt.sign({ organizationId }, JWT_SECRET, {
		issuer: JWT_ISSUER,
		expiresIn: '3d',
		subject: 'Organization Token',
	})
	return {
		token,
	}
}
