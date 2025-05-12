import { beginWork } from './beginWork';
import { commitMutationEffects } from './commitWork';
import { completeWork } from './completeWork';
import { createWorkInProgress, FiberNode, FiberRootNode } from './fiber';
import { MutationMask, NoFlags } from './fiberFlags';
import { HostRoot } from './workTags';

let workInProgress: FiberNode | null = null;
// 渲染函数
function renderRoot(root: FiberRootNode) {
	//  工作节点__renderRoot从根节点进入更新状态
	prepareFreshStack(root);
	try {
		workLoop();
	} catch (error) {
		console.warn('workLoop发生错误：', error);
		workInProgress = null;
	}
	// 创建根 Fiber 树的 Root Fiber
	const finishedWork = root.current.alternate;
	root.finishedWork = finishedWork;
	commitRoot(root);
}

function commitRoot(root: FiberRootNode) {
	const finishedWork = root.finishedWork;
	if (finishedWork === null) {
		return;
	}
	if (__DEV__) console.log('commit阶段开始');
	root.finishedWork = null;

	// 判断是否存在执行的状态
	const subtreeHasEffects =
		(finishedWork.subtreeFlags & MutationMask) != NoFlags;
	const rootHasEffects = (finishedWork.flags & MutationMask) != NoFlags;

	if (subtreeHasEffects || rootHasEffects) {
		// TODO: BeforeMutation
		// Mutation
		commitMutationEffects(finishedWork);
		// Fiber 树切换，workInProgress 变成 current
		root.current = finishedWork;

		// TODO: Layout
	} else {
		root.current = finishedWork;
	}
}
function prepareFreshStack(root: FiberRootNode) {
	workInProgress = createWorkInProgress(root.current, {});
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}
// 遍历节点
function performUnitOfWork(fiber: FiberNode) {
	// 从每个节点开始遍历 查找是否存在子节点
	const next = beginWork(fiber);

	//  处理属性更新情况
	fiber.memoizedProps = fiber.pendingProps;

	// next存在则存在子节点
	if (next == null) {
		// 遍历兄弟节点 sibling
		completeUnitOfWork(fiber);
	} else {
		workInProgress = next;
	}
}

function completeUnitOfWork(fiber: FiberNode) {
	let node: FiberNode | null = fiber;
	do {
		// 生成更新计划  函数在向上遍历阶段执行
		completeWork(node);
		const sibling = node.sibling;
		if (sibling !== null) {
			workInProgress = sibling;
		}
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}

// 调度功能
export function scheduleUpdateOnFiber(fiber: FiberNode) {
	// 先遍历找到根节点
	const root = markUpdateFromFiberToRoot(fiber);
	// 根节点开始往下遍历
	renderRoot(root);
}

// 从触发更新的节点向上遍历到 FiberRootNode
function markUpdateFromFiberToRoot(fiber: FiberNode) {
	let node = fiber;

	while (node.return !== null) {
		node = node.return;
	}
	if (node.tag == HostRoot) {
		return node.stateNode;
	}
	return null;
}
