import jwt from "jsonwebtoken"
import { JWT_ISSUER, JWT_SECRET } from "."
import { PreconditionsFailedError } from "../../utils/errors"

export async function generateOrganizationAuthToken({
	organizationId,
	userId,
}: {
	organizationId: string
	userId: string
}) {
	return createOrganizationToken(organizationId, userId)
}

export function validateOrganizationAuthToken(token: string) {
	try {
		const { organizationId, userId }: any = jwt.verify(token, JWT_SECRET, {
			issuer: JWT_ISSUER,
		})
		return { organizationId, userId }
	} catch (err) {
		if (err instanceof jwt.TokenExpiredError) {
			throw new PreconditionsFailedError("Auth Token Expired")
		}
		throw err
	}
}

function createOrganizationToken(organizationId: string, userId: string) {
	const token = jwt.sign({ organizationId, userId }, JWT_SECRET, {
		issuer: JWT_ISSUER,
		expiresIn: "3d",
		subject: "Organization Token",
	})
	return {
		token,
	}
}
