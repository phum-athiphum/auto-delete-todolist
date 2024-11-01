import { create } from "zustand";
import { Item, ListType } from "../types/item";

export interface ItemStoreState {
  mainList: Item[];
  fruit: Item[];
  vegetable: Item[];
  moveItem: (item: Item) => void;
  returnItem: (item: Item, manualReturn?: boolean) => void;
}

// สร้าง store มี array ที่เก็บ main list และ มี array อีก 2 อันสําหรับแยก type ตัว fruit กับ vegetable
const useItemStore = create<ItemStoreState>((set) => ({
  mainList: [
    {
      type: "Fruit",
      name: "Apple",
    },
    {
      type: "Vegetable",
      name: "Broccoli",
    },
    {
      type: "Vegetable",
      name: "Mushroom",
    },
    {
      type: "Fruit",
      name: "Banana",
    },
    {
      type: "Vegetable",
      name: "Tomato",
    },
    {
      type: "Fruit",
      name: "Orange",
    },
    {
      type: "Fruit",
      name: "Mango",
    },
    {
      type: "Fruit",
      name: "Pineapple",
    },
    {
      type: "Vegetable",
      name: "Cucumber",
    },
    {
      type: "Fruit",
      name: "Watermelon",
    },
    {
      type: "Vegetable",
      name: "Carrot",
    },
  ],
  fruit: [],
  vegetable: [],

  moveItem: (item: Item) =>
    set((state) => {
      //filter ตัว main list ให้เหลือเฉพาะ ตัวที่ไม่ถูก move
      const newMainList = state.mainList.filter((i) => i.name !== item.name);
      const updatedListType: ListType = item.type.toLowerCase() as ListType;
      return {
        mainList: newMainList,
        [updatedListType]: [...state[updatedListType], { ...item }],
      };
    }),

  returnItem: (item: Item) =>
    set((state) => {
      const updatedListType: ListType = item.type.toLowerCase() as ListType;
      const newList = state[updatedListType].filter(
        (i) => i.name !== item.name
      );

      // ตรวจสอบว่ามีไอเทมใน mainList อยู่แล้วหรือไม่
      const itemExistsInMainList = state.mainList.some(
        (i) => i.name === item.name
      );

      if (!itemExistsInMainList) {
        return {
          mainList: [...state.mainList, item],
          [updatedListType]: newList,
        };
      } else {
        return {
          [updatedListType]: newList,
        };
      }
    }),
}));

export default useItemStore;
