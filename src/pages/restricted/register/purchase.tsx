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

const Purchase: NextPage = () => {
	const router = useRouter();
	const purchaseObject = {
		category: "" as Category,
		goodId: "",
		units: "",
		price: "",
	};
	const goodModalId = "register-good";
	const supplierModalId = "register-supplier";
	const utils = trpc.useContext();
	const goods = trpc.useQuery(["good.allByCategory"]);
	const users = trpc.useQuery(["user.all"]);
	const suppliers = trpc.useQuery(["supplier.all"]);
	const purchase = trpc.useMutation("purchase.create", {
		onSuccess: () => {
			utils.invalidateQueries("purchase.allInPeriod");
			router.push("/restricted/reports/purchases");
		},
	});

	const dataLoaded =
		!goods.isLoading &&
		goods.data &&
		!users.isLoading &&
		users.data &&
		!suppliers.isLoading &&
		suppliers.data;

	return (
		<div className="min-h-screen flex flex-col justify-center">
			<RegisterGoods id={goodModalId} />
			<RegisterSupplier id={supplierModalId} />
			<div className="text-2xl flex flex-row justify-center">
				Register purchase
			</div>
			<div className="p-2" />
			{purchase.isSuccess && <SuccessFormAlert created={"purchase"} />}
			<div className="p-2" />
			<Formik
				initialValues={{
					receiverId: "",
					supplierId: "",
					dateReceived: "",
					time: "",
					goodsPurchased: [purchaseObject],
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

					purchase.mutate(formatted);
				}}
			>
				{({ values }) => (
					<>
						{dataLoaded && (
							<PurchaseForm
								users={users.data}
								suppliers={suppliers.data}
								supplierModalId={supplierModalId}
								values={values}
								goods={goods.data}
								goodModalId={goodModalId}
							/>
						)}
					</>
				)}
			</Formik>
			<div className="p-2" />
			{purchase.error && purchase.error.data && (
				<>
					{purchase.error.data?.code === "BAD_REQUEST" ? (
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

export default Purchase;
