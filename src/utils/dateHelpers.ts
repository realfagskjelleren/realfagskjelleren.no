export const dateToString = (d: Date) => {
	const year = d.getUTCFullYear();
	let month: string;
	let date: string;
	if (d.getUTCMonth() + 1 < 10) {
		month = `0${d.getMonth() + 1}`;
	} else {
		month = `${d.getMonth() + 1}`;
	}
	if (d.getUTCDate() < 10) {
		date = `0${d.getUTCDate()}`;
	} else {
		date = `${d.getUTCDate()}`;
	}
	return `${date}.${month}.${year}`;
};
