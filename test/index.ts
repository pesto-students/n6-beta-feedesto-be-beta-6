import chai, { expect } from "chai"
import chaiHttp from "chai-http"
import chaiThings from "chai-things"
import _ from "lodash"
import { generateUserAuthToken } from "../src/controller/auth/user"
import webApiServer from "../src/server"
import { generateUser } from "./resources/user"

chai.use(chaiHttp)
chai.use(chaiThings)
export let requester: ChaiHttp.Agent

export async function httpRequest(
	endpoint: string,
	{
		body,
		auth,
		expectedStatus = WebApiResponseStatus.SUCCESS,
	}: {
		body?: string | object
		auth?: string | boolean | { userId: string }
		expectedStatus?: WebApiResponseStatus
	} = {},
): Promise<any> {
	const client = requester.post(endpoint)
	if (auth) {
		if (_.isString(auth)) client.set("Authorization", auth)
		else {
			const userId = _.isObject(auth)
				? auth.userId
				: await generateUser({ organizationId: "" })
			client.set("Authorization", (await generateUserAuthToken({ userId })).token)
		}
	}

	const res = await client.send(body)
	expect(res.status).equal(
		expectedStatus,
		res.body?.error?.message + " " + res.body?.error?.stack,
	)

	return res.body.data
}

before(async () => {
	requester = chai.request(webApiServer.server).keepOpen()
})

after(async () => {
	requester.close()
})

export enum WebApiResponseStatus {
	SUCCESS = 200,
	CREATED = 201,
	BAD_REQUEST = 400,
	UNAUTHORISED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	UNPROCESSABLE = 422,
}
