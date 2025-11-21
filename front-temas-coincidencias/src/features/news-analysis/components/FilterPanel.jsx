import { ChevronDown, ChevronUp, RefreshCw, Search } from "lucide-react";
import React from "react";
import { Badge } from "../../../components/ui/Badge";
import { Button } from "../../../components/ui/Button";
import { Chip } from "../../../components/ui/Chip";
import { GlassPanel } from "../../../components/ui/GlassPanel";
import { useNewsStore } from "../stores/useNewsStore";

export const FilterPanel = ({
	showFilters,
	setShowFilters,
	onSearch,
	loading,
}) => {
	const {
		competencias,
		categories,
		selectedCompetencias,
		selectedCategories,
		filtersLocked,
		setSelectedCompetencias,
		setSelectedCategories,
		resetFilters,
	} = useNewsStore();

	const toggleCompetencia = (comp) => {
		if (filtersLocked) return;
		const isSelected = selectedCompetencias.find((c) => c.id === comp.id);
		setSelectedCompetencias(
			isSelected
				? selectedCompetencias.filter((c) => c.id !== comp.id)
				: [...selectedCompetencias, comp],
		);
	};

	const toggleCategory = (cat) => {
		if (filtersLocked) return;
		setSelectedCategories(
			selectedCategories.includes(cat)
				? selectedCategories.filter((c) => c !== cat)
				: [...selectedCategories, cat],
		);
	};

	return (
		<GlassPanel>
			<button
				onClick={() => setShowFilters(!showFilters)}
				style={{
					width: "100%",
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					padding: 16,
					background: "transparent",
					border: "none",
					color: "var(--text-primary)",
					cursor: "pointer",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: 8 }}>
					<span style={{ fontWeight: 500 }}>Filtros de Búsqueda</span>
					{filtersLocked && <Badge variant="baja">Bloqueado</Badge>}
				</div>
				{showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
			</button>

			{showFilters && (
				<div style={{ padding: "0 16px 20px", animation: "slideDown 0.3s" }}>
					<div style={{ marginBottom: 16 }}>
						<label
							style={{
								fontSize: "0.8rem",
								color: "var(--text-secondary)",
								fontWeight: 600,
								marginBottom: 8,
								display: "block",
							}}
						>
							COMPETENCIAS
						</label>
						<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
							{competencias.map((comp) => (
								<Chip
									key={comp.id}
									active={!!selectedCompetencias.find((c) => c.id === comp.id)}
									onClick={() => toggleCompetencia(comp)}
									disabled={filtersLocked}
								>
									{comp.nombre}
								</Chip>
							))}
						</div>
					</div>

					<div style={{ marginBottom: 24 }}>
						<label
							style={{
								fontSize: "0.8rem",
								color: "var(--text-secondary)",
								fontWeight: 600,
								marginBottom: 8,
								display: "block",
							}}
						>
							CATEGORÍAS
						</label>
						<div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
							{categories.map((cat) => (
								<Chip
									key={cat}
									active={selectedCategories.includes(cat)}
									onClick={() => toggleCategory(cat)}
									disabled={filtersLocked}
								>
									{cat.charAt(0).toUpperCase() + cat.slice(1)}
								</Chip>
							))}
						</div>
					</div>

					<div style={{ display: "flex", gap: 10 }}>
						<Button
							variant="primary"
							onClick={onSearch}
							disabled={loading || filtersLocked}
							fullWidth
						>
							<Search size={18} />
							{loading
								? "Analizando..."
								: filtersLocked
									? "Análisis completado"
									: "Buscar"}
						</Button>
						<Button
							variant="secondary"
							onClick={resetFilters}
							disabled={loading}
						>
							<RefreshCw size={18} />
						</Button>
					</div>
				</div>
			)}
		</GlassPanel>
	);
};
