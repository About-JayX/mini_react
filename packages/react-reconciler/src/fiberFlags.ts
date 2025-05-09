export type Flags = number;

export const NoFlags = 0b0000000; // 没有副作用
export const PerformedWork = 0b0000001; // 做过工作
export const Placement = 0b0000010; // 插入操作
export const Update = 0b0000100; // 属性或内容更新
export const ChildDeletion = 0b0001000; // 删除子节点
