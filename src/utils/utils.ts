import { InternalServerError } from "@hkbyte/webapi"
import dayjs from "dayjs"
import { sample } from "lodash"
import { isValidObjectId, ObjectId } from "mongoose"

export function parseIsoDate(date: dayjs.ConfigType | undefined | null) {
	if (date) {
		const dayJsDate = dayjs(date)
		if (dayJsDate.isValid()) return dayJsDate.toISOString()
	}
	return ""
}

export function checkAndGetObjectId(val: string) {
	if (isValidObjectId(val)) return val as unknown as ObjectId
	throw new InternalServerError("Id is invalid")
}

export function randomValueFromArray<T>(arrayPayload: T[]) {
	return sample(arrayPayload) ?? arrayPayload[0]
}
