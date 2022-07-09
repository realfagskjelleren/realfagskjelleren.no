import React from "react";

export const SuccessFormAlert: React.FC<{
	created?: string;
	updated?: string;
}> = ({ created, updated }) => {
	return (
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
				{created && <span>You created a {created}!</span>}
				{updated && <span>You updated a {updated}!</span>}
			</div>
		</div>
	);
};

export const ErrorFormAlert: React.FC<{ badReq?: string; attempt: string }> = ({
	badReq,
	attempt,
}) => {
	return (
		<div>
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
					<span className="flex flex-row">
						Error!
						<div className="p-1" />
						{badReq ? (
							<div>{badReq}</div>
						) : (
							<div>
								The server experienced an unexpected error, could not create
								{attempt}.
							</div>
						)}
					</span>
				</div>
			</div>
		</div>
	);
};
