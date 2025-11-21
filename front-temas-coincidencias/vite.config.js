import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler"]],
			},
		}),
	],
	base: "/",
	server: {
		port: process.env.PORT || 8080,
		host: '0.0.0.0'
	},
	build: {
		sourcemap: false,
		minify: 'terser',
		terserOptions: {
			compress: {
				passes: 2,
			},
			mangle: true,
			format: {
				beautify: false,
				comments: false,
			},
		}
	}
});
