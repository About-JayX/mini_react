import {
	appendInitialChild,
	Container,
	createInstance,
	createTextInstance,
	Instance
} from 'hostConfig';
import { FiberNode } from './fiber';
import {
	FunctionComponent,
	HostComponent,
	HostRoot,
	HostText
} from './workTags';
import { NoFlags } from './fiberFlags';

export const completeWork = (workInProgress: FiberNode) => {
	// 处理props
	const newProps = workInProgress.pendingProps;
	const current = workInProgress.alternate;

	switch (workInProgress.tag) {
		case HostRoot:
			bubbleProperties(workInProgress);
			return null;

		case HostComponent: {
			if (current !== null && workInProgress.stateNode !== null) {
				// 更新阶段
			} else {
				// 首次加载阶段
				const instance = createInstance(workInProgress.type, newProps);
				appendAllChildren(instance, workInProgress);
				workInProgress.stateNode = instance;
			}
			bubbleProperties(workInProgress);
			return null;
		}
		case HostText:
			if (current !== null && workInProgress.stateNode !== null) {
				// TODO: 组件的更新阶段
			} else {
				// 首屏渲染阶段
				// 构建 DOM
				const instance = createTextInstance(newProps.content);
				workInProgress.stateNode = instance;
			}
			// 收集更新 flags
			bubbleProperties(workInProgress);
			return null;
		case FunctionComponent:
			bubbleProperties(workInProgress);
			return null;
		default:
			if (__DEV__) {
				console.warn('completeWork 未实现的类型', workInProgress);
			}
			return null;
	}
};

function appendAllChildren(
	parent: Container | Instance,
	workInProgress: FiberNode
) {
	let node = workInProgress.child;
	while (node !== null) {
		if (node.tag == HostComponent || node.tag == HostText) {
			// 处理原生 DOM 元素节点或文本节点
			appendInitialChild(parent, node.stateNode);
		} else if (node.child !== null) {
			// 递归处理其他类型的组件节点的子节点
			node.child.return = node;
			node = node.child;
			continue;
		}
		if (node == workInProgress) {
			return;
		}

		while (node.sibling === null) {
			if (node.return === null || node.return === workInProgress) {
				return;
			}
			node = node.return;
		}
		// 处理下一个兄弟节点
		node.sibling.return = node.return;
		node = node.sibling;
	}
}
// 收集更新 flags，将子 FiberNode 的 flags 冒泡到父 FiberNode 上
function bubbleProperties(workInProgress: FiberNode) {
	let subtreeFlags = NoFlags;
	let child = workInProgress.child;
	while (child !== null) {
		subtreeFlags |= child.subtreeFlags;
		subtreeFlags |= child.flags;
		child.return = workInProgress;
		child = child.sibling;
	}

	workInProgress.subtreeFlags |= subtreeFlags;
	console.log((workInProgress.subtreeFlags |= subtreeFlags), '???');
}
