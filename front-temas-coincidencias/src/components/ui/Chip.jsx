import React from "react";

export const Chip = ({ children, active, onClick, disabled }) => {
	const style = {
		padding: "6px 14px",
		borderRadius: "var(--radius-pill)",
		border: `1px solid ${active ? "var(--primary)" : "var(--border)"}`,
		background: active ? "var(--accent)" : "transparent",
		color: active ? "var(--primary)" : "var(--text-secondary)",
		fontSize: "0.85rem",
		cursor: disabled ? "not-allowed" : "pointer",
		transition: "all 0.2s",
		fontWeight: active ? 500 : 400,
		opacity: disabled ? 0.5 : 1,
	};

	return (
		<button onClick={onClick} disabled={disabled} style={style}>
			{children}
		</button>
	);
};
