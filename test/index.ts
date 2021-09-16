import { expect } from "chai"
import _ from "lodash"
import { AuthRole } from "../src/controller/auth"
import { generateAuthToken } from "./resources/auth"
import { requester, WebApiResponseStatus } from "./setup"

export async function webApiRequest(
	endpoint: string,
	{
		method = "post",
		body,
		query,
		auth,
		expectedStatus = WebApiResponseStatus.SUCCESS,
	}: {
		method?: "post" | "get" | "put" | "delete"
		body?: string | object
		query?: string | object
		auth?: string | AuthObject
		expectedStatus?: WebApiResponseStatus
	} = {},
): Promise<any> {
	const client = method === "post" ? requester.post(endpoint) : requester.get(endpoint)
	const authToken = auth
		? _.isString(auth)
			? auth
			: await generateAuthToken(auth)
		: null

	if (authToken) client.set("Authorization", authToken)
	if (body) client.send(body)
	if (query) client.query(query)

	const res = await executeHttpRequest(client)
	expect(res.status).equal(
		expectedStatus,
		res.body?.error?.message + " " + res.body?.error?.stack,
	)
	return res.body.data
}

function executeHttpRequest(
	client: ReturnType<typeof requester.post>,
): Promise<ChaiHttp.Response> {
	return new Promise((resolve, reject) => {
		client.then((res) => resolve(res)).catch((err) => reject(err))
	})
}

export type AuthObject = {
	role?: AuthRole
	organizationId?: string
	userId?: string
}

export function expectArrayKeys(list: any[], keys: string[]) {
	expect(list).to.be.an("array").contain.a.thing.with.keys(keys)
}
