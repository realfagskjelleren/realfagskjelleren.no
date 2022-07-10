import { InferQueryOutput } from "@/utils/trpc";
import { Category } from "@prisma/client";
import { Field, FieldArray, Form } from "formik";
import React from "react";
import {
	CategoryField,
	GoodField,
	TimeField,
	UserField,
} from "./InventoryFields";

const SaleForm: React.FC<{
	users: InferQueryOutput<"user.all">;
	values: {
		responsibleId: string;
		dateSold: string;
		time: string;
		goodsSold: Array<{
			category: Category;
			goodId: string;
			units: string;
			pricePerUnit: string;
		}>;
	};
	goods: InferQueryOutput<"good.allByCategory">;
}> = ({ users, values, goods }) => {
	const saleObject = {
		category: "" as Category,
		goodId: "",
		units: "",
		pricePerUnit: "",
	};

	return (
		<Form className="w-full shadow-xl p-4">
			<div className="flex flex-row justify-evenly">
				<div>
					<label className="label label-text col-span-2">Responsible</label>
					<UserField name={"responsibleId"} users={users} />
				</div>
				<div>
					<label className="label label-text col-span-2">Date</label>
					<Field className="input" type="date" name="dateSold" />
				</div>
				<div>
					<label className="label label-text col-span-2">Time</label>
					<TimeField name={"time"} />
				</div>
			</div>
			<div className="divider" />
			<FieldArray
				name="goodsSold"
				render={(arrayHelpers) => (
					<div className="grid grid-cols-10 gap-2">
						<label className="label label-text col-span-2">Category</label>
						<label className="label label-text col-span-2">Good</label>
						<label className="label label-text col-span-2">Units</label>
						<label className="label label-text col-span-2">
							Price per unit
						</label>
						<label className="label label-text">Add</label>
						<label className="label label-text">Remove</label>
						{values.goodsSold && values.goodsSold.length > 0 ? (
							values.goodsSold.map((good, index) => (
								<div
									key={index}
									className="grid grid-cols-10 gap-2 col-span-11 items-center"
								>
									<CategoryField name={`goodsSold[${index}].category`} />
									<GoodField
										name={`goodsSold[${index}].goodId`}
										category={values.goodsSold[index]?.category as Category}
										goods={goods}
									/>
									<Field
										className="input col-span-2"
										type="number"
										min="1"
										name={`goodsSold[${index}].units`}
										placeholder="Units"
									/>
									<Field
										className="input col-span-2"
										type="number"
										step="0.01"
										min="0.01"
										name={`goodsSold[${index}].pricePerUnit`}
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
											arrayHelpers.insert(index, saleObject);
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
									onClick={() => arrayHelpers.push(saleObject)}
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
	);
};

export default SaleForm;
