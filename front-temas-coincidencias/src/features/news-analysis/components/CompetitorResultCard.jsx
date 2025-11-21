import {
	ChevronDown,
	ChevronLeft,
	ChevronRight,
	ChevronUp,
} from "lucide-react";
import React, { useState } from "react";
import { Button } from "../../../components/ui/Button";
import { GlassPanel } from "../../../components/ui/GlassPanel";
import { GapCard } from "./GapCard";
import { KPIStatsGrid } from "./KPIStatsGrid";

export const CompetitorResultCard = ({ data, categories }) => {
	const [activeCategory, setActiveCategory] = useState(categories[0] || "");
	const [isExpanded, setIsExpanded] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 5;

	const categoryData = data.categories[activeCategory];

	if (!categoryData) return null;

	const totalPages = Math.ceil(categoryData.temas_unicos.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedItems = categoryData.temas_unicos.slice(
		startIndex,
		startIndex + itemsPerPage,
	);

	return (
		<GlassPanel>
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				style={{
					width: "100%",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					padding: 20,
					background: "transparent",
					border: "none",
					color: "var(--text-primary)",
					cursor: "pointer",
				}}
			>
				<h2 style={{ fontSize: "1.2rem", fontWeight: 500 }}>
					{data.competencia_nombre}
				</h2>
				{isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
			</button>

			{isExpanded && (
				<div>
					{/* Tabs */}
					<div
						style={{
							display: "flex",
							gap: 8,
							overflowX: "auto",
							padding: "0 20px 12px",
							borderBottom: "1px solid var(--border)",
						}}
					>
						{categories.map((cat) => (
							<button
								key={cat}
								onClick={() => setActiveCategory(cat)}
								style={{
									padding: "6px 16px",
									borderRadius: 8,
									border: "none",
									background:
										activeCategory === cat ? "var(--accent)" : "transparent",
									color:
										activeCategory === cat
											? "var(--primary)"
											: "var(--text-secondary)",
									cursor: "pointer",
									whiteSpace: "nowrap",
									transition: "all 0.2s",
									fontWeight: activeCategory === cat ? 600 : 400,
								}}
							>
								{cat.toUpperCase()}
							</button>
						))}
					</div>

					{/* Content */}
					<div style={{ padding: 20 }}>
						<KPIStatsGrid data={categoryData} />

						<h3
							style={{
								fontSize: "1rem",
								marginBottom: 12,
								fontWeight: 500,
								color: "var(--text-secondary)",
							}}
						>
							TEMAS ÚNICOS (BRECHAS)
						</h3>

						<div>
							{paginatedItems.map((item, idx) => (
								<GapCard key={idx} item={item} />
							))}
						</div>

						{/* Pagination */}
						{totalPages > 1 && (
							<div
								style={{
									display: "flex",
									justifyContent: "center",
									gap: 16,
									marginTop: 24,
									alignItems: "center",
								}}
							>
								<Button
									variant="secondary"
									onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
									disabled={currentPage === 1}
									style={{ padding: 8, borderRadius: "50%" }}
								>
									<ChevronLeft size={20} />
								</Button>

								<span
									style={{
										fontSize: "0.9rem",
										color: "var(--text-secondary)",
										fontWeight: 500,
									}}
								>
									{currentPage} / {totalPages}
								</span>

								<Button
									variant="secondary"
									onClick={() =>
										setCurrentPage(Math.min(totalPages, currentPage + 1))
									}
									disabled={currentPage === totalPages}
									style={{ padding: 8, borderRadius: "50%" }}
								>
									<ChevronRight size={20} />
								</Button>
							</div>
						)}

						{/* Recommendations */}
						{categoryData.recomendaciones.length > 0 && (
							<div
								style={{
									marginTop: 24,
									padding: 16,
									background: "var(--accent)",
									borderRadius: 12,
								}}
							>
								<h3
									style={{
										fontSize: "0.9rem",
										marginBottom: 8,
										color: "var(--primary)",
										fontWeight: 600,
									}}
								>
									RECOMENDACIONES IA
								</h3>
								<ul
									style={{
										listStyle: "none",
										fontSize: "0.9rem",
										color: "var(--text-primary)",
									}}
								>
									{categoryData.recomendaciones.map((rec, idx) => (
										<li
											key={idx}
											style={{ display: "flex", gap: 8, marginBottom: 4 }}
										>
											<span>⚡</span> {rec}
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>
			)}
		</GlassPanel>
	);
};
