// packages/react-reconciler/src/commitWork.ts
import { Container, appendChildToContainer } from 'hostConfig';
import { FiberNode, FiberRootNode } from './fiber';
import {
	ChildDeletion,
	MutationMask,
	NoFlags,
	Placement,
	Update
} from './fiberFlags';
import { HostComponent, HostRoot, HostText } from './workTags';

let nextEffect: FiberNode | null = null;

export const commitMutationEffects = (finishedWork: FiberNode) => {
	nextEffect = finishedWork;

	// 深度优先遍历 Fiber 树，寻找更新 flags
	while (nextEffect !== null) {
		// 向下遍历
		const child: FiberNode | null = nextEffect.child;
		if (
			(nextEffect.subtreeFlags & MutationMask) !== NoFlags &&
			child !== null
		) {
			// 子节点存在 mutation 阶段需要执行的 flags
			console.log(child, '子节点存在 mutation 阶段需要执行的 flags');
			nextEffect = child;
		} else {
			// 子节点不存在 mutation 阶段需要执行的 flags 或没有子节点
			// 向上遍历
			up: while (nextEffect !== null) {
				// 处理 flags
				commitMutationEffectsOnFiber(nextEffect);

				const sibling: FiberNode | null = nextEffect.sibling;
				// 遍历兄弟节点
				if (sibling !== null) {
					nextEffect = sibling;
					break up;
				}
				// 遍历父节点
				nextEffect = nextEffect.return;
			}
		}
	}
};

const commitMutationEffectsOnFiber = (finishedWork: FiberNode) => {
	const flags = finishedWork.flags;

	// 判断是否存在对应操作,存在执行对应操作并清除标志位

	if ((flags & Placement) !== NoFlags) {
		commitPlacement(finishedWork);
		finishedWork.flags &= ~Placement;
	}
	if ((flags & Update) !== NoFlags) {
		// TODO Update
		finishedWork.flags &= ~Update;
	}
	if ((flags & ChildDeletion) !== NoFlags) {
		// TODO ChildDeletion
		finishedWork.flags &= ~ChildDeletion;
	}
};

// 执行 DOM 插入操作，将 FiberNode 对应的 DOM 插入 parent DOM 中
const commitPlacement = (finishedWork: FiberNode) => {
	if (__DEV__) {
		console.log('执行 Placement 操作', finishedWork);
	}
	console.log(finishedWork, 'finishedWork——插入节点');

	const hostParent = getHostParent(finishedWork);
	if (hostParent !== null) {
		appendPlacementNodeIntoContainer(finishedWork, hostParent);
	}
};

// 获取 parent DOM
const getHostParent = (fiber: FiberNode): Container | null => {
	let parent = fiber.return;
	while (parent !== null) {
		const parentTag = parent.tag;
		// 处理 Root 节点
		if (parentTag === HostRoot) {
			return (parent.stateNode as FiberRootNode).container;
		}
		// 处理原生 DOM 元素节点
		if (parentTag === HostComponent) {
			return parent.stateNode as Container;
		} else {
			parent = parent.return;
		}
	}
	if (__DEV__) {
		console.warn('未找到 host parent', fiber);
	}
	return null;
};

const appendPlacementNodeIntoContainer = (
	finishedWork: FiberNode,
	hostParent: Container
) => {
	if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
		// 如果当前 Fiber 是原生节点或文本节点，直接插入 DOM
		appendChildToContainer(finishedWork.stateNode, hostParent);
	} else {
		const child = finishedWork.child;
		if (child !== null) {
			appendPlacementNodeIntoContainer(child, hostParent);
			let sibling = child.sibling;
			while (sibling !== null) {
				appendPlacementNodeIntoContainer(sibling, hostParent);
				sibling = sibling.sibling;
			}
		}
	}
};
