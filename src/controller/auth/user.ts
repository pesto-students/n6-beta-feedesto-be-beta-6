import jwt from 'jsonwebtoken'
import { JWT_ISSUER, JWT_SECRET } from '.'
import { PreconditionsFailedError } from '../../utils/errors'

export type UserAuthPayload = {
	userId: string
}

export async function generateUserAuthToken({ userId }: { userId: string }) {
	return createUserToken(userId)
}

export function validateUserAuthToken(token: string) {
	try {
		const { userId }: any = jwt.verify(token, JWT_SECRET, {
			issuer: JWT_ISSUER,
		})
		return userId
	} catch (err) {
		if (err instanceof jwt.TokenExpiredError) {
			throw new PreconditionsFailedError('Auth Token Expired')
		}
		throw err
	}
}

function createUserToken(userId: string) {
	const token = jwt.sign({ userId }, JWT_SECRET, {
		issuer: JWT_ISSUER,
		expiresIn: '3d',
		subject: 'User Token',
	})
	return {
		token,
	}
}
