import React from "react";
import { Category } from "@prisma/client";
import { Field, FieldArray, Form, Formik } from "formik";
import { InferMutationInput, trpc } from "@/utils/trpc";
import { ErrorFormAlert, SuccessFormAlert } from "./FormAlerts";

const RegisterGoods: React.FC<{ id: string }> = (props) => {
	const utils = trpc.useContext();
	const createGoods = trpc.useMutation("good.createMany", {
		onSuccess: () => {
			utils.invalidateQueries("good.all");
			utils.invalidateQueries("good.allByCategory");
		},
	});

	const goodsObject = {
		category: "" as Category,
		brand: "",
		name: "",
		volume: "",
	};

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
						Register goods
					</div>
					<div className="p-2" />
					{createGoods.isSuccess && <SuccessFormAlert created="goods" />}
					<div className="p-2" />
					<Formik
						initialValues={{
							goods: [goodsObject],
						}}
						onSubmit={(values, { resetForm }) => {
							if (values.goods === []) return;
							const formatted: InferMutationInput<"good.createMany"> = [];
							for (let i = 0; i < values.goods.length; i++) {
								const good = values.goods[i];
								if (
									good?.brand === undefined ||
									good?.category === undefined ||
									good?.name === undefined ||
									good?.volume === undefined
								) {
									return;
								}
								const parsed = {
									...good,
									volume: parseFloat(good.volume),
								};
								formatted.push(parsed);
							}
							createGoods.mutate(formatted);
							if (createGoods.isSuccess) {
								resetForm({ values: { goods: [goodsObject] } });
							}
						}}
					>
						{({ values }) => (
							<Form className="w-full">
								<FieldArray
									name="goods"
									render={(arrayHelpers) => (
										<div className="grid grid-cols-10 gap-2">
											<label className="label label-text col-span-2">
												Category
											</label>
											<label className="label label-text col-span-2">
												Brand
											</label>
											<label className="label label-text col-span-2">
												Name
											</label>
											<label className="label label-text col-span-2">
												Volume (L)
											</label>
											<label className="label label-text">Add</label>
											<label className="label label-text">Remove</label>
											{values.goods && values.goods.length > 0 ? (
												values.goods.map((good, index) => (
													<div
														key={index}
														className="grid grid-cols-10 gap-2 col-span-10 items-center"
													>
														<CategoryField name={`goods[${index}].category`} />
														<Field
															className="input col-span-2"
															type="text"
															name={`goods[${index}].brand`}
															placeholder="Brand"
														/>
														<Field
															className="input col-span-2"
															type="text"
															name={`goods[${index}].name`}
															placeholder="Name"
														/>
														<Field
															className="input col-span-2"
															type="number"
															min="0.001"
															step="0.001"
															name={`goods[${index}].volume`}
															placeholder="Volume"
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
																arrayHelpers.insert(index, goodsObject);
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
														onClick={() => arrayHelpers.push(goodsObject)}
													>
														Add good
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
					{createGoods.error && createGoods.error.data && (
						<>
							{createGoods.error.data?.code === "BAD_REQUEST" ? (
								<ErrorFormAlert
									badReq="The server either recieved an empty, non-selected or nonpositive field."
									attempt="goods"
								/>
							) : (
								<ErrorFormAlert attempt="goods" />
							)}
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default RegisterGoods;

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
