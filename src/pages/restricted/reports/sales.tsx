import { dateToString } from "@/utils/dateHelpers";
import { InferQueryOutput, trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pagination, Period } from "@/components/Pagination";

const SaleReports: NextPage = () => {
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

	const sReports = trpc.useQuery([
		"sale.allInPeriod",
		{ start: new Date(start), end: new Date(end) },
	]);

	const dataLoaded = !sReports.isLoading && sReports.data;

	return (
		<div className="min-h-screen flex flex-col">
			{dataLoaded && (
				<>
					<div className="p-2" />
					<div className="text-2xl flex flex-row justify-center">Sales</div>
					<div className="p-2" />
					<div className="flex flex-row items-center justify-between">
						<Period
							start={start}
							setStart={setStart}
							end={end}
							setEnd={setEnd}
						/>
						{sReports.data.length > 10 && (
							<div className="flex flex-row">
								<Pagination
									cursor={cursor}
									setCursor={setCursor}
									take={take}
									length={sReports.data.length}
								/>
							</div>
						)}
					</div>
					<div className="p-2" />
					{sReports.data.slice(cursor, cursor + take).map((sReport, index) => (
						<div key={index}>
							<SaleCard sReport={sReport} />
							<div className="p-2" />
						</div>
					))}
					{sReports.data.length > 10 && (
						<div className="flex flex-row justify-end">
							<Pagination
								cursor={cursor}
								setCursor={setCursor}
								take={take}
								length={sReports.data.length}
							/>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default SaleReports;

const SaleCard: React.FC<{
	sReport: InferQueryOutput<"sale.allInPeriod">[number];
}> = (props) => {
	return (
		<div className="collapse collapse-arrow">
			<input type="checkbox" />
			<div className="collapse-title flex flex-row bg-primary-content rounded-t-lg p-0">
				<div className="grid flex-grow place-items-center">
					{dateToString(props.sReport.dateSold)}
				</div>
				<div className="grid flex-grow place-items-center">
					{props.sReport.totalValue.toFixed(2)} kr
				</div>
			</div>
			<div className="collapse-content p-0">
				<table className="table table-compact table-zebra table-fixed w-full text-center">
					<thead>
						<tr className="">
							<th className="w-1/4">Category</th>
							<th className="w-1/4">Good</th>
							<th className="w-1/4">Units</th>
							<th className="w-1/4">Value</th>
						</tr>
					</thead>
					<tbody>
						{props.sReport.sale.map((s, index) => (
							<tr key={index} className="">
								<td>{s.category}</td>
								<td>
									{s.brand} - {s.name} - {s.volume}
								</td>
								<td>{s.value.toFixed(2)} kr</td>
								<td>{s.units}</td>
							</tr>
						))}
					</tbody>
				</table>
				<div className="p-2" />
				<div className="flex flex-row items-center justify-between">
					<div className="flex flex-row items-center">
						<div className="p-1" />
						<div className="font-bold">Responsible: </div>
						<div className="p-1" />
						<div className="flex space-x-3 items-center">
							{props.sReport.responsibleImage && (
								<div className="avatar">
									<div className="w-8 mask mask-squircle">
										<Image
											width={32}
											height={32}
											layout={"fixed"}
											src={props.sReport.responsibleImage}
										/>
									</div>
								</div>
							)}
							<Link
								href={`/restricted/profile/${props.sReport.responsibleId}`}
								passHref
							>
								<a className="link link-hover">{props.sReport.responsible}</a>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
