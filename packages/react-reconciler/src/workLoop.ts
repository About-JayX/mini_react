import { FiberNode } from './fiber';

let workInProgress: FiberNode | null = null;
// 渲染函数
function renderRoot(root: FiberNode) {
	//  查找跟节点
	prepareFreshStack(root);

	try {
		workLoop();
	} catch (error) {
		console.warn('workLoop发生错误：', error);
		workInProgress = null;
	}
}

function prepareFreshStack(root: FiberNode) {
	workInProgress = root;
}

function workLoop() {
	while (workInProgress !== null) {
		performUnitOfWork(workInProgress);
	}
}
// 遍历节点
function performUnitOfWork(fiber: FiberNode) {
	// 从每个节点开始遍历
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
		// 生成更新计划
		completeWork(node);
		const sibling = node.sibling;
		if (sibling !== null) {
			workInProgress = sibling;
		}
		node = node.return;
		workInProgress = node;
	} while (node !== null);
}
