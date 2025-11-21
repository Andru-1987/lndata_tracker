export const analysisService = {
	async loadInitialData() {
		try {
			const response = await fetch('/categorias-competencias');

			if (!response.ok) {
				throw new Error(`Error al cargar configuración: ${response.statusText}`);
			}

			return await response.json()
		} catch (error) {
			// este es el falback con datos mock en caso de error
			await new Promise((resolve) => setTimeout(resolve, 2000));

			return {
				categories: [
					"economia",
					"tecnologia",
					"deportes",
					"politica",
					"entretenimiento",
				],
				competencias: [
					{ id: 1, nombre: "Infobae" },
					{ id: 2, nombre: "La Nación" },
					{ id: 3, nombre: "Clarín" },
					{ id: 4, nombre: "Ámbito" },
					{ id: 5, nombre: "Cronista" },
				],
			};
		}
	},

	async analyzeCompetitor(competencia, categories) {
		await new Promise((resolve) => setTimeout(resolve, 1500));

		const mockCategories = {};

		categories.forEach((cat) => {
			mockCategories[cat] = {
				etiquetas_cubiertas: [
					"#DolarArgentina",
					"#TasasInteres",
					"#CriptomonedasARG",
				],
				etiquetas_no_cubiertas: [
					"#SalarioMinimoColombia",
					"#BolsaValoresColombia",
					"#NeobancosRegionales",
				],
				etiquetas_coincidentes: ["#MercadoFinanciero", "#InversionesLatam"],
				coincidencias: Math.floor(Math.random() * 10) + 3,
				temas_unicos: Array.from({ length: 8 }, (_, i) => ({
					titulo: `${competencia.nombre} cubre: Noticia exclusiva ${i + 1} sobre ${cat}`,
					etiquetas: ["#IndustriaColombia", "#MercadoLatam"],
					relevancia: ["alta", "media", "baja"][Math.floor(Math.random() * 3)],
					por_que_brecha:
						"Esta noticia no está en nuestro medio porque nos enfocamos más en el mercado argentino",
					oportunidad:
						"Podríamos expandir nuestra cobertura a mercados regionales",
				})),
				recomendaciones: [
					`Aumentar cobertura de ${cat} regional`,
					"Considerar alianzas con medios de Colombia",
					"Expandir equipo de periodistas especializados",
				],
			};
		});

		return {
			competencia_nombre: competencia.nombre,
			categories: mockCategories,
		};
	},
};
