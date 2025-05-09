export type WorkTag =
	| typeof FunctionComponent
	| typeof HostRoot
	| typeof HostComponent
	| typeof HostText;

export const FunctionComponent = 0; // 函数组件
export const HostRoot = 3; // 根节点（ReactDOM.createRoot）
export const HostComponent = 5; // 原生 DOM 元素，如 div、span
export const HostText = 6; // 文本节点，如 "hello"
