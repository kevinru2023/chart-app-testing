import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	test: {
		environment: 'jsdom',//also making it use browers not SSR
		include: ['tests/**/*.{test,spec}.{js,ts}'],
		exclude: ['tests/e2e/**/*'], // Just exclude E2E tests or else stuff bricks
	},
	resolve: {
		conditions: ['browser']//ensuring browser not SSR for tests
	}
});
