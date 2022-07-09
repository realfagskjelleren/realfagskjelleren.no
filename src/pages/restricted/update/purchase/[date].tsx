import {
	CategoryField,
	GoodField,
	ReceiverField,
	SupplierField,
	TimeField,
} from "@/components/InventoryFields";
import RegisterGoods from "@/components/RegisterGoods";
import RegisterSupplier from "@/components/RegisterSupplier";
import { dateAsUTC } from "@/utils/dateHelpers";
import { trpc } from "@/utils/trpc";
import { Category } from "@prisma/client";
import { Field, FieldArray, Form, Formik } from "formik";
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
		},
	});
	const purchase = trpc.useQuery([
		"purchase.allInPeriod",
		{ start: d, end: d },
	]);

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
			{updatePurchase.isSuccess && (
				<>
					<div className="alert alert-success shadow-lg">
						<div>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								className="stroke-current flex-shrink-0 h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<span>You updated a purchase!</span>
						</div>
					</div>
					<div className="p-2" />
				</>
			)}
			{!purchase.isLoading && purchase.data && purchase.data[0] && (
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
						<Form className="w-full shadow-xl p-4">
							<div className="flex flex-row justify-evenly">
								<div>
									<label className="label label-text col-span-2">
										Receiver
									</label>
									{!users.isLoading && users.data && (
										<ReceiverField name={"receiverId"} users={users.data} />
									)}
								</div>
								<div className="flex flex-row">
									<div>
										<label className="label label-text col-span-2">
											Supplier
										</label>
										{!suppliers.isLoading && suppliers.data && (
											<SupplierField
												name={"supplierId"}
												suppliers={suppliers.data}
											/>
										)}
									</div>
									<div className="p-1" />
									<div>
										<label className="label label-text col-span-2">
											Add supplier
										</label>
										<label
											htmlFor={supplierModalId}
											className="btn modal-button w-12 h-12"
										>
											+
										</label>
									</div>
								</div>
								<div>
									<label className="label label-text col-span-2">Date</label>
									<Field className="input" type="date" name="dateReceived" />
								</div>
								<div>
									<label className="label label-text col-span-2">Time</label>
									<TimeField name={"time"} />
								</div>
							</div>
							<div className="divider" />
							<FieldArray
								name="goodsPurchased"
								render={(arrayHelpers) => (
									<div className="grid grid-cols-11 gap-2">
										<label className="label label-text col-span-2">
											Category
										</label>
										<label className="label label-text col-span-2">Good</label>
										<label className="label label-text col-span-1">
											Add good
										</label>
										<label className="label label-text col-span-2">Units</label>
										<label className="label label-text col-span-2">
											Price (no VAT)
										</label>
										<label className="label label-text">Add</label>
										<label className="label label-text">Remove</label>
										{values.goodsPurchased &&
										values.goodsPurchased.length > 0 ? (
											values.goodsPurchased.map((good, index) => (
												<div
													key={index}
													className="grid grid-cols-11 gap-2 col-span-11 items-center"
												>
													{!goods.isLoading && goods.data && (
														<>
															<CategoryField
																name={`goodsPurchased[${index}].category`}
															/>
															<GoodField
																name={`goodsPurchased[${index}].goodId`}
																category={
																	values.goodsPurchased[index]
																		?.category as Category
																}
																goods={goods.data}
															/>
															<label
																htmlFor={goodModalId}
																className="btn modal-button w-12 h-12"
															>
																+
															</label>
														</>
													)}
													<Field
														className="input col-span-2"
														type="number"
														min="1"
														name={`goodsPurchased[${index}].units`}
														placeholder="Units"
													/>
													<Field
														className="input col-span-2"
														type="number"
														step="0.01"
														min="0.01"
														name={`goodsPurchased[${index}].price`}
														placeholder="Price"
													/>
													<button
														type="button"
														className="btn btn-secondary w-12 h-12"
														onClick={() => arrayHelpers.remove(index)}
													>
														-
													</button>
													<button
														type="button"
														className="btn btn-secondary w-12 h-12"
														onClick={() => {
															arrayHelpers.insert(index, purchaseObject);
														}}
													>
														+
													</button>
												</div>
											))
										) : (
											<div className="col-start-9 col-end-10 flex flex-row">
												<button
													type="button"
													className="btn btn-secondary"
													onClick={() => arrayHelpers.push(purchaseObject)}
												>
													Add purchase
												</button>
											</div>
										)}
									</div>
								)}
							/>
							<div className="p-2" />
							<div className="flex flex-row justify-center">
								<button type="submit" className="btn btn-primary">
									Submit
								</button>
							</div>
							{updatePurchase.error?.message && (
								<div className="">
									<div className="p-2" />
									<div className="alert alert-error shadow-lg">
										<div>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="stroke-current flex-shrink-0 h-6 w-6"
												fill="none"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											<span>
												Error!
												{updatePurchase.error.data?.code === "BAD_REQUEST" ? (
													<div>
														The server either recieved an empty, non-selected or
														nonpositive field.
													</div>
												) : (
													<div>
														The server experienced an unexpected error, could
														not create good(s).
													</div>
												)}
											</span>
										</div>
									</div>
								</div>
							)}
						</Form>
					)}
				</Formik>
			)}
		</div>
	);
};

export default UpdatePurchase;