import { ReactElementType } from 'shared/ReactTypes';
import { createFiberFromElement, FiberNode } from './fiber';
import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols';
import { Placement } from './fiberFlags';
import { HostText } from './workTags';

function ChildReconciler(shouldTrackSideEffects: boolean) {
	// 为 Fiber 节点添加更新 flags
	function placeSingleChild(fiber: FiberNode) {
		// 首屏渲染且追踪副作用时，才添加更新 flags
		if (shouldTrackSideEffects && fiber.alternate == null) {
			fiber.flags |= Placement;
		}
		return fiber;
	}
	// 处理父子关系,并返回chind的fiber
	function reconcileSingleElement(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		element: ReactElementType
	) {
		if (currentFiber !== null) {
			console.log(currentFiber, 'currentFiber');
		}
		// reactElement构建fiber. 处理pendingProps状态
		const fiber = createFiberFromElement(element);
		fiber.return = returnFiber;
		return fiber;
	}
	// 处理文本节点
	function reconcileSingleTextNode(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		content: string | number
	) {
		const fiber = new FiberNode(HostText, { content }, null);
		fiber.return = returnFiber;
		return fiber;
	}
	// 闭包
	return function reconcileChildFibers(
		returnFiber: FiberNode,
		currentFiber: FiberNode | null,
		newChild?: ReactElementType
	) {
		if (typeof newChild == 'object' && newChild !== null) {
			switch (newChild?.$$typeof) {
				case REACT_ELEMENT_TYPE:
					return placeSingleChild(
						reconcileSingleElement(returnFiber, currentFiber, newChild)
					);

				default:
					if (__DEV__) {
						console.warn('未实现的reconcile', newChild);
					}
					break;
			}
		}

		// 多个 Element 节点
		if (Array.isArray(newChild)) {
			// TODO: 暂时不处理
			if (__DEV__) {
				console.warn('未实现的 reconcile 类型', newChild);
			}
		}

		// 文本节点
		if (typeof newChild == 'string' || typeof newChild == 'number') {
			return placeSingleChild(
				reconcileSingleTextNode(returnFiber, currentFiber, newChild)
			);
		}

		if (__DEV__) {
			console.warn('未实现的 reconcile 类型', newChild);
		}
		return null;
	};
}

export const reconcileChildFibers = ChildReconciler(true);

export const mountChildFibers = ChildReconciler(false);
