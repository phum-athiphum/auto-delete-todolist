export interface Item {
    name: string,
    type: string
    returned?: boolean;
}

export type ListType = "fruit" | "vegetable";