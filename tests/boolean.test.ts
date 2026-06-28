import { describe, it, expect } from 'vitest';
import { BooleanValidator } from '../src/validators/BooleanValidator.js';

describe('BooleanValidator', () => {
  describe('coerce from string', () => {
    const trueStrings = ['true', '1', 'yes', 'on', 'TRUE', 'YES'];
    const falseStrings = ['false', '0', 'no', 'off', 'FALSE', 'NO'];

    for (const s of trueStrings) {
      it(`"${s}" → true`, () => {
        expect(new BooleanValidator('b', 'フラグ', s).required().isTrue().validate().ok).toBe(true);
      });
    }

    for (const s of falseStrings) {
      it(`"${s}" → false`, () => {
        expect(new BooleanValidator('b', 'フラグ', s).required().isFalse().validate().ok).toBe(true);
      });
    }

    it('無効な文字列は変換失敗でrequiredエラー', () => {
      const r = new BooleanValidator('b', 'フラグ', 'maybe').required().validate();
      expect(r.ok).toBe(false);
    });
  });

  describe('isTrue', () => {
    it('trueはOK', () => {
      expect(new BooleanValidator('b', 'フラグ', true).isTrue().validate().ok).toBe(true);
    });

    it('falseはエラー', () => {
      expect(new BooleanValidator('b', 'フラグ', false).isTrue().validate().ok).toBe(false);
    });
  });

  describe('isFalse', () => {
    it('falseはOK', () => {
      expect(new BooleanValidator('b', 'フラグ', false).isFalse().validate().ok).toBe(true);
    });

    it('trueはエラー', () => {
      expect(new BooleanValidator('b', 'フラグ', true).isFalse().validate().ok).toBe(false);
    });
  });

  describe('optional', () => {
    it('null/undefinedはスキップしてOK', () => {
      expect(new BooleanValidator('b', 'フラグ', null).isTrue().validate().ok).toBe(true);
      expect(new BooleanValidator('b', 'フラグ', undefined).isTrue().validate().ok).toBe(true);
    });
  });
});
