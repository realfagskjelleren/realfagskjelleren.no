import {
	ErrorFormAlert,
	SuccessFormAlert,
} from "@/components/Forms/FormAlerts";
import PurchaseForm from "@/components/Forms/PurchaseForm";
import RegisterGoods from "@/components/Modals/RegisterGoods";
import RegisterSupplier from "@/components/Modals/RegisterSupplier";
import { dateAsUTC } from "@/utils/dateHelpers";
import { trpc } from "@/utils/trpc";
import { Category } from "@prisma/client";
import { Formik } from "formik";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";

const UpdatePurchase: NextPage = () => {
	const router = useRouter();
	const { date } = router.query;
	const d = new Date(date as string);

	const utils = trpc.useContext();
	const goodModalId = "register-good";
	const supplierModalId = "register-supplier";
	const goods = trpc.useQuery(["good.allByCategory"]);
	const users = trpc.useQuery(["user.all"]);
	const suppliers = trpc.useQuery(["supplier.all"]);
	const updatePurchase = trpc.useMutation("purchase.update", {
		onSuccess: () => {
			utils.invalidateQueries("purchase.allInPeriod");
			router.back();
		},
	});
	const purchase = trpc.useQuery([
		"purchase.allInPeriod",
		{ start: d, end: d },
	]);

	const dataLoaded =
		!goods.isLoading &&
		goods.data &&
		!users.isLoading &&
		users.data &&
		!suppliers.isLoading &&
		suppliers.data &&
		!purchase.isLoading &&
		purchase.data;

	const purchaseObject = {
		category: "" as Category,
		goodId: "",
		units: "",
		price: "",
	};

	const initP: Array<typeof purchaseObject> = [];
	if (!purchase.isLoading && purchase.data && purchase.data[0]) {
		for (let i = 0; i < purchase.data[0].purchase.length; i++) {
			const p = purchase.data[0].purchase[i];
			initP.push({
				category: p?.category as Category,
				goodId: p?.id.toString() as string,
				units: p?.units.toString() as string,
				price: p?.value.toFixed(2) as string,
			});
		}
	}

	return (
		<div className="min-h-screen flex flex-col justify-center">
			<RegisterGoods id={goodModalId} />
			<RegisterSupplier id={supplierModalId} />
			<div className="text-2xl flex flex-row justify-center">
				Update purchase
			</div>
			<div className="p-2" />
			{updatePurchase.isSuccess && <SuccessFormAlert updated={"purchase"} />}
			<div className="p-2" />
			{dataLoaded && purchase.data[0] && (
				<Formik
					initialValues={{
						receiverId: `${purchase.data[0]?.receiverId}`,
						supplierId: `${purchase.data[0]?.supplierId}`,
						dateReceived: `${purchase.data[0]?.dateReceived
							.toISOString()
							.substring(0, 10)}`,
						time: `${purchase.data[0]?.dateReceived.getUTCHours()}`,
						goodsPurchased: initP,
					}}
					onSubmit={(values) => {
						const dReceived = dateAsUTC(new Date(values.dateReceived));
						dReceived.setHours(dReceived.getUTCHours() + parseInt(values.time));
						const formatted: {
							receiverId: string;
							supplierId: number;
							dateReceived: Date;
							goodsPurchased: Array<{
								goodId: number;
								units: number;
								price: number;
							}>;
						} = {
							receiverId: values.receiverId,
							supplierId: parseInt(values.supplierId),
							dateReceived: dReceived,
							goodsPurchased: [],
						};

						for (let i = 0; i < values.goodsPurchased.length; i++) {
							const good = values.goodsPurchased[i];
							formatted.goodsPurchased.push({
								goodId: parseInt(good?.goodId as string),
								units: parseInt(good?.units as string),
								price: parseFloat(good?.price as string),
							});
						}

						updatePurchase.mutate(formatted);
					}}
				>
					{({ values }) => (
						<PurchaseForm
							users={users.data}
							suppliers={suppliers.data}
							supplierModalId={supplierModalId}
							values={values}
							goods={goods.data}
							goodModalId={goodModalId}
						/>
					)}
				</Formik>
			)}
			<div className="p-2" />
			{updatePurchase.error && updatePurchase.error.data && (
				<>
					{updatePurchase.error.data?.code === "BAD_REQUEST" ? (
						<ErrorFormAlert
							badReq="The server either recieved an empty, non-selected or nonpositive field."
							attempt="purchase"
						/>
					) : (
						<ErrorFormAlert attempt="purchase" />
					)}
				</>
			)}
		</div>
	);
};

export default UpdatePurchase;
