import path from 'path';
import fs from 'fs';
import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
const pkgPath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

export const resolvePkgPath = (pkgName, isDist) => {
	if (isDist) {
		return `${distPath}/${pkgName}`;
	}
	return `${pkgPath}/${pkgName}`;
};
export function getPackageJSON(pkgName) {
	console.log(pkgName, 'pkgName_');

	const path = `${resolvePkgPath(pkgName)}/package.json`;
	console.log(path, 'path_');

	const str = fs.readFileSync(path, { encoding: 'utf-8' });
	console.log(str, '??');

	return JSON.parse(str);
}
export function getBaseRollupPlugins({
	alias = { __Dev__: true },
	typescript = {}
} = {}) {
	return [replace(alias), ts(), cjs(typescript)];
}
