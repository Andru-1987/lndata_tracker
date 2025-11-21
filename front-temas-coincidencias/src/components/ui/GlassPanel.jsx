import React from "react";

export const GlassPanel = ({ children, style, className = "" }) => {
	const panelStyle = {
		background: "var(--bg-surface)",
		backdropFilter: "blur(12px)",
		WebkitBackdropFilter: "blur(12px)",
		border: "1px solid var(--border)",
		borderRadius: "var(--radius-md)",
		boxShadow: "var(--shadow-card)",
		overflow: "hidden",
		marginBottom: 20,
		...style,
	};

	return (
		<div style={panelStyle} className={className}>
			{children}
		</div>
	);
};
