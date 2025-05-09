import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { processUpdateQueue, UpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childFiber';
export const beginWork = (workInProgress: FiberNode) => {
	switch (workInProgress.tag) {
		case HostRoot:
			return updateHostRoot(workInProgress);
		case HostComponent:
			return updateHostComponent(workInProgress);
		case HostText:
			return updateHostText();
		default: {
			if (__DEV__) {
				console.warn('未实现类型', workInProgress.tag);
			}
			break;
		}
	}
};
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
const updateHostComponent = (workInProgress: FiberNode) => {};

function updateHostText() {
	// 没有子节点，直接返回 null
	return null;
}

const reconcileChildren = (
	workInProgress: FiberNode,
	children?: ReactElementType
) => {
	const current = workInProgress.alternate;
	// 处理首次挂载和节点复用
	if (current !== null) {
		workInProgress.child = reconcileChildFibers(
			workInProgress,
			current?.child,
			children
		);
	} else {
		workInProgress.child = mountChildFibers(workInProgress, null, children);
	}
};
