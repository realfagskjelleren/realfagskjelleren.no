import { ErrorFormAlert, SuccessFormAlert } from "@/components/FormAlerts";
import SaleForm from "@/components/SaleForm";
import { dateAsUTC } from "@/utils/dateHelpers";
import { trpc } from "@/utils/trpc";
import { Category } from "@prisma/client";
import { Formik } from "formik";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const Sale: NextPage = () => {
	const router = useRouter();
	const saleObject = {
		category: "" as Category,
		goodId: "",
		units: "",
		pricePerUnit: "",
	};
	const utils = trpc.useContext();
	const goods = trpc.useQuery(["good.allByCategory"]);
	const users = trpc.useQuery(["user.all"]);
	const sale = trpc.useMutation("sale.create", {
		onSuccess: () => {
			utils.invalidateQueries("sale.allInPeriod");
			router.push("/restricted/reports/sales");
		},
	});

	const dataLoaded =
		!goods.isLoading && goods.data && !users.isLoading && users.data;

	return (
		<div className="min-h-screen flex flex-col justify-center">
			<div className="text-2xl flex flex-row justify-center">Register sale</div>
			<div className="p-2" />
			{sale.isSuccess && <SuccessFormAlert created={"sale"} />}
			<div className="p-2" />
			<Formik
				initialValues={{
					responsibleId: "",
					supplierId: "",
					dateSold: "",
					time: "",
					goodsSold: [saleObject],
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

					sale.mutate(formatted);
				}}
			>
				{({ values }) => (
					<>
						{dataLoaded && (
							<SaleForm users={users.data} values={values} goods={goods.data} />
						)}
					</>
				)}
			</Formik>
			<div className="p-2" />
			{sale.error && sale.error.data && (
				<>
					{sale.error.data?.code === "BAD_REQUEST" ? (
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

export default Sale;
