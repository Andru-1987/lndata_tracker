import { BarChart2, RefreshCw, Zap } from "lucide-react";
import React from "react";
import { GlassPanel } from "../../../components/ui/GlassPanel";

const MiniTag = ({ children }) => (
	<span
		style={{
			fontSize: "0.7rem",
			padding: "2px 8px",
			background: "rgba(128,128,128,0.1)",
			borderRadius: 4,
			color: "var(--text-secondary)",
		}}
	>
		{children}
	</span>
);

const StatCard = ({ label, value, tags, icon }) => (
	<GlassPanel style={{ padding: 20, marginBottom: 0 }}>
		<div style={{ marginBottom: 8 }}>{icon}</div>
		<div
			style={{
				fontSize: "2rem",
				fontWeight: 300,
				color: "var(--text-primary)",
				lineHeight: 1,
			}}
		>
			{value}
		</div>
		<div
			style={{
				fontSize: "0.75rem",
				textTransform: "uppercase",
				color: "var(--text-secondary)",
				letterSpacing: "0.05em",
				fontWeight: 600,
			}}
		>
			{label}
		</div>

		{tags && tags.length > 0 && (
			<div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
				{tags.map((tag, idx) => (
					<MiniTag key={idx}>{tag}</MiniTag>
				))}
			</div>
		)}
	</GlassPanel>
);

export const KPIStatsGrid = ({ data }) => {
	if (!data) return null;

	return (
		<div className="grid-cols-3">
			<StatCard
				label="Etiquetas que cubro"
				value={data.etiquetas_cubiertas.length}
				tags={data.etiquetas_cubiertas}
				icon={<BarChart2 size={16} color="var(--primary)" />}
			/>
			<StatCard
				label="Etiquetas que NO cubro"
				value={data.etiquetas_no_cubiertas.length}
				tags={data.etiquetas_no_cubiertas}
				icon={<Zap size={16} color="var(--color-warning)" />}
			/>
			<StatCard
				label="Coincidencias"
				value={data.coincidencias}
				tags={data.etiquetas_coincidentes}
				icon={<RefreshCw size={16} color="var(--color-success)" />}
			/>
		</div>
	);
};
