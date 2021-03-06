import { dateToString, dateToURL } from "@/utils/dateHelpers";
import { InferQueryOutput, trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pagination, Period } from "@/components/Pagination";

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

	const dataLoaded = !pReports.isLoading && pReports.data;

	return (
		<div className="min-h-screen flex flex-col">
			{dataLoaded && (
				<>
					<div className="p-2" />
					<div className="text-2xl flex flex-row justify-center">Purchases</div>
					<div className="p-2" />
					<div className="flex flex-row items-center justify-between">
						<Period
							start={start}
							setStart={setStart}
							end={end}
							setEnd={setEnd}
						/>
						{pReports.data.length > 10 && (
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

const PurchaseCard: React.FC<{
	pReport: InferQueryOutput<"purchase.allInPeriod">[number];
}> = (props) => {
	const utils = trpc.useContext();
	const deleteReport = trpc.useMutation("purchase.delete", {
		onSuccess: () => {
			utils.invalidateQueries("purchase.allInPeriod");
		},
	});
	return (
		<div className="collapse collapse-arrow">
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
				<div className="flex flex-row items-center justify-between">
					<div className="flex flex-row items-center">
						<div className="p-1" />
						<div className="font-bold">Receiver: </div>
						<div className="p-1" />
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
							<Link
								href={`/restricted/profile/${props.pReport.receiverId}`}
								passHref
							>
								<a className="link link-hover">{props.pReport.receiver}</a>
							</Link>
						</div>
					</div>
					<div className="flex flex-row">
						<Link
							href={`/restricted/update/purchase/${dateToURL(
								props.pReport.dateReceived
							)}`}
							passHref
						>
							<a className="btn btn-primary">Update</a>
						</Link>
						<div className="p-2" />
						<div className="dropdown dropdown-top dropdown-end">
							<label tabIndex={0} className="btn btn-outline btn-error">
								Delete
							</label>
							<div
								tabIndex={0}
								className="dropdown-content p-4 shadow bg-base-300 rounded-box w-56"
							>
								<div className="w-full flex flex-row items-center justify-between">
									<div className="font-bold text-xl">Are you sure?</div>
									<button
										className="btn btn-xs btn-error m-2"
										onClick={() => {
											deleteReport.mutate({
												dateReceived: props.pReport.dateReceived,
												supplierId: props.pReport.supplierId,
											});
										}}
									>
										Yes
									</button>
								</div>
								{deleteReport.isError && (
									<div className="text-sm">Server could not delete...</div>
								)}
							</div>
						</div>
						<div className="p-2" />
					</div>
				</div>
			</div>
		</div>
	);
};
