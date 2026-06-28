import { describe, it, expect } from 'vitest';
import { DateValidator } from '../src/validators/DateValidator.js';

describe('DateValidator', () => {
  describe('coerce', () => {
    it('Dateオブジェクトはそのまま', () => {
      const d = new Date('2024-01-01');
      expect(new DateValidator('d', '日付', d).validate().ok).toBe(true);
    });

    it('ISO文字列をDateに変換', () => {
      expect(new DateValidator('d', '日付', '2024-01-01').required().validate().ok).toBe(true);
    });

    it('無効な文字列はundefinedになりrequiredエラー', () => {
      expect(new DateValidator('d', '日付', 'not-a-date').required().validate().ok).toBe(false);
    });
  });

  describe('min', () => {
    it('指定日以降はOK', () => {
      const v = new DateValidator('d', '日付', new Date('2024-06-01'));
      expect(v.min(new Date('2024-01-01')).validate().ok).toBe(true);
    });

    it('指定日より前はエラー', () => {
      const v = new DateValidator('d', '日付', new Date('2023-12-31'));
      expect(v.min(new Date('2024-01-01')).validate().ok).toBe(false);
    });
  });

  describe('max', () => {
    it('指定日以前はOK', () => {
      const v = new DateValidator('d', '日付', new Date('2024-01-01'));
      expect(v.max(new Date('2024-12-31')).validate().ok).toBe(true);
    });

    it('指定日より後はエラー', () => {
      const v = new DateValidator('d', '日付', new Date('2025-01-01'));
      expect(v.max(new Date('2024-12-31')).validate().ok).toBe(false);
    });
  });

  describe('past', () => {
    it('過去日付はOK', () => {
      const past = new Date();
      past.setFullYear(past.getFullYear() - 1);
      expect(new DateValidator('d', '日付', past).past().validate().ok).toBe(true);
    });

    it('今日以降はエラー', () => {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);
      expect(new DateValidator('d', '日付', future).past().validate().ok).toBe(false);
    });
  });

  describe('future', () => {
    it('未来日付はOK', () => {
      const future = new Date();
      future.setFullYear(future.getFullYear() + 1);
      expect(new DateValidator('d', '日付', future).future().validate().ok).toBe(true);
    });

    it('今日以前はエラー', () => {
      const past = new Date();
      past.setFullYear(past.getFullYear() - 1);
      expect(new DateValidator('d', '日付', past).future().validate().ok).toBe(false);
    });
  });

  describe('format', () => {
    it('YYYY-MM-DD形式の文字列はOK', () => {
      const v = new DateValidator('d', '日付', '2024-01-15');
      expect(v.format('YYYY-MM-DD').validate().ok).toBe(true);
    });

    it('形式不一致はエラー', () => {
      const v = new DateValidator('d', '日付', '2024/01/15');
      expect(v.format('YYYY-MM-DD').validate().ok).toBe(false);
    });
  });

  describe('optional', () => {
    it('空の場合はスキップ', () => {
      expect(new DateValidator('d', '日付', '').past().validate().ok).toBe(true);
      expect(new DateValidator('d', '日付', null).past().validate().ok).toBe(true);
    });
  });
});
