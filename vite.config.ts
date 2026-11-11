import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';

const base = '/shopping-list/';

export default defineConfig({
	base,
	plugins: [
		react(),
		tailwindcss(),

		VitePWA({
			registerType: 'autoUpdate',

			includeAssets: ['favicon.ico', 'apple-touch-icon.png'],

			manifest: {
				name: 'Список покупок',
				short_name: 'Покупки',
				description: 'Простой список покупок',

				theme_color: '#111214',
				background_color: '#111214',

				display: 'standalone',
				orientation: 'portrait',

				start_url: base,
				scope: base,

				icons: [
					{
						src: 'icon-192x192.png',
						sizes: '192x192',
						type: 'image/png',
					},
					{
						src: 'icon-512x512.png',
						sizes: '512x512',
						type: 'image/png',
					},
					{
						src: 'icon-192x192-maskable.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'maskable',
					},
					{
						src: 'icon-512x512-maskable.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'maskable',
					},
				],
			},

			workbox: {
				globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
			},
		}),
	],
});
