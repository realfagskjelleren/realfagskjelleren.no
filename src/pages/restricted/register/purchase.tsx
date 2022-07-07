import RegisterGoods from "@/components/RegisterGoods";
import { InferQueryOutput, trpc } from "@/utils/trpc";
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
		<div className="h-screen flex flex-col justify-center">
			<RegisterGoods id={goodModalId} />
			<RegisterSupplier id={supplierModalId} />
			<div className="text-2xl flex flex-row justify-center">
				Register purchase
			</div>
			<div className="p-2" />
			{purchase.isSuccess && (
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
							<span>You created a purchase!</span>
						</div>
					</div>
					<div className="p-2" />
				</>
			)}
			<Formik
				initialValues={{
					receiverId: "",
					supplierId: "",
					dateReceived: "",
					time: "",
					goodsPurchased: [purchaseObject],
				}}
				onSubmit={(values, { resetForm }) => {
					const date = new Date(values.dateReceived);
					date.setHours(date.getHours() + parseInt(values.time));
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
						dateReceived: date,
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
						{purchase.error?.message && (
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
											{purchase.error.data?.code === "BAD_REQUEST" ? (
												<div>
													The server either recieved an empty, non-selected or
													nonpositive field.
												</div>
											) : (
												<div>
													The server experienced an unexpected error, could not
													create good(s).
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
		</div>
	);
};

export default Purchase;

const TimeField: React.FC<{ name: string }> = (props) => {
	const times: Array<number> = [];
	for (let i = 0; i < 24; i++) {
		times.push(i);
	}

	const timeToString = (time: number) => {
		if (time < 10) {
			return `0${time}:00`;
		} else {
			return `${time}:00`;
		}
	};

	return (
		<Field className="select" as="select" name={props.name}>
			<option value="">--Select time--</option>
			{times.map((time, index) => (
				<option key={index} value={time}>
					{timeToString(time)}
				</option>
			))}
		</Field>
	);
};

const CategoryField: React.FC<{ name: string }> = (props) => {
	const categories = [];
	for (const category in Category) {
		categories.push(category);
	}
	return (
		<Field className="select col-span-2" as="select" name={props.name}>
			<option value="">--Select category--</option>
			{categories.map((category, index) => (
				<option key={index} value={category}>
					{category}
				</option>
			))}
		</Field>
	);
};

const GoodField: React.FC<{
	name: string;
	category: Category | string;
	goods: InferQueryOutput<"good.allByCategory">;
}> = (props) => {
	return (
		<Field
			className="select col-span-2"
			as="select"
			name={props.name}
			disabled={props.category === ""}
		>
			<option value="">--Select good--</option>
			{props.category &&
				props.goods[props.category as Category].map((good, index) => (
					<option key={index} value={good.id}>
						{good.brand} - {good.name} - {good.volume}
					</option>
				))}
		</Field>
	);
};

const ReceiverField: React.FC<{
	name: string;
	users: InferQueryOutput<"user.all">;
}> = (props) => {
	return (
		<Field className="select" as="select" name={props.name}>
			<option>--Select receiver--</option>
			{props.users.map((user, index) => (
				<option key={index} value={user.id}>
					{user.name}
				</option>
			))}
		</Field>
	);
};

const SupplierField: React.FC<{
	name: string;
	suppliers: InferQueryOutput<"supplier.all">;
}> = (props) => {
	return (
		<Field className="select" as="select" name={props.name}>
			<option>--Select supplier--</option>
			{props.suppliers.map((supplier, index) => (
				<option key={index} value={supplier.id}>
					{supplier.name}
				</option>
			))}
		</Field>
	);
};

const RegisterSupplier: React.FC<{ id: string }> = (props) => {
	const utils = trpc.useContext();
	const supplier = trpc.useMutation("supplier.create", {
		onSuccess: () => {
			utils.invalidateQueries("supplier.all");
		},
	});
	return (
		<>
			<input type="checkbox" id={props.id} className="modal-toggle" />
			<div className="modal">
				<div className="modal-box w-11/12 max-w-5xl">
					<label
						htmlFor={props.id}
						className="btn btn-sm btn-circle absolute right-2 top-2"
					>
						✕
					</label>
					<div className="text-2xl flex flex-row justify-center">
						Register supplier
					</div>
					<div className="p-2" />
					{supplier.isSuccess && (
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
									<span>
										You created the supplier {supplier.data.name} -
										{supplier.data.orgNum}!
									</span>
								</div>
							</div>
							<div className="p-2" />
						</>
					)}
					<Formik
						initialValues={{ name: "", orgNum: "" }}
						onSubmit={(values, { resetForm }) => {
							supplier.mutate({
								...values,
								orgNum: parseInt(values.orgNum),
							});
							if (supplier.isSuccess) {
								resetForm({ values: { name: "", orgNum: "" } });
							}
						}}
					>
						{() => (
							<Form className="w-full">
								<div className="flex flex-row justify-evenly">
									<div>
										<label className="label label-text col-span-2">Name</label>
										<Field
											className="input"
											type="text"
											name="name"
											placeholder="Name"
										/>
									</div>
									<div>
										<label className="label label-text col-span-2">
											Organization number
										</label>
										<Field
											className="input"
											type="number"
											name="orgNum"
											placeholder="Organization number"
										/>
									</div>
								</div>
								<div className="p-2" />
								<div className="flex flex-row justify-center">
									<button type="submit" className="btn btn-primary">
										Submit
									</button>
								</div>
								{supplier.error?.message && (
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
													{supplier.error.data?.code === "BAD_REQUEST" ? (
														<div>
															The server either received an illegal name or the
															organization number is not 9 length
														</div>
													) : (
														<div>
															The server experienced an unexpected error, could
															not create the supplier. Mostly likely, the
															supplier already exists.
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
				</div>
			</div>
		</>
	);
};
