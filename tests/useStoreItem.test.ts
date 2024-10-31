import { create } from "zustand";
import { ItemStoreState } from "@/app/stores/useItemStore";
import { Item } from "@/app/types/item";
import { ListType } from "@/app/types/item";

// ทํา store ขึ้นมาสําหรับเทสที่ทําแยกเผื่อเราต้องการ mock test data ที่แตกต่างกัน
const createTestStore = () =>
  create<ItemStoreState>((set) => ({
    mainList: [
      { type: "Fruit", name: "Apple" },
      { type: "Vegetable", name: "Broccoli" },
      { type: "Vegetable", name: "Mushroom" },
      { type: "Fruit", name: "Banana" },
      { type: "Vegetable", name: "Tomato" },
      { type: "Fruit", name: "Orange" },
      { type: "Fruit", name: "Mango" },
      { type: "Fruit", name: "Pineapple" },
      { type: "Vegetable", name: "Cucumber" },
      { type: "Fruit", name: "Watermelon" },
      { type: "Vegetable", name: "Carrot" },
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

describe("Item Store", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });


//   เทส case กรณี เรา move จาก main list ไป fruit list
  it("should move an item from mainList to Fruit List", () => {
    const item = { type: "Fruit", name: "Apple" };

    // เรียก moveItem
    store.getState().moveItem(item);

    // get ตัวที่ update มา
    const updatedState = store.getState();

    // เช๊คว่าใน fruit list ต้องมี item ที่ถูก move แล้ว item ต้องหายไปจาก main list ด้วยครับ
    expect(updatedState.fruit).toContainEqual(item);
    expect(updatedState.mainList).not.toContainEqual(item);
  });
  
  //   เทส case กรณี เรา move จาก main list ไป vegetable list
  it("should move an item from mainList to Vegetable List", () => {
    const item = { type: "Vegetable", name: "Tomato" };

    // เรียก moveItem
    store.getState().moveItem(item);

    // get ตัวที่ update มา
    const updatedState = store.getState();

    // เช๊คว่าใน vegetable list ต้องมี item ที่ถูก move แล้ว item ต้องหายไปจาก main list ด้วยครับ
    expect(updatedState.vegetable).toContainEqual(item);
    expect(updatedState.mainList).not.toContainEqual(item);
  });

  it("should return an item from fruit back to main list", () => {
    
    // move fruit จาก main list ไปที่ fruit list ก่อน
    const item = { type: "Fruit", name: "Apple" };
    store.getState().moveItem(item);
  
    // เช๊คว่าที่ fruit list มี item ที่ move ไปไหม
    let updatedState = store.getState();
    expect(updatedState.fruit).toContainEqual(item);
    expect(updatedState.mainList).not.toContainEqual(item);
  
    // return item กลับ
    store.getState().returnItem(item);
  
    updatedState = store.getState();
  
    // เช็คว่า main list มี item ที่ return กลับไปไหม
    expect(updatedState.mainList).toContainEqual(item);
    expect(updatedState.fruit).not.toContainEqual(item);
  });


  it("should return an item from vegetable back to main list", () => {
    
    // move item จาก main list ไปที่ vegetable list ก่อน
    const item = { type: "Vegetable", name: "Tomato" };
    store.getState().moveItem(item);
  
    // เช๊คว่าที่ fruit list มี item ที่ move ไปไหม
    let updatedState = store.getState();
    expect(updatedState.vegetable).toContainEqual(item);
    expect(updatedState.mainList).not.toContainEqual(item);
  
    // return item กลับ
    store.getState().returnItem(item);
  
    updatedState = store.getState();
  
    // เช็คว่า main list มี item ที่ return กลับไปไหม และ ที่ vegetable ต้องไม่มี item
    expect(updatedState.mainList).toContainEqual(item);
    expect(updatedState.vegetable).not.toContainEqual(item);
  });

  it("should not add duplicate items in mainList when returning an item already present", () => {
    // เริ่มต้นด้วยการย้าย item จาก main list ไปที่ fruit list ก่อน
    const item = { type: "Fruit", name: "Apple" };
    store.getState().moveItem(item);
  
    // เช็คว่า fruit list มี item ที่ move ไป และ main list ไม่มี item
    let updatedState = store.getState();
    expect(updatedState.fruit).toContainEqual(item);
    expect(updatedState.mainList).not.toContainEqual(item);
  
    // เรียก returnItem เพื่อย้าย item กลับไปที่ main list
    store.getState().returnItem(item);
  
    // เช็คว่า main list มี item ที่ return กลับไป และ fruit list ไม่มี item นั้นแล้ว
    updatedState = store.getState();
    expect(updatedState.mainList).toContainEqual(item);
    expect(updatedState.fruit).not.toContainEqual(item);
  
    // เรียก returnItem ซ้ำกับ item เดิมอีกครั้ง
    store.getState().returnItem(item);
  
    // ตรวจสอบว่า main list ไม่มี item ซ้ำกัน
    updatedState = store.getState();
    const itemCountInMainList = updatedState.mainList.filter(i => i.name === item.name).length;
    expect(itemCountInMainList).toBe(1);
  });



});
