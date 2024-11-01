import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoListPage from '@/app/todo-list/page';
import useItemStore from '@/app/stores/useItemStore';


jest.mock('@/app/stores/useItemStore');
const mockedUseItemStore = useItemStore as jest.MockedFunction<typeof useItemStore>;

describe('TodoListPage', () => {
  const mockMoveItem = jest.fn();
  const mockReturnItem = jest.fn();

  const mainList = [
    { name: 'Apple' },
    { name: 'Banana' },
  ];

  const fruit = [
    { name: 'Orange' },
  ];

  const vegetable = [
    { name: 'Carrot' },
  ];

  beforeEach(() => {
    mockedUseItemStore.mockReturnValue({
      mainList,
      fruit,
      vegetable,
      moveItem: mockMoveItem,
      returnItem: mockReturnItem,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main list, fruit list, and vegetable list', () => {
    render(<TodoListPage />);


    // เช๊คตรง part หัวข้อว่าถูก render ออกมาจริงไหม
    expect(screen.getByText('Main List')).toBeInTheDocument();
    expect(screen.getByText('Fruits')).toBeInTheDocument();
    expect(screen.getByText('Vegetables')).toBeInTheDocument();

    // เช๊คตรง items ว่าถูก render ออกมาจริงไหม
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Orange')).toBeInTheDocument();
    expect(screen.getByText('Carrot')).toBeInTheDocument();
  });

  it('calls moveItem when an item in the main list is clicked', () => {
    render(<TodoListPage />);
    
    // เช๊คว่า Apple โดน click แล้วเรียก function move แล้วตัว item ที่เข้าไปใน function ต้องเป็น apple
    fireEvent.click(screen.getByText('Apple'));
    expect(mockMoveItem).toHaveBeenCalledWith({ name: 'Apple' });
  });

// เช๊คว่า div ของตัว fruits ถ้า โดน click แล้วเรียก function return แล้วตัว item ที่ return คือ Orange
  it('returns the latest item in the fruit list when the fruit column is clicked', () => {
    render(<TodoListPage />);
    fireEvent.click(screen.getByText('Fruits'));
    expect(mockReturnItem).toHaveBeenCalledWith({ name: 'Orange' }, true);
  });

// เช๊คว่า div ของตัว vegetable ถ้า โดน click แล้วเรียก function return แล้วตัว item ที่ return คือ Carrot
  it('returns the latest item in the vegetable list when the vegetable column is clicked', () => {
    render(<TodoListPage />);
    fireEvent.click(screen.getByText('Vegetables'));
    expect(mockReturnItem).toHaveBeenCalledWith({ name: 'Carrot' }, true);
  });
});