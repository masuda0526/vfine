# vfine

**[English](#english) | [日本語](#日本語)**

---

<a name="english"></a>

# English

A simple, lightweight validation library that works seamlessly on both frontend and server-side.

[![npm version](https://img.shields.io/npm/v/vfine.svg)](https://www.npmjs.com/package/vfine)
[![license](https://img.shields.io/npm/l/vfine.svg)](https://github.com/your-org/vfine/blob/main/LICENSE)

## Features

- **Universal** — works in browsers and Node.js (ESM & CJS)
- **Frontend-friendly** — `number`, `boolean`, and `date` validators accept string input automatically, so `<input>` values just work
- **Fluent chain API** — `required().min(5).max(20)`
- **Rule string shorthand** — `rule('required|min:5|max:20')` for quick definitions
- **Smart skip** — optional fields skip all checks when empty; no extra config needed
- **Split validation** — run required-only checks separately from full validation
- **Customisable messages** — per-rule overrides with placeholders like `{label}`, `{min}`, `{max}`
- **Zero dependencies**

## Installation

```bash
npm install vfine
```

## Quick Start

### Using `ValidationContext` (recommended for forms)

```typescript
import { ValidationContext } from 'vfine';

const ctx = new ValidationContext();

ctx.addString('username', 'Username', formData.username)
   .required()
   .minLength(3)
   .maxLength(20);

ctx.addNumber('age', 'Age', formData.age)
   .required()
   .min(0)
   .max(150);

ctx.addString('email', 'Email', formData.email)
   .required()
   .email();

if (ctx.hasError()) {
  const errors = ctx.getErrors();
  // [{ attr: 'email', label: 'Email', ok: false, errors: ['Email is not a valid email address'] }]
}
```

### Using a validator directly (single field or unit tests)

```typescript
import { StringValidator } from 'vfine';

const v = new StringValidator('email', 'Email', inputValue);
const result = v.required().email().validate();
// { attr: 'email', label: 'Email', ok: false, errors: ['...'] }
```

## Rule String Shorthand

Define rules in a single string using `|` as separator and `:` for arguments.

```typescript
ctx.addNumber('age', 'Age', value).rule('required|min:0|max:150');

ctx.addString('username', 'Username', value).rule('required|minLength:3|maxLength:20');

// Mix with chain methods
ctx.addString('bio', 'Bio', value)
   .rule('required|minLength:10')
   .setMessage('Please check your input. ({min} characters or more)');
```

### Supported rule strings

| Rule string | Equivalent method |
|---|---|
| `required` | `.required()` |
| `min:n` | `.min(n)` |
| `max:n` | `.max(n)` |
| `minLength:n` | `.minLength(n)` |
| `maxLength:n` | `.maxLength(n)` |
| `length:n` | `.length(n)` |
| `integer` | `.integer()` |
| `positive` | `.positive()` |
| `negative` | `.negative()` |
| `email` | `.email()` |
| `url` | `.url()` |
| `uuid` | `.uuid()` |
| `numeric` | `.numeric()` |
| `alphanumeric` | `.alphanumeric()` |
| `pattern:regex` | `.pattern(new RegExp(regex))` |
| `multipleOf:n` | `.multipleOf(n)` |
| `past` | `.past()` |
| `future` | `.future()` |
| `minItems:n` | `.minItems(n)` |
| `maxItems:n` | `.maxItems(n)` |

> `custom()` requires a callback function and cannot be expressed as a rule string. Use the chain method instead.

## Optional Fields

If `required()` is **not** in the chain, empty values skip all subsequent rules automatically.

```typescript
// Optional: skips minLength when empty
ctx.addString('nickname', 'Nickname', value)
   .minLength(2)
   .maxLength(20);
// value = ""   → ok: true  (skipped)
// value = "A"  → ok: false (minLength error)
// value = "AB" → ok: true

// Required: fails when empty, then skips further checks
ctx.addString('username', 'Username', value)
   .required()
   .minLength(2)
   .maxLength(20);
// value = ""    → ok: false (required error; minLength skipped)
// value = "A"   → ok: false (minLength error)
// value = "Bob" → ok: true
```

## Split Validation

Run only required checks on input change, then full validation on submit.

```typescript
// Required check only (e.g. on input change)
ctx.validateAll(true);

// Full validation (e.g. on submit)
ctx.validateAll();
```

Works on individual validators too:

```typescript
const v = new StringValidator('email', 'Email', value);
v.required().email();

v.validate(true);  // required only
v.validate();      // required + email
```

## Error Message Customisation

### Per-rule: second argument

```typescript
ctx.addNumber('age', 'Age', value)
   .required('Age is required.')
   .min(0, 'Age must be 0 or above.')
   .max(150, 'Age must be {max} or below.');
```

### Per-rule: `setMessage()` in chain

```typescript
ctx.addString('bio', 'Bio', value)
   .required()
   .minLength(10)
   .setMessage('Please check your input. ({min} characters or more)');
```

### Global default (applied project-wide)

```typescript
import { MinLengthRule } from 'vfine';
MinLengthRule.setDefaultMessage('{label} must be at least {min} characters.');
```

### Available placeholders

| Placeholder | Value | Available in |
|---|---|---|
| `{label}` | Display label | All rules |
| `{attr}` | Field name | All rules |
| `{min}` | Minimum value / length | `MinRule`, `MinLengthRule`, `MinItemsRule`, `DateValidator.min()` |
| `{max}` | Maximum value / length | `MaxRule`, `MaxLengthRule`, `MaxItemsRule`, `DateValidator.max()` |
| `{length}` | Fixed length | `LengthRule` |
| `{multipleOf}` | Multiple base | `MultipleOfRule` |
| `{digits}` | Integer digit count | `DigitsRule` |
| `{decimalDigits}` | Decimal digit count | `DecimalDigitsRule` |
| `{format}` | Date format string | `DateValidator.format()` |

## API Reference

### `ValidationContext`

```typescript
ctx.addString(attr, label, value): StringValidator
ctx.addNumber(attr, label, value): NumberValidator
ctx.addBoolean(attr, label, value): BooleanValidator
ctx.addDate(attr, label, value): DateValidator
ctx.addArray(attr, label, value): ArrayValidator
ctx.addObject(attr, label, value): ObjectValidator

ctx.validateAll(requiredOnly?: boolean): ValidationResult[]
ctx.hasError(requiredOnly?: boolean): boolean
ctx.getErrors(requiredOnly?: boolean): ValidationResult[]
```

### `StringValidator`

```typescript
.required(msg?: string): this
.minLength(n, msg?: string): this    .maxLength(n, msg?: string): this
.length(n, msg?: string): this       .pattern(regex, msg?: string): this
.email(msg?: string): this           .url(msg?: string): this
.uuid(msg?: string): this            .numeric(msg?: string): this
.alphanumeric(msg?: string): this    .trim(): this
.rule(ruleString: string): this      .setMessage(template: string): this
.validate(requiredOnly?: boolean): ValidationResult
```

### `NumberValidator`

```typescript
.required(msg?: string): this
.min(n, msg?: string): this          .max(n, msg?: string): this
.integer(msg?: string): this         .positive(msg?: string): this
.negative(msg?: string): this        .multipleOf(n, msg?: string): this
.digits(n, msg?: string): this       .decimalDigits(n, msg?: string): this
.rule(ruleString: string): this      .setMessage(template: string): this
.validate(requiredOnly?: boolean): ValidationResult
```

### `BooleanValidator`

```typescript
.required(msg?: string): this
.isTrue(msg?: string): this
.isFalse(msg?: string): this
.validate(requiredOnly?: boolean): ValidationResult
```

String inputs are parsed automatically:

| Input | Parsed as |
|---|---|
| `"true"` / `"1"` / `"yes"` / `"on"` | `true` |
| `"false"` / `"0"` / `"no"` / `"off"` | `false` |

### `DateValidator`

```typescript
.required(msg?: string): this
.min(date, msg?: string): this       .max(date, msg?: string): this
.past(msg?: string): this            .future(msg?: string): this
.format(fmt, msg?: string): this
.validate(requiredOnly?: boolean): ValidationResult
```

### `ArrayValidator`

```typescript
.required(msg?: string): this
.minItems(n, msg?: string): this     .maxItems(n, msg?: string): this
.items(validator: BaseValidator): this
.unique(msg?: string): this
.validate(requiredOnly?: boolean): ValidationResult
```

### `ValidationResult`

```typescript
interface ValidationResult {
  attr: string;     // Field name
  label: string;    // Display label
  ok: boolean;
  errors: string[]; // Error messages (placeholders already resolved)
}
```

## Frontend Example (React)

```tsx
const [errors, setErrors] = useState<Record<string, string>>({});

const handleSubmit = () => {
  const ctx = new ValidationContext();

  ctx.addString('username', 'Username', form.username)
     .required()
     .minLength(3)
     .maxLength(20);

  ctx.addString('email', 'Email', form.email)
     .required()
     .email();

  ctx.addNumber('age', 'Age', form.age)
     .required()
     .min(18, 'You must be at least {min} years old.');

  if (ctx.hasError()) {
    const map: Record<string, string> = {};
    ctx.getErrors().forEach(r => { map[r.attr] = r.errors[0]; });
    setErrors(map);
    return;
  }
  // submit...
};
```

## Server-side Example (Node.js)

```typescript
import { ValidationContext } from 'vfine';

function validateUser(body: unknown) {
  const ctx = new ValidationContext();

  ctx.addString('username', 'Username', (body as any).username)
     .required()
     .minLength(3)
     .maxLength(20)
     .alphanumeric();

  ctx.addString('email', 'Email', (body as any).email)
     .required()
     .email();

  return { ok: !ctx.hasError(), errors: ctx.getErrors() };
}
```

## License

MIT

---

<a name="日本語"></a>

# 日本語

フロントエンドとサーバーサイドの両方でシームレスに動作する、シンプルで軽量なバリデーションライブラリです。

## 特徴

- **ユニバーサル** — ブラウザと Node.js の両方で動作（ESM & CJS 対応）
- **フロントエンド対応** — `number` / `boolean` / `date` バリデーターは文字列入力を自動変換するため、`<input>` の値をそのまま渡せる
- **チェーン API** — `required().min(5).max(20)` のように直感的に記述できる
- **ルール文字列** — `rule('required|min:5|max:20')` で素早く定義できる
- **スマートスキップ** — `required()` なしの任意項目は、空のとき後続チェックを自動スキップ
- **分割バリデーション** — 必須チェックのみ / 全件チェック を切り替えて実行できる
- **メッセージカスタマイズ** — `{label}` / `{min}` / `{max}` 等のプレースホルダーでルールごとに変更できる
- **ゼロ依存** — 外部ライブラリへの依存なし

## インストール

```bash
npm install vfine
```

## クイックスタート

### `ValidationContext` を使う（フォーム全体の検証に推奨）

```typescript
import { ValidationContext } from 'vfine';

const ctx = new ValidationContext();

ctx.addString('username', 'ユーザー名', formData.username)
   .required()
   .minLength(3)
   .maxLength(20);

ctx.addNumber('age', '年齢', formData.age)
   .required()
   .min(0)
   .max(150);

ctx.addString('email', 'メールアドレス', formData.email)
   .required()
   .email();

if (ctx.hasError()) {
  const errors = ctx.getErrors();
  // [{ attr: 'email', label: 'メールアドレス', ok: false, errors: ['メールアドレスは正しいメールアドレス形式で入力してください'] }]
}
```

### バリデーターを直接使う（単一フィールド・単体テスト向け）

```typescript
import { StringValidator } from 'vfine';

const v = new StringValidator('email', 'メールアドレス', inputValue);
const result = v.required().email().validate();
// { attr: 'email', label: 'メールアドレス', ok: false, errors: ['...'] }
```

## ルール文字列

`|` 区切りのルール文字列でルールをまとめて定義できます。引数は `:` で渡します。

```typescript
ctx.addNumber('age', '年齢', value).rule('required|min:0|max:150');

ctx.addString('username', 'ユーザー名', value).rule('required|minLength:3|maxLength:20');

// チェーンメソッドとの混在も可能
ctx.addString('bio', '自己紹介', value)
   .rule('required|minLength:10')
   .setMessage('入力内容を確認してください。（{min}文字以上で入力）');
```

### サポートするルール文字列

| ルール文字列 | 対応メソッド |
|---|---|
| `required` | `.required()` |
| `min:n` | `.min(n)` |
| `max:n` | `.max(n)` |
| `minLength:n` | `.minLength(n)` |
| `maxLength:n` | `.maxLength(n)` |
| `length:n` | `.length(n)` |
| `integer` | `.integer()` |
| `positive` | `.positive()` |
| `negative` | `.negative()` |
| `email` | `.email()` |
| `url` | `.url()` |
| `uuid` | `.uuid()` |
| `numeric` | `.numeric()` |
| `alphanumeric` | `.alphanumeric()` |
| `pattern:正規表現` | `.pattern(new RegExp(...))` |
| `multipleOf:n` | `.multipleOf(n)` |
| `past` | `.past()` |
| `future` | `.future()` |
| `minItems:n` | `.minItems(n)` |
| `maxItems:n` | `.maxItems(n)` |

> `custom()` はコールバック関数が必要なため、ルール文字列では指定できません。チェーンメソッドで追加してください。

## 任意項目のスキップ

チェーンに `required()` が含まれない場合、空の値は後続ルールをすべてスキップして `ok: true` を返します。

```typescript
// 任意項目：空なら全スキップ、入力があれば minLength を検証
ctx.addString('nickname', 'ニックネーム', value)
   .minLength(2)
   .maxLength(20);
// value = ""   → ok: true（スキップ）
// value = "A"  → ok: false（minLength エラー）
// value = "AB" → ok: true

// 必須項目：空ならエラー、以降のチェックはスキップ
ctx.addString('username', 'ユーザー名', value)
   .required()
   .minLength(2)
   .maxLength(20);
// value = ""    → ok: false（required エラー、minLength はスキップ）
// value = "A"   → ok: false（minLength エラー）
// value = "Bob" → ok: true
```

## 分割バリデーション

入力中は必須チェックのみ、送信時は全件チェックというように実行範囲を切り替えられます。

```typescript
// 必須チェックのみ実行（入力中のリアルタイム検証など）
ctx.validateAll(true);

// 全チェック実行（送信ボタン押下時など）
ctx.validateAll();
```

バリデーターを直接使う場合も同様です：

```typescript
const v = new StringValidator('email', 'メールアドレス', value);
v.required().email();

v.validate(true);  // 必須チェックのみ
v.validate();      // 必須 + email チェック
```

## エラーメッセージのカスタマイズ

### ① メソッドの第2引数で指定（最もシンプル）

```typescript
ctx.addNumber('age', '年齢', value)
   .required('年齢は必須です。')
   .min(0, '年齢は0以上で入力してください。')
   .max(150, '{max}歳以下で入力してください。');
```

### ② `setMessage()` でチェーン内に記述

```typescript
ctx.addString('bio', '自己紹介', value)
   .required()
   .minLength(10)
   .setMessage('入力内容を確認してください。（{min}文字以上で入力）');
```

### ③ グローバルデフォルトの変更（プロジェクト全体で統一）

```typescript
import { MinLengthRule } from 'vfine';
// アプリ初期化時に1度だけ設定
MinLengthRule.setDefaultMessage('{label}は{min}文字以上で入力してください。');
```

### 使用できるプレースホルダー

| プレースホルダー | 展開される値 | 使用できるルール |
|---|---|---|
| `{label}` | 日本語ラベル（例: `ユーザー名`） | 全ルール共通 |
| `{attr}` | 英語フィールド名（例: `username`） | 全ルール共通 |
| `{min}` | 最小値・最小文字数 | `MinRule` / `MinLengthRule` / `MinItemsRule` / `DateValidator.min()` |
| `{max}` | 最大値・最大文字数 | `MaxRule` / `MaxLengthRule` / `MaxItemsRule` / `DateValidator.max()` |
| `{length}` | 固定文字数 | `LengthRule` |
| `{multipleOf}` | 倍数の基数 | `MultipleOfRule` |
| `{digits}` | 整数部の桁数 | `DigitsRule` |
| `{decimalDigits}` | 小数部の桁数 | `DecimalDigitsRule` |
| `{format}` | 日付フォーマット文字列 | `DateValidator.format()` |

## API リファレンス

### `ValidationContext`

```typescript
ctx.addString(attr, label, value): StringValidator
ctx.addNumber(attr, label, value): NumberValidator
ctx.addBoolean(attr, label, value): BooleanValidator
ctx.addDate(attr, label, value): DateValidator
ctx.addArray(attr, label, value): ArrayValidator
ctx.addObject(attr, label, value): ObjectValidator

ctx.validateAll(requiredOnly?: boolean): ValidationResult[]
ctx.hasError(requiredOnly?: boolean): boolean
ctx.getErrors(requiredOnly?: boolean): ValidationResult[]
```

### `StringValidator`

```typescript
.required(msg?: string): this
.minLength(n, msg?: string): this    .maxLength(n, msg?: string): this
.length(n, msg?: string): this       .pattern(regex, msg?: string): this
.email(msg?: string): this           .url(msg?: string): this
.uuid(msg?: string): this            .numeric(msg?: string): this
.alphanumeric(msg?: string): this    .trim(): this
.rule(ruleString: string): this      .setMessage(template: string): this
.validate(requiredOnly?: boolean): ValidationResult
```

### `NumberValidator`

```typescript
.required(msg?: string): this
.min(n, msg?: string): this          .max(n, msg?: string): this
.integer(msg?: string): this         .positive(msg?: string): this
.negative(msg?: string): this        .multipleOf(n, msg?: string): this
.digits(n, msg?: string): this       .decimalDigits(n, msg?: string): this
.rule(ruleString: string): this      .setMessage(template: string): this
.validate(requiredOnly?: boolean): ValidationResult
```

### `BooleanValidator`

```typescript
.required(msg?: string): this
.isTrue(msg?: string): this
.isFalse(msg?: string): this
.validate(requiredOnly?: boolean): ValidationResult
```

文字列入力は自動変換されます：

| 入力値 | 変換結果 |
|---|---|
| `"true"` / `"1"` / `"yes"` / `"on"` | `true` |
| `"false"` / `"0"` / `"no"` / `"off"` | `false` |

### `DateValidator`

```typescript
.required(msg?: string): this
.min(date, msg?: string): this       .max(date, msg?: string): this
.past(msg?: string): this            .future(msg?: string): this
.format(fmt, msg?: string): this
.validate(requiredOnly?: boolean): ValidationResult
```

### `ArrayValidator`

```typescript
.required(msg?: string): this
.minItems(n, msg?: string): this     .maxItems(n, msg?: string): this
.items(validator: BaseValidator): this
.unique(msg?: string): this
.validate(requiredOnly?: boolean): ValidationResult
```

### `ValidationResult`

```typescript
interface ValidationResult {
  attr: string;     // 英語フィールド名
  label: string;    // 日本語ラベル
  ok: boolean;
  errors: string[]; // エラーメッセージ一覧（プレースホルダー展開済み）
}
```

## 使用例（React フロントエンド）

```tsx
const [errors, setErrors] = useState<Record<string, string>>({});

const handleSubmit = () => {
  const ctx = new ValidationContext();

  ctx.addString('username', 'ユーザー名', form.username)
     .required()
     .minLength(3)
     .maxLength(20);

  ctx.addString('email', 'メールアドレス', form.email)
     .required()
     .email();

  ctx.addNumber('age', '年齢', form.age)
     .required()
     .min(18, '{min}歳以上で登録できます。');

  if (ctx.hasError()) {
    const map: Record<string, string> = {};
    ctx.getErrors().forEach(r => { map[r.attr] = r.errors[0]; });
    setErrors(map);
    return;
  }
  // 送信処理...
};
```

## 使用例（Node.js サーバーサイド）

```typescript
import { ValidationContext } from 'vfine';

function validateUser(body: unknown) {
  const ctx = new ValidationContext();

  ctx.addString('username', 'ユーザー名', (body as any).username)
     .required()
     .minLength(3)
     .maxLength(20)
     .alphanumeric();

  ctx.addString('email', 'メールアドレス', (body as any).email)
     .required()
     .email();

  return { ok: !ctx.hasError(), errors: ctx.getErrors() };
}
```

## ライセンス

MIT
