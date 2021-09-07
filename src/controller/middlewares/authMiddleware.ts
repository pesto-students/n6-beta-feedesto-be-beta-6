import {
	ForbiddenError,
	InvalidArgumentError,
	RequestHandler,
	sendResponseError,
} from "@hkbyte/webapi"
import _ from "lodash"
import { fetchUsers } from "../../services/mongo/user"
import { AuthRole } from "../auth"
import { validateOrganizationAuthToken } from "../auth/organization"
import { validateUserAuthToken } from "../auth/user"

function extractAuthTokenData(value: string) {
	const arrayOfValues = value.split(" ")
	if (arrayOfValues.length !== 2) {
		throw new InvalidArgumentError("Invalid Auth Token")
	}

	return {
		authRole: arrayOfValues[0] as AuthRole,
		token: arrayOfValues[1],
	}
}

export default function (...roles: AuthRole[]): RequestHandler {
	return async (req, res, next) => {
		try {
			if (req.headers.authorization) {
				const { token, authRole } = extractAuthTokenData(
					req.headers.authorization,
				)

				if (!roles.includes(authRole)) {
					throw new ForbiddenError("User does not have permission")
				}

				res.locals.session = { role: authRole }

				if (authRole === AuthRole.USER) {
					res.locals.session.userId = await validateUserAuthToken(token)
				} else if (authRole === AuthRole.ORGANIZATION) {
					const { organizationId, userId } =
						validateOrganizationAuthToken(token)
					res.locals.session.organizationId = organizationId
					res.locals.session.userId = userId
				} else {
					throw new ForbiddenError("Invalid Authentication role")
				}

				const [checkUserExists] = await fetchUsers({
					_id: res.locals.session.userId,
				})
				if (!checkUserExists) {
					throw new ForbiddenError("User does not exist!")
				}
			} else {
				if (!_.isEmpty(roles)) throw new ForbiddenError("Authentication missing")
			}

			next()
		} catch (err) {
			sendResponseError(res, err, {})
		}
	}
}
