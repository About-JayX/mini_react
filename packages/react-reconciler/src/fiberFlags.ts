export type Flags = number;

export const NoFlags = 0b0000000;
export const HasEffect = 0b0000001; //表示该节点有副作用
export const Placement = 0b0000010; //需要将该 Fiber 节点插入（挂载）到 DOM 中
export const Update = 0b0000100; //该 Fiber 节点需要更新 DOM
export const ChildDeletion = 0b0001000; //表示需要删除某些子节点

export const MutationMask = Placement | Update | ChildDeletion;
