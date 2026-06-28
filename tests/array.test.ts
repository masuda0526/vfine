import { describe, it, expect } from 'vitest';
import { ArrayValidator } from '../src/validators/ArrayValidator.js';
import { StringValidator } from '../src/validators/StringValidator.js';
import { NumberValidator } from '../src/validators/NumberValidator.js';

describe('ArrayValidator', () => {
  describe('required', () => {
    it('配列はOK', () => {
      expect(new ArrayValidator('a', 'タグ', []).required().validate().ok).toBe(true);
    });

    it('nullはrequiredエラー', () => {
      expect(new ArrayValidator('a', 'タグ', null).required().validate().ok).toBe(false);
    });
  });

  describe('minItems', () => {
    it('OK', () => {
      expect(new ArrayValidator('a', 'タグ', [1, 2]).minItems(2).validate().ok).toBe(true);
    });

    it('エラー', () => {
      expect(new ArrayValidator('a', 'タグ', [1]).minItems(2).validate().ok).toBe(false);
    });
  });

  describe('maxItems', () => {
    it('OK', () => {
      expect(new ArrayValidator('a', 'タグ', [1, 2]).maxItems(3).validate().ok).toBe(true);
    });

    it('エラー', () => {
      expect(new ArrayValidator('a', 'タグ', [1, 2, 3, 4]).maxItems(3).validate().ok).toBe(false);
    });
  });

  describe('unique', () => {
    it('重複なしはOK', () => {
      expect(new ArrayValidator('a', 'タグ', [1, 2, 3]).unique().validate().ok).toBe(true);
    });

    it('重複ありはエラー', () => {
      expect(new ArrayValidator('a', 'タグ', [1, 2, 2]).unique().validate().ok).toBe(false);
    });
  });

  describe('items', () => {
    it('全要素がスキーマを満たす', () => {
      const itemV = new StringValidator('item', 'タグ', '');
      itemV.required().maxLength(10);
      const v = new ArrayValidator('a', 'タグ', ['foo', 'bar']);
      expect(v.items(itemV).validate().ok).toBe(true);
    });

    it('要素がスキーマに違反', () => {
      const itemV = new StringValidator('item', 'タグ', '');
      itemV.required().maxLength(3);
      const v = new ArrayValidator('a', 'タグ', ['fo', 'toolong']);
      const r = v.items(itemV).validate();
      expect(r.ok).toBe(false);
      expect(r.errors.some((e) => e.includes('[1]'))).toBe(true);
    });

    it('数値配列のitemsチェック', () => {
      const itemV = new NumberValidator('n', '値', 0);
      itemV.min(0);
      const v = new ArrayValidator('a', '値', [1, 2, -1]);
      const r = v.items(itemV).validate();
      expect(r.ok).toBe(false);
    });
  });

  describe('optional', () => {
    it('nullはスキップ', () => {
      expect(new ArrayValidator('a', 'タグ', null).minItems(1).validate().ok).toBe(true);
    });
  });
});
