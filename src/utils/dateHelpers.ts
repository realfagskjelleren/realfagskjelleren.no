export const dateAsUTC = (d: Date) => {
	return new Date(
		Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), d.getHours())
	);
};

export const dateToString = (d: Date) => {
	const year = d.getUTCFullYear();
	let month: string;
	let date: string;
	if (d.getUTCMonth() + 1 < 10) {
		month = `0${d.getUTCMonth() + 1}`;
	} else {
		month = `${d.getUTCMonth() + 1}`;
	}
	if (d.getUTCDate() < 10) {
		date = `0${d.getUTCDate()}`;
	} else {
		date = `${d.getUTCDate()}`;
	}
	return `${date}.${month}.${year}`;
};

export const dateToURL = (d: Date) => {
	return `${d.toISOString()}`;
};
