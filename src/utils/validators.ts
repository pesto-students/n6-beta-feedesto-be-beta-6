import { T } from '@hkbyte/webapi'

export function validateId() {
	return T.number().int().positive()
}

export function validateUsername() {
	return T.string().trim().min(4).max(30).format('lowercase')
}

export function validateEmail() {
	return T.string().trim().email().format('lowercase')
}
