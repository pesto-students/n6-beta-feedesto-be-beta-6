import dayjs from 'dayjs'

export function parseIsoDate(date: dayjs.ConfigType | undefined | null) {
	if (date) {
		const dayJsDate = dayjs(date)
		if (dayJsDate.isValid()) return dayJsDate.toISOString()
	}
	return ''
}
