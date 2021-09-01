import { InternalServerError } from "@hkbyte/webapi"
import { isValidObjectId, ObjectId } from "mongoose"

export function checkAndGetObjectId(val: string) {
	if (isValidObjectId(val)) return val as unknown as ObjectId
	throw new InternalServerError("Id is invalid")
}
