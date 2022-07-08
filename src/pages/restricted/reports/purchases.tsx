import { dateToString } from "@/utils/dateHelpers";
import { InferQueryOutput, trpc } from "@/utils/trpc";
import type { NextPage } from "next";
import React from "react";

const PurchaseReports: NextPage = () => {
	const pReports = trpc.useQuery(["purchase.all"]);
	return (
		<div className="h-screen flex flex-col">
			<div className="p-2" />
			<div className="text-2xl flex flex-row justify-center">Purchases</div>
			<div className="p-2" />
			{!pReports.isLoading && pReports.data && (
				<>
					{pReports.data.map((pReport, index) => (
						<div key={index}>
							<PurchaseCard pReport={pReport} />
							<div className="p-1" />
						</div>
					))}
				</>
			)}
		</div>
	);
};

export default PurchaseReports;

const PurchaseCard: React.FC<{
	pReport: InferQueryOutput<"purchase.all">[number];
}> = (props) => {
	return (
		<div className="collapse">
			<input type="checkbox" />
			<div className="collapse-title flex flex-row bg-primary-content rounded-t-lg p-0">
				<div className="grid flex-grow place-items-center">
					{dateToString(props.pReport.dateReceived)}
				</div>
				<div className="grid flex-grow place-items-center">
					{props.pReport.receiver}
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
							<th className="w-1/4">Units</th>
							<th className="w-1/4">Price</th>
						</tr>
					</thead>
					<tbody>
						{props.pReport.purchase.map((p, index) => (
							<tr key={index} className="">
								<td>{p.category}</td>
								<td>
									{p.brand} - {p.name} - {p.volume}
								</td>
								<td>{p.units}</td>
								<td>{p.value.toFixed(2)} kr</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
};
