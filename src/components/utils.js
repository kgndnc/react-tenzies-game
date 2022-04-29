// utility func. to format time
export const formatTime = time => {
	let [hours, minutes, seconds, milliseconds] = [0, 0, 0, time]
	console.log(hours, seconds)

	// these conditonals are nested because if one step doesn't run other ones don't have to as well
	// eg. if seconds less than 60 we don't have to check for minutes
	if (milliseconds >= 1000) {
		seconds += Math.floor(milliseconds / 1000)
		milliseconds = milliseconds % 1000

		if (seconds >= 60) {
			minutes += Math.floor(seconds / 60)
			seconds %= 60

			if (minutes >= 60) {
				hours += Math.floor(minutes / 60)
				minutes %= 60
			}
		}
	}

	return hours !== 0
		? `${hours} hour(s) : `
		: `` +
				`${minutes} minute(s) : ${seconds} seconds : ${milliseconds} milliseconds`
}
