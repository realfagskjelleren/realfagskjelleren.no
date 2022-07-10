import { Dispatch, SetStateAction } from "react";
import React from "react";

export const Pagination: React.FC<{
	cursor: number;
	setCursor: Dispatch<SetStateAction<number>>;
	take: number;
	length: number;
}> = ({ cursor, setCursor, take, length }) => {
	let numPages = 1;
	if (length > take) {
		numPages = Math.ceil(length / take);
	}
	return (
		<div className="btn-group">
			<button className="btn" onClick={() => setCursor(cursor - take)}>
				«
			</button>
			<button className="btn">
				Page {cursor / take + 1}/{numPages}
			</button>
			<button className="btn" onClick={() => setCursor(cursor + take)}>
				»
			</button>
		</div>
	);
};

export const Period: React.FC<{
	start: string;
	setStart: Dispatch<SetStateAction<string>>;
	end: string;
	setEnd: Dispatch<SetStateAction<string>>;
}> = ({ start, setStart, end, setEnd }) => {
	return (
		<div className="flex flex-row">
			<label className="input-group">
				<span>Start</span>
				<input
					className="input"
					type="date"
					name="start"
					value={start}
					onChange={(e) => setStart(e.target.value)}
				/>
			</label>
			<label className="input-group">
				<span>End</span>
				<input
					className="input"
					type="date"
					name="start"
					value={end}
					onChange={(e) => setEnd(e.target.value)}
				/>
			</label>
		</div>
	);
};
