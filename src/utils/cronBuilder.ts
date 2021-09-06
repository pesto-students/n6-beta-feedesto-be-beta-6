export const fetchCronPattern = (date: string | Date) => {
	let newDate: Date = new Date()
	if (date instanceof Date) newDate = date
	else if (typeof date == "string") {
		newDate = new Date(date)
	}
	const minutes = newDate.getMinutes()
	const hours = newDate.getHours()
	const days = newDate.getDate()
	const months = newDate.getMonth() + 1
	const dayOfWeek = newDate.getDay()

	return `${minutes} ${hours} ${days} ${months} ${dayOfWeek}`
}
