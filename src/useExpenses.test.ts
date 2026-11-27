import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useExpenses } from './useExpenses';

describe('useExpenses', () => {
  it('should initialize with empty array', () => {
    const { result } = renderHook(() => useExpenses());
    expect(result.current.expenses).toEqual([]);
  });

  it('should add an expense', () => {
    const { result } = renderHook(() => useExpenses());
    act(() => {
      result.current.addExpense({ description: 'Test', amount: 100, date: '2026-11-27' });
    });
    expect(result.current.expenses.length).toBe(1);
    expect(result.current.expenses[0].description).toBe('Test');
  });

  it('should delete an expense', () => {
    const { result } = renderHook(() => useExpenses());
    act(() => {
      result.current.addExpense({ description: 'Test', amount: 100, date: '2026-11-27' });
    });
    const id = result.current.expenses[0].id;
    act(() => {
      result.current.deleteExpense(id);
    });
    expect(result.current.expenses.length).toBe(0);
  });
});
