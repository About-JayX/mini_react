import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import replace from '@rollup/plugin-replace';
import { resolvePkgPath } from '../rollup/utils';
import path from 'path';

const modulePath = path.resolve(__dirname, '../../node_modules');
console.log(modulePath, '??');

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), replace({ __DEV__: true, preventAssignment: true })],

	resolve: {
		alias: [
			{
				find: 'react',
				replacement: resolvePkgPath('react')
			},
			{
				find: 'react-dom',
				replacement: `${modulePath}/react-dom`
			},
			{
				find: 'hostConfig',
				replacement: path.resolve(
					`${modulePath}/react-dom`,
					'./src/hostConfig.ts'
				)
			}
		]
	}
});
