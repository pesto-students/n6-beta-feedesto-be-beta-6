import { InternalServerError } from "@hkbyte/webapi"
import { ObjectID } from "mongodb"

export function checkAndGetObjectId(val: string) {
	if (!ObjectID.isValid(val)) return new ObjectID(val)
	throw new InternalServerError("Id is invalid")
}
