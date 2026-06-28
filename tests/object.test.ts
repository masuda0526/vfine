import { describe, it, expect } from 'vitest';
import { ObjectValidator } from '../src/validators/ObjectValidator.js';
import { StringValidator } from '../src/validators/StringValidator.js';
import { NumberValidator } from '../src/validators/NumberValidator.js';

describe('ObjectValidator', () => {
  describe('required', () => {
    it('オブジェクトはOK', () => {
      expect(new ObjectValidator('o', 'オブジェクト', {}).required().validate().ok).toBe(true);
    });

    it('nullはエラー', () => {
      expect(new ObjectValidator('o', 'オブジェクト', null).required().validate().ok).toBe(false);
    });
  });

  describe('shape', () => {
    function makeUserShape() {
      return {
        name: new StringValidator('name', '名前', '').required().maxLength(50),
        age: new NumberValidator('age', '年齢', 0).required().min(0).max(150),
      };
    }

    it('全フィールドが有効', () => {
      const shape = makeUserShape();
      const v = new ObjectValidator('u', 'ユーザー', { name: '山田', age: 30 });
      expect(v.required().shape(shape).validate().ok).toBe(true);
    });

    it('フィールド違反でエラー', () => {
      const shape = makeUserShape();
      const v = new ObjectValidator('u', 'ユーザー', { name: '', age: 30 });
      const r = v.required().shape(shape).validate();
      expect(r.ok).toBe(false);
      expect(r.errors.some((e) => e.startsWith('name:'))).toBe(true);
    });

    it('数値フィールドに文字列を渡しても変換される', () => {
      const shape = makeUserShape();
      const v = new ObjectValidator('u', 'ユーザー', { name: '太郎', age: '30' });
      expect(v.required().shape(shape).validate().ok).toBe(true);
    });
  });

  describe('strict', () => {
    it('余分なプロパティがない場合はOK', () => {
      const shape = { name: new StringValidator('name', '名前', '').required() };
      const v = new ObjectValidator('u', 'ユーザー', { name: '太郎' });
      expect(v.required().shape(shape).strict().validate().ok).toBe(true);
    });

    it('余分なプロパティがある場合はエラー', () => {
      const shape = { name: new StringValidator('name', '名前', '').required() };
      const v = new ObjectValidator('u', 'ユーザー', { name: '太郎', extra: 'xxx' });
      const r = v.required().shape(shape).strict().validate();
      expect(r.ok).toBe(false);
      expect(r.errors.some((e) => e.includes('extra'))).toBe(true);
    });
  });

  describe('optional', () => {
    it('undefinedはスキップ', () => {
      const shape = { name: new StringValidator('name', '名前', '').required() };
      const v = new ObjectValidator('u', 'ユーザー', undefined);
      expect(v.shape(shape).validate().ok).toBe(true);
    });
  });
});
