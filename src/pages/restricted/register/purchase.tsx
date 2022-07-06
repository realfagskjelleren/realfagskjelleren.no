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
	const modalId = "register-good";
	const goods = trpc.useQuery(["good.allByCategory"]);

	return (
		<div className="h-screen flex flex-col justify-center">
			<RegisterGoods id={modalId} />
			<div className="text-2xl flex flex-row justify-center">
				Register purchase
			</div>
			<div className="p-2" />
			<Formik
				initialValues={{
					recieverId: "",
					dateRecieved: "",
					goodsPurchased: [purchaseObject],
				}}
				onSubmit={(values) => {
					console.log(values);
				}}
			>
				{({ values }) => (
					<Form className="w-full">
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
															htmlFor={modalId}
															className="btn modal-button w-16 h-16"
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
		</div>
	);
};

export default Purchase;

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
