import { T } from "@hkbyte/webapi"

export function validateEmail() {
	return T.string().trim().email().format("lowercase")
}
