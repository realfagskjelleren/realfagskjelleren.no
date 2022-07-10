import {
	ErrorFormAlert,
	SuccessFormAlert,
} from "@/components/Forms/FormAlerts";
import SaleForm from "@/components/Forms/SaleForm";
import { dateAsUTC } from "@/utils/dateHelpers";
import { trpc } from "@/utils/trpc";
import { Category } from "@prisma/client";
import { Formik } from "formik";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const UpdateSale: NextPage = () => {
	const router = useRouter();
	const { date } = router.query;
	const d = new Date(date as string);

	const utils = trpc.useContext();
	const goods = trpc.useQuery(["good.allByCategory"]);
	const users = trpc.useQuery(["user.all"]);
	const updateSale = trpc.useMutation("sale.update", {
		onSuccess: () => {
			utils.invalidateQueries("sale.allInPeriod");
			router.back();
		},
	});
	const sale = trpc.useQuery(["sale.allInPeriod", { start: d, end: d }]);

	const dataLoaded =
		!goods.isLoading &&
		goods.data &&
		!users.isLoading &&
		users.data &&
		!sale.isLoading &&
		sale.data;

	const saleObject = {
		category: "" as Category,
		goodId: "",
		units: "",
		pricePerUnit: "",
	};

	const initP: Array<typeof saleObject> = [];
	if (!sale.isLoading && sale.data && sale.data[0]) {
		for (let i = 0; i < sale.data[0].sale.length; i++) {
			const p = sale.data[0].sale[i];
			initP.push({
				category: p?.category as Category,
				goodId: p?.id.toString() as string,
				units: p?.units.toString() as string,
				pricePerUnit: p?.value.toFixed(2) as string,
			});
		}
	}

	return (
		<div className="min-h-screen flex flex-col justify-center">
			<div className="text-2xl flex flex-row justify-center">Update sale</div>
			<div className="p-2" />
			{updateSale.isSuccess && <SuccessFormAlert created={"sale"} />}
			<div className="p-2" />
			{dataLoaded && sale.data[0] && (
				<Formik
					initialValues={{
						responsibleId: `${sale.data[0]?.responsibleId}`,
						dateSold: `${sale.data[0]?.dateSold
							.toISOString()
							.substring(0, 10)}`,
						time: `${sale.data[0]?.dateSold.getUTCHours()}`,
						goodsSold: initP,
					}}
					onSubmit={(values) => {
						const dSold = dateAsUTC(new Date(values.dateSold));
						dSold.setHours(dSold.getUTCHours() + parseInt(values.time));
						const formatted: {
							responsibleId: string;
							dateSold: Date;
							goodsSold: Array<{
								goodId: number;
								units: number;
								pricePerUnit: number;
							}>;
						} = {
							responsibleId: values.responsibleId,
							dateSold: dSold,
							goodsSold: [],
						};

						for (let i = 0; i < values.goodsSold.length; i++) {
							const good = values.goodsSold[i];
							formatted.goodsSold.push({
								goodId: parseInt(good?.goodId as string),
								units: parseInt(good?.units as string),
								pricePerUnit: parseFloat(good?.pricePerUnit as string),
							});
						}

						updateSale.mutate(formatted);
					}}
				>
					{({ values }) => (
						<SaleForm users={users.data} values={values} goods={goods.data} />
					)}
				</Formik>
			)}
			<div className="p-2" />
			{updateSale.error && updateSale.error.data && (
				<>
					{updateSale.error.data?.code === "BAD_REQUEST" ? (
						<ErrorFormAlert
							badReq="The server either recieved an empty, non-selected or nonpositive field."
							attempt="sale"
						/>
					) : (
						<ErrorFormAlert attempt="sale" />
					)}
				</>
			)}
		</div>
	);
};

export default UpdateSale;
