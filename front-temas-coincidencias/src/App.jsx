import { useEffect, useState } from "react";
import { Header } from "./components/layout/Header";
import { GlassPanel } from "./components/ui/GlassPanel";
import { Spinner } from "./components/ui/Spinner";
import { CompetitorResultCard } from "./features/news-analysis/components/CompetitorResultCard";
import { FilterPanel } from "./features/news-analysis/components/FilterPanel";
import { analysisService } from "./features/news-analysis/services/analysisService";
import { useNewsStore } from "./features/news-analysis/stores/useNewsStore";
import { cssVariables } from "./styles/variables.css";

export default function App() {
	const [showFilters, setShowFilters] = useState(true);
	const [loading, setLoading] = useState(false);
	const [initialLoading, setInitialLoading] = useState(true);
	const [loadingProgress, setLoadingProgress] = useState([]);

	const {
		darkMode,
		setCategories,
		setCompetencias,
		selectedCompetencias,
		selectedCategories,
		results,
		setResults,
		lockFilters,
		getCachedData,
		setCachedData,
	} = useNewsStore();

	// Inicializar tema
	useEffect(() => {
		document.body.setAttribute("data-theme", darkMode ? "dark" : "light");
	}, [darkMode]);

	// Cargar datos iniciales
	useEffect(() => {
		loadInitialData();
	}, []);

	const loadInitialData = async () => {
		try {
			const data = await analysisService.loadInitialData();
			setCategories(data.categories);
			setCompetencias(data.competencias);
			setInitialLoading(false);
		} catch (error) {
			console.error("Error loading initial data:", error);
			setInitialLoading(false);
		}
	};

	const handleSearch = async () => {
		if (selectedCompetencias.length === 0 || selectedCategories.length === 0) {
			alert("Selecciona al menos una competencia y una categoría");
			return;
		}

		setLoading(true);
		setLoadingProgress([]);
		lockFilters();
		setShowFilters(false);

		const newResults = {};

		for (const competencia of selectedCompetencias) {
			setLoadingProgress((prev) => [
				...prev,
				{
					nombre: competencia.nombre,
					status: "cargando",
				},
			]);

			const cacheKey = `${competencia.id}-${selectedCategories.join(",")}`;
			const cached = getCachedData(cacheKey);

			if (cached) {
				newResults[competencia.id] = cached;
				setLoadingProgress((prev) =>
					prev.map((item) =>
						item.nombre === competencia.nombre
							? { ...item, status: "completado (cache)" }
							: item,
					),
				);
				continue;
			}

			try {
				const data = await analysisService.analyzeCompetitor(
					competencia,
					selectedCategories,
				);
				newResults[competencia.id] = data;
				setCachedData(cacheKey, data);

				setLoadingProgress((prev) =>
					prev.map((item) =>
						item.nombre === competencia.nombre
							? { ...item, status: "completado" }
							: item,
					),
				);
			} catch (error) {
				console.error(`Error analyzing ${competencia.nombre}:`, error);
				setLoadingProgress((prev) =>
					prev.map((item) =>
						item.nombre === competencia.nombre
							? { ...item, status: "error" }
							: item,
					),
				);
			}
		}

		setResults(newResults);
		setLoading(false);
	};

	if (initialLoading) {
		return (
			<>
				<style>{cssVariables}</style>
				<div
					style={{
						height: "100vh",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: 20,
					}}
				>
					<Spinner />
					<p style={{ color: "var(--text-secondary)", fontWeight: 500 }}>
						Cargando LN Track by Andru ...
					</p>
				</div>
			</>
		);
	}

	return (
		<>
			<style>{cssVariables}</style>
			<div style={{ minHeight: "100vh" }}>
				<Header />

				<main className="container">
					<FilterPanel
						showFilters={showFilters}
						setShowFilters={setShowFilters}
						onSearch={handleSearch}
						loading={loading}
					/>

					{loading && (
						<GlassPanel style={{ padding: 20 }}>
							<h3
								style={{
									fontSize: "1.1rem",
									marginBottom: 16,
									fontWeight: 500,
								}}
							>
								Analizando competencias...
							</h3>
							<div
								style={{ display: "flex", flexDirection: "column", gap: 12 }}
							>
								{loadingProgress.map((item, idx) => (
									<div
										key={idx}
										style={{
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											borderBottom: "1px solid var(--border)",
											paddingBottom: 8,
										}}
									>
										<span style={{ fontWeight: 500 }}>{item.nombre}</span>
										<div
											style={{
												display: "flex",
												alignItems: "center",
												gap: 8,
												fontSize: "0.9rem",
											}}
										>
											{item.status === "cargando" && (
												<span style={{ color: "var(--text-secondary)" }}>
													Cargando...
												</span>
											)}
											{item.status === "completado" && (
												<span style={{ color: "var(--color-success)" }}>
													✓ Completado
												</span>
											)}
											{item.status === "completado (cache)" && (
												<span style={{ color: "var(--primary)" }}>
													⚡ Cache
												</span>
											)}
											{item.status === "error" && (
												<span style={{ color: "var(--color-warning)" }}>
													✗ Error
												</span>
											)}
										</div>
									</div>
								))}
							</div>
						</GlassPanel>
					)}

					{!loading && Object.keys(results).length === 0 && (
						<div
							style={{
								textAlign: "center",
								padding: "60px 20px",
								color: "var(--text-secondary)",
							}}
						>
							<p style={{ fontSize: "1.1rem" }}>
								Selecciona competencias y categorías para comenzar el análisis
							</p>
						</div>
					)}

					{!loading &&
						Object.entries(results).map(([competenciaId, data]) => (
							<CompetitorResultCard
								key={competenciaId}
								data={data}
								categories={selectedCategories}
							/>
						))}
				</main>
			</div>
		</>
	);
}
