import { ErrorFormAlert, SuccessFormAlert } from "@/components/FormAlerts";
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
import React from "react";

const Purchase: NextPage = () => {
	const purchaseObject = {
		category: "" as Category,
		goodId: "",
		units: "",
		price: "",
	};
	const goodModalId = "register-good";
	const supplierModalId = "register-supplier";
	const goods = trpc.useQuery(["good.allByCategory"]);
	const users = trpc.useQuery(["user.all"]);
	const suppliers = trpc.useQuery(["supplier.all"]);
	const purchase = trpc.useMutation("purchase.create");

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
				onSubmit={(values, { resetForm }) => {
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
					if (purchase.isSuccess && !purchase.isError) {
						resetForm({
							values: {
								receiverId: "",
								supplierId: "",
								dateReceived: "",
								time: "",
								goodsPurchased: [purchaseObject],
							},
						});
					}
				}}
			>
				{({ values }) => (
					<Form className="w-full shadow-xl p-4">
						<div className="flex flex-row justify-evenly">
							<div>
								<label className="label label-text col-span-2">Receiver</label>
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
									{values.goodsPurchased && values.goodsPurchased.length > 0 ? (
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
					</Form>
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
