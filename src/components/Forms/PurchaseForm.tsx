import { InferQueryOutput } from "@/utils/trpc";
import { Category } from "@prisma/client";
import { Field, FieldArray, Form } from "formik";
import React from "react";
import {
	CategoryField,
	GoodField,
	SupplierField,
	TimeField,
	UserField,
} from "./InventoryFields";

const PurchaseForm: React.FC<{
	users: InferQueryOutput<"user.all">;
	suppliers: InferQueryOutput<"supplier.all">;
	supplierModalId: string;
	values: {
		receiverId: string;
		supplierId: string;
		dateReceived: string;
		time: string;
		goodsPurchased: Array<{
			category: Category;
			goodId: string;
			units: string;
			price: string;
		}>;
	};
	goods: InferQueryOutput<"good.allByCategory">;
	goodModalId: string;
}> = ({ users, suppliers, supplierModalId, values, goods, goodModalId }) => {
	const purchaseObject = {
		category: "" as Category,
		goodId: "",
		units: "",
		price: "",
	};

	return (
		<Form className="w-full shadow-xl p-4">
			<div className="flex flex-row justify-evenly">
				<div>
					<label className="label label-text col-span-2">Receiver</label>
					<UserField name={"receiverId"} users={users} />
				</div>
				<div className="flex flex-row">
					<div>
						<label className="label label-text col-span-2">Supplier</label>
						<SupplierField name={"supplierId"} suppliers={suppliers} />
					</div>
					<div className="p-1" />
					<div>
						<label className="label label-text col-span-2">Add supplier</label>
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
						<label className="label label-text col-span-2">Category</label>
						<label className="label label-text col-span-2">Good</label>
						<label className="label label-text col-span-1">Add good</label>
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
									<CategoryField name={`goodsPurchased[${index}].category`} />
									<GoodField
										name={`goodsPurchased[${index}].goodId`}
										category={
											values.goodsPurchased[index]?.category as Category
										}
										goods={goods}
									/>
									<label
										htmlFor={goodModalId}
										className="btn modal-button w-12 h-12"
									>
										+
									</label>
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
	);
};

export default PurchaseForm;
