
import moment from 'moment'

export const dateFormat = (input) => {
	return moment(input).format('ddd, MMM Do YYYY')
}

export const timeFormat = (input, includeSeconds=false) => {
	return moment(input).format(`h:mm${includeSeconds ? ":ss" : ""} A`)
}