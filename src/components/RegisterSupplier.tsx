import { trpc } from "@/utils/trpc";
import { Field, Form, Formik } from "formik";
import React from "react";

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

export default RegisterSupplier;
