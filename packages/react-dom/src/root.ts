import { Container } from 'hostConfig';
import {
	createContainer,
	updateContainer
} from 'react-reconciler/src/fiberReconciler';
import { ReactElementType } from 'shared/ReactTypes';

// container -> domcument.getElement:Element
// root -> jsx -> ReactElement:ReactElementTypre
export function createRoot(container: Container) {
	// 构建 FiberRootNode
	const root = createContainer(container);

	return {
		render(element: ReactElementType) {
			updateContainer(element, root);
		}
	};
}
