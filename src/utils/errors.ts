import { WebApiError } from '@hkbyte/webapi'

export class PreconditionsFailedError extends WebApiError {
	constructor(message: string) {
		super(message)
		this.httpStatus = 412
	}
}
