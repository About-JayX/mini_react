// packages/react/src/jsx.ts
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import {
	Type,
	Ref,
	Key,
	Props,
	ReactElementType,
	ElementType
} from 'shared/ReactTypes';

const ReactElement = function (
	type: Type,
	key: Key,
	ref: Ref,
	props: Props
): ReactElementType {
	const element = {
		$$typeof: REACT_ELEMENT_TYPE,
		type,
		key,
		ref,
		props,
		__mark: '_Jay'
	};
	return element;
};

export const jsx = (type: ElementType, config: any, ...children: any) => {
	let key: Key = null;
	let ref: Ref = null;
	const props: Props = {};
	console.log(children, 'children_');

	for (const prop in config) {
		const val = config[prop];
		if (prop === 'key' || prop === 'ref') {
			val !== undefined && (prop === 'key' ? (key = '' + val) : (ref = val));
			continue;
		}
		// 安全调用
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}

		const childrenLength = children.length;
		if (childrenLength) {
			if (children.length === 1) {
				props.children = children[0];
			} else {
				props.children = children;
			}
		}
	}
	return ReactElement(type, key, ref, props);
};
export const jsxDEV = (type: ElementType, config: any) => {
	let key: Key = null;
	let ref: Ref = null;

	console.log(config, '??');

	const props: Props = {};
	for (const prop in config) {
		const val = config[prop];
		if (prop === 'key') {
			if (val !== undefined) {
				key = '' + val;
			}
			continue;
		}
		if (prop === 'ref') {
			if (val !== undefined) {
				ref = val;
			}
			continue;
		}
		if ({}.hasOwnProperty.call(config, prop)) {
			props[prop] = val;
		}
	}
	return ReactElement(type, key, ref, props);
};
