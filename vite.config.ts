import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	test: {
		include: ['tests/**/*.{test,spec}.{js,ts}'],
		exclude: ['tests/e2e/**/*'], // Just exclude E2E tests or else stuff bricks
	}
});
