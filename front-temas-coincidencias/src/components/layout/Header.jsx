import { Layers, Moon, Sun } from "lucide-react";
import React from "react";
import { useNewsStore } from "../../features/news-analysis/stores/useNewsStore";
import { Button } from "../ui/Button";
import { LaNacionLogo } from "../ui/LaNacionLogo";

export const Header = () => {
	const { darkMode, toggleDarkMode } = useNewsStore();

	return (
		<header
			style={{
				position: "sticky",
				top: 0,
				zIndex: 50,
				background: "var(--bg-surface)",
				backdropFilter: "blur(10px)",
				borderBottom: "1px solid var(--border)",
				padding: "16px 0",
			}}
		>
			<div
				className="container"
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<div style={{ display: "flex", alignItems: "center", gap: 12 }}>
					<div
						style={{
							background: "var(--primary)",
							padding: 6,
							borderRadius: 8,
							color: "white",
						}}
					>

						<LaNacionLogo width={120} height={40} />

					</div>
					<h1 style={{ fontSize: "1.25rem", fontWeight: 500 }}>Ln Track</h1>
				</div>
				<Button variant="icon" onClick={toggleDarkMode}>
					{darkMode ? <Sun size={20} /> : <Moon size={20} />}
				</Button>
			</div>
		</header>
	);
};
