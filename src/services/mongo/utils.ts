import { InternalServerError } from "@hkbyte/webapi"
import { ObjectId } from "mongodb"

export function checkAndGetObjectId(val: string) {
	if (ObjectId.isValid(val)) return new ObjectId(val)
	throw new InternalServerError("Id is invalid")
}
