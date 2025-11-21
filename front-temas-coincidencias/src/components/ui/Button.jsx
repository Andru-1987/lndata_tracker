import React from "react";

export const Button = ({
	children,
	variant = "primary",
	disabled,
	onClick,
	style,
	fullWidth = false,
}) => {
	const baseStyle = {
		padding: "12px 24px",
		borderRadius: "var(--radius-pill)",
		fontWeight: 500,
		cursor: disabled ? "not-allowed" : "pointer",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
		transition: "all 0.2s",
		border: "none",
		width: fullWidth ? "100%" : "auto",
		opacity: disabled ? 0.6 : 1,
	};

	const variants = {
		primary: {
			background: "var(--primary)",
			color: "#fff",
		},
		secondary: {
			background: "transparent",
			border: "1px solid var(--border)",
			color: "var(--text-primary)",
		},
		icon: {
			padding: 8,
			borderRadius: "50%",
			background: "transparent",
			color: "var(--text-secondary)",
		},
	};

	return (
		<button
			onClick={onClick}
			disabled={disabled}
			style={{ ...baseStyle, ...variants[variant], ...style }}
		>
			{children}
		</button>
	);
};
