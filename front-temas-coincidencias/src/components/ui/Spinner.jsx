import React from "react";

export const Spinner = ({ size = 40 }) => {
	const style = {
		width: size,
		height: size,
		border: "3px solid var(--border)",
		borderTopColor: "var(--primary)",
		borderRadius: "50%",
		animation: "spin 0.8s linear infinite",
	};

	return <div style={style}></div>;
};
