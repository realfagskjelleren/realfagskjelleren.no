import { dateToString, dateToURL } from "@/utils/dateHelpers";
import { InferQueryOutput, trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import React, { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const PurchaseReports: NextPage = () => {
	const today = new Date();
	const monthStart = new Date(
		Date.UTC(today.getFullYear(), today.getMonth(), 1, 0)
	);
	const monthEnd = new Date(
		Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0)
	);
	const [start, setStart] = useState(monthStart.toISOString().substring(0, 10));
	const [end, setEnd] = useState(monthEnd.toISOString().substring(0, 10));

	const take = 10;
	const [cursor, setCursor] = useState(0);

	const pReports = trpc.useQuery([
		"purchase.allInPeriod",
		{ start: new Date(start), end: new Date(end) },
	]);

	return (
		<div className="flex flex-col">
			<div className="p-2" />
			<div className="text-2xl flex flex-row justify-center">Purchases</div>
			<div className="p-2" />
			<div className="flex flex-row items-center justify-between">
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
				{!pReports.isLoading && pReports.data && pReports.data.length > 10 && (
					<div className="flex flex-row">
						<Pagination
							cursor={cursor}
							setCursor={setCursor}
							take={take}
							length={pReports.data.length}
						/>
					</div>
				)}
			</div>
			<div className="p-2" />
			{!pReports.isLoading && pReports.data && (
				<>
					{pReports.data.slice(cursor, cursor + take).map((pReport, index) => (
						<div key={index}>
							<PurchaseCard pReport={pReport} />
							<div className="p-2" />
						</div>
					))}
					{pReports.data.length > 10 && (
						<div className="flex flex-row justify-end">
							<Pagination
								cursor={cursor}
								setCursor={setCursor}
								take={take}
								length={pReports.data.length}
							/>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default PurchaseReports;

const Pagination: React.FC<{
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

const PurchaseCard: React.FC<{
	pReport: InferQueryOutput<"purchase.allInPeriod">[number];
}> = (props) => {
	return (
		<div className="collapse">
			<input type="checkbox" />
			<div className="collapse-title flex flex-row bg-primary-content rounded-t-lg p-0">
				<div className="grid flex-grow place-items-center">
					{dateToString(props.pReport.dateReceived)}
				</div>
				<div className="grid flex-grow place-items-center">
					{props.pReport.supplier}
				</div>
				<div className="grid flex-grow place-items-center">
					{props.pReport.totalValue.toFixed(2)} kr
				</div>
				<div className="grid flex-grow place-items-center">
					<div className="flex space-x-3 items-center">
						{props.pReport.receiverImage && (
							<div className="avatar">
								<div className="w-8 mask mask-squircle">
									<Image
										width={32}
										height={32}
										layout={"fixed"}
										src={props.pReport.receiverImage}
									/>
								</div>
							</div>
						)}
						<div>{props.pReport.receiver}</div>
					</div>
				</div>
			</div>
			<div className="collapse-content p-0">
				<table className="table table-compact table-zebra table-fixed w-full text-center">
					<thead>
						<tr className="">
							<th className="w-1/4">Category</th>
							<th className="w-1/4">Good</th>
							<th className="w-1/4">Price</th>
							<th className="w-1/4">Units</th>
						</tr>
					</thead>
					<tbody>
						{props.pReport.purchase.map((p, index) => (
							<tr key={index} className="">
								<td>{p.category}</td>
								<td>
									{p.brand} - {p.name} - {p.volume}
								</td>
								<td>{p.value.toFixed(2)} kr</td>
								<td>{p.units}</td>
							</tr>
						))}
					</tbody>
				</table>
				<div className="p-2" />
				<div className="flex flex-row justify-end">
					<Link
						href={`/restricted/update/purchase/${dateToURL(
							props.pReport.dateReceived
						)}`}
						passHref
					>
						<a className="btn btn-primary">Update</a>
					</Link>
					<div className="p-2" />
				</div>
			</div>
		</div>
	);
};
