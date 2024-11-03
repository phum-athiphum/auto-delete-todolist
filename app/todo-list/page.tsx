"use client";

import React from "react";
import useItemStore from "@/app/stores/useItemStore";
import { Item, ListType } from "@/app/types/item";

function TodoListPage() {
  const { mainList, fruit, vegetable, moveItem, returnItem } = useItemStore();

  const handleMoveItem = (item: Item) => {
    moveItem(item);

    // ในเคสของการที่ทีการรอ 5 วินาทีแล้วคืนของกลับ
    setTimeout(() => {
      const { fruit, vegetable } = useItemStore.getState();
      const itemJustAdd = fruit
        .concat(vegetable)
        .find((i) => {
          return i.name === item.name;
        });
      if (itemJustAdd) {
        returnItem(item);
      }
    }, 5000);
  };

  // Function to return the latest item in the column
  const handleReturnLatestInColumn = (itemType: ListType) => {
    const items = itemType === "fruit" ? fruit : vegetable;

    if (items.length > 0) {
      const latestItem = items[items.length - 1];
      returnItem(latestItem, true);
    }
  };

  return (
    <div className="w-screen h-screen">
      <div className="grid grid-cols-3 gap-4 h-screen p-4">
        <div className="col-span-1 p-4 border-2 border-gray-300 rounded-lg">
          <h2 className="text-lg font-bold mb-4 text-red-500 text-center">Main List</h2>
          <div className="flex flex-col gap-6">
            {mainList.map((item) => (
              <button
                key={item.name}
                onClick={() => handleMoveItem(item)}
                className="bg-gray-100 text-gray-700 px-4 py-2 rounded shadow"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
        <div
          className="col-span-1 h-full border-2 border-green-500 p-4 rounded-lg"
          onClick={() => handleReturnLatestInColumn("fruit")}
        >
          <h2 className="text-lg font-bold mb-4 text-green-500 text-center">Fruits</h2>
          <div className="space-y-2 cursor-pointer ">
            {fruit.map((item) => (
              <div
                key={item.name}
                className="bg-green-100 text-green-700 px-4 py-2 rounded shadow"
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
        <div
          className="col-span-1 border-2 border-yellow-500 p-4 rounded-lg"
          onClick={() => handleReturnLatestInColumn("vegetable")}
        >
          <h2 className="text-lg font-bold mb-4 text-yellow-500 text-center">Vegetables</h2>
          <div className="space-y-2 cursor-pointer">
            {vegetable.map((item) => (
              <div
                key={item.name}
                className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded shadow"
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TodoListPage;
