import chai from "chai"
import chaiHttp from "chai-http"
import chaiThings from "chai-things"
import server from "../src/server"

chai.use(chaiHttp)
chai.use(chaiThings)
export let requester: ChaiHttp.Agent

before(() => {
	requester = chai.request(server.server).keepOpen()
	console.log("requester loaded")
})

after(() => {
	requester.close()
})

export enum WebApiResponseStatus {
	SUCCESS = 200,
	CREATED = 201,
	BAD_REQUEST = 400,
	UNAUTHORISED = 401,
	FORBIDDEN = 403,
	NOT_FOUND = 404,
	INVALID_ARGUMENT = 422,
}

export type Unpromise<T extends Promise<any>> = T extends Promise<infer U> ? U : never
