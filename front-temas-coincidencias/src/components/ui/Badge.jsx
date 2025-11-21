import React from "react";

export const Badge = ({ children, variant = "default" }) => {
	const variants = {
		alta: { background: "rgba(234, 67, 53, 0.15)", color: "#ea4335" },
		media: { background: "rgba(251, 188, 4, 0.15)", color: "#f9ab00" },
		baja: { background: "rgba(154, 160, 166, 0.15)", color: "#9aa0a6" },
		default: {
			background: "rgba(128, 128, 128, 0.15)",
			color: "var(--text-secondary)",
		},
	};

	const style = {
		fontSize: "0.7rem",
		padding: "2px 8px",
		borderRadius: 4,
		fontWeight: 700,
		textTransform: "uppercase",
		display: "inline-block",
		...variants[variant],
	};

	return <span style={style}>{children}</span>;
};
