import React, { useState } from "react";
import { Badge } from "../../../components/ui/Badge";

const MiniTag = ({ children }) => (
	<span
		style={{
			fontSize: "0.7rem",
			padding: "2px 8px",
			background: "rgba(26,115,232,0.1)",
			borderRadius: 4,
			color: "var(--primary)",
		}}
	>
		{children}
	</span>
);

export const GapCard = ({ item }) => {
	const [expanded, setExpanded] = useState(false);

	return (
		<div
			style={{
				padding: 16,
				marginBottom: 12,
				borderRadius: 12,
				background: "var(--bg-body)",
				border: "1px solid var(--border)",
				transition: "transform 0.2s, box-shadow 0.2s",
				cursor: "pointer",
			}}
		>
			<div
				style={{
					display: "flex",
					justifyContent: "space-between",
					gap: 12,
					alignItems: "flex-start",
				}}
			>
				<h4
					style={{
						fontSize: "0.95rem",
						fontWeight: 500,
						lineHeight: 1.4,
						flex: 1,
						margin: 0,
					}}
				>
					{item.titulo}
				</h4>
				<Badge variant={item.relevancia}>{item.relevancia}</Badge>
			</div>

			<div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
				{item.etiquetas.map((tag, idx) => (
					<MiniTag key={idx}>{tag}</MiniTag>
				))}
			</div>

			{expanded && (
				<div
					style={{
						marginTop: 12,
						paddingTop: 12,
						borderTop: "1px solid var(--border)",
						fontSize: "0.85rem",
						color: "var(--text-secondary)",
					}}
				>
					<p style={{ marginBottom: 4 }}>
						<strong>Por qué es brecha:</strong> {item.por_que_brecha}
					</p>
					<p>
						<strong>Oportunidad:</strong> {item.oportunidad}
					</p>
				</div>
			)}

			<button
				onClick={() => setExpanded(!expanded)}
				style={{
					marginTop: 10,
					fontSize: "0.8rem",
					color: "var(--primary)",
					background: "none",
					border: "none",
					cursor: "pointer",
					fontWeight: 500,
					padding: 0,
				}}
			>
				{expanded ? "Ver menos" : "Ver análisis"}
			</button>
		</div>
	);
};
