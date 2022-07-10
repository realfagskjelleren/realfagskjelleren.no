import { InferQueryOutput } from "@/utils/trpc";
import { Category } from "@prisma/client";
import { Field } from "formik";
import React from "react";

export const SupplierField: React.FC<{
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

export const UserField: React.FC<{
	name: string;
	users: InferQueryOutput<"user.all">;
}> = (props) => {
	return (
		<Field className="select" as="select" name={props.name}>
			<option>--Select user--</option>
			{props.users.map((user, index) => (
				<option key={index} value={user.id}>
					{user.name}
				</option>
			))}
		</Field>
	);
};

export const GoodField: React.FC<{
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

export const CategoryField: React.FC<{ name: string }> = (props) => {
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

export const TimeField: React.FC<{ name: string }> = (props) => {
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
