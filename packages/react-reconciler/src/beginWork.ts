import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { processUpdateQueue, UpdateQueue } from './updateQueue';
import {
	FunctionComponent,
	HostComponent,
	HostRoot,
	HostText
} from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childFiber';
import { renderWithHooks } from './fiberHooks';
export const beginWork = (workInProgress: FiberNode) => {
	switch (workInProgress.tag) {
		case HostRoot:
			return updateHostRoot(workInProgress);
		case HostComponent:
			return updateHostComponent(workInProgress);
		case FunctionComponent:
			return updateFunctionComponent(workInProgress);
		case HostText:
			return updateHostText();
		default: {
			if (__DEV__) {
				console.warn('未实现类型', workInProgress, workInProgress.tag);
			}
			break;
		}
	}
};
function updateFunctionComponent(workInProgress: FiberNode) {
	const nextChildren = renderWithHooks(workInProgress);
	reconcileChildren(workInProgress, nextChildren);
	return workInProgress.child;
}
// const renderWithHooks = (workInProgress: FiberNode) => {
// 	// 函数保存在type字段中
// 	const Component = workInProgress.type;
// 	const props = workInProgress.pendingProps;
// 	const children = Component(props);
// 	return children;
// };
const updateHostRoot = (workInProgress: FiberNode) => {
	const baseState = workInProgress.memoizedState;

	const updateQueue = workInProgress.updateQueue as UpdateQueue<Element>;
	// 首屏加载时 pending 为element_
	const peding = updateQueue.shared.pending;

	updateQueue.shared.pending = null;

	const { memoizedState } = processUpdateQueue(baseState, peding);

	workInProgress.memoizedState = memoizedState;
	// 处理子节点更新逻辑

	const nextChildren = workInProgress.memoizedState;

	// 首次加载处理root_ 更新子节点
	reconcileChildren(workInProgress, nextChildren);

	return workInProgress.child;
};
function updateHostComponent(workInProgress: FiberNode) {
	const nextProps = workInProgress.pendingProps;

	const nextChildren = nextProps.children;
	reconcileChildren(workInProgress, nextChildren);
	return workInProgress.child;
}

function updateHostText() {
	// 没有子节点，直接返回 null
	return null;
}

const reconcileChildren = (
	workInProgress: FiberNode,
	children?: ReactElementType
) => {
	const current = workInProgress.alternate;
	if (current !== null) {
		// 处理首次挂载和节点复用
		workInProgress.child = reconcileChildFibers(
			workInProgress,
			current?.child,
			children
		);
	} else {
		//mountChildFibers首次挂载子组件
		workInProgress.child = mountChildFibers(workInProgress, null, children);
	}
};
