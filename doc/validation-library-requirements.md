# vfine 要件定義書

**文書バージョン:** 1.0.0  
**作成日:** 2026年6月28日  
**ステータス:** ドラフト

---

## 1. 概要

### 1.1 目的

フロントエンド・サーバーサイドの双方で共通利用できる、汎用バリデーションライブラリを開発する。
本ライブラリはGitHubにオープンソースとして公開し、複数プロジェクトで再利用可能な形で提供することを目的とする。

### 1.2 背景

- フロントエンドの `<input>` タグ等のフォーム値はHTMLの仕様上、値が文字列（string）として渡される場合がある
- サーバーサイドでは型変換後の値（number、boolean等）を検証するケースが多い
- フロントエンド・サーバーサイドでバリデーションロジックが分散すると、仕様の二重管理・不整合が生じやすい
- 単一ライブラリで両環境に対応することで、保守性・一貫性を向上させる

### 1.3 対象読者

- ライブラリ開発者
- 本ライブラリを採用するプロジェクトの開発者

---

## 2. スコープ

### 2.1 対象

- TypeScript / JavaScript（ESM・CJS両対応）で実装
- ブラウザ環境およびNode.js環境での動作
- 以下の型に対するバリデーション機能の提供

| 型 | 説明 |
|---|---|
| `string` | 文字列 |
| `number` | 数値（文字列からの変換も許容） |
| `boolean` | 真偽値（文字列からの変換も許容） |
| `date` | 日付（文字列からの変換も許容） |
| `array` | 配列 |
| `object` | オブジェクト |

### 2.2 対象外

- データベースとの整合性チェック（存在確認・一意性確認等）
- 非同期バリデーション（将来バージョンで検討）
- 国際化（i18n）対応のメッセージ管理（将来バージョンで検討）

---

## 3. 機能要件

### 3.1 チェーンAPI（メソッドチェーン）

1つの値に対して複数のバリデーションルールを、メソッドチェーンで宣言的に定義できること。

```typescript
// 例：number型のバリデーション定義
const schema = v.number().required().min(5).max(20);

// 例：string型のバリデーション定義
const schema = v.string().required().minLength(1).maxLength(100).email();

// 実行
const result = schema.parse(inputValue);
```

### 3.2 柔軟な入力型の許容

フロントエンドの `<input>` 要素の値はすべて文字列として渡されるため、各型のバリデーターは対応する文字列表現も入力として受け付けること。

| バリデーター | 受け付ける入力型 |
|---|---|
| `v.number()` | `number` \| `string` |
| `v.boolean()` | `boolean` \| `string` |
| `v.date()` | `Date` \| `string` |
| `v.string()` | `string` |
| `v.array()` | `Array` |
| `v.object()` | `object` |

文字列から各型への変換は、パース処理の冒頭で自動的に行い、変換できない場合は型エラーとして扱う。

### 3.3 バリデーションチェック項目

#### 3.3.1 共通チェック

全型に適用可能なチェック。

| メソッド | 説明 | 例 |
|---|---|---|
| `.required()` | 値が `null`・`undefined`・空文字でないことを検証 | `v.string().required()` |
| `.optional()` | 値が `null`・`undefined` の場合は後続チェックをスキップ | `v.string().optional()` |
| `.nullable()` | `null` を許容する | `v.string().nullable()` |
| `.custom(fn)` | 任意のカスタムバリデーション関数を追加 | `v.string().custom(val => val !== 'NG')` |

#### 3.3.2 `number` 型チェック

| メソッド | 説明 | 例 |
|---|---|---|
| `.required()` | 必須チェック | `v.number().required()` |
| `.min(n)` | 最小値チェック（n以上） | `.min(0)` |
| `.max(n)` | 最大値チェック（n以下） | `.max(100)` |
| `.integer()` | 整数チェック | `.integer()` |
| `.positive()` | 正数チェック（0より大きい） | `.positive()` |
| `.negative()` | 負数チェック（0より小さい） | `.negative()` |
| `.multipleOf(n)` | nの倍数チェック | `.multipleOf(5)` |
| `.digits(n)` | 整数部の桁数チェック | `.digits(8)` |
| `.decimalDigits(n)` | 小数部の桁数チェック | `.decimalDigits(2)` |

#### 3.3.3 `string` 型チェック

| メソッド | 説明 | 例 |
|---|---|---|
| `.required()` | 必須チェック | `v.string().required()` |
| `.minLength(n)` | 最小文字数チェック（n文字以上） | `.minLength(1)` |
| `.maxLength(n)` | 最大文字数チェック（n文字以下） | `.maxLength(255)` |
| `.length(n)` | 固定文字数チェック | `.length(8)` |
| `.pattern(regex)` | 正規表現チェック | `.pattern(/^[a-z]+$/)` |
| `.email()` | メールアドレス形式チェック | `.email()` |
| `.url()` | URL形式チェック | `.url()` |
| `.uuid()` | UUID形式チェック | `.uuid()` |
| `.numeric()` | 数字のみチェック | `.numeric()` |
| `.alphanumeric()` | 英数字のみチェック | `.alphanumeric()` |
| `.includes(str)` | 指定文字列を含むチェック | `.includes('@')` |
| `.startsWith(str)` | 指定文字列で始まるチェック | `.startsWith('https')` |
| `.endsWith(str)` | 指定文字列で終わるチェック | `.endsWith('.jp')` |
| `.trim()` | 前後の空白を除去してからチェック | `.trim().required()` |

#### 3.3.4 `boolean` 型チェック

| メソッド | 説明 |
|---|---|
| `.required()` | 必須チェック（`undefined`・`null` を拒否） |
| `.isTrue()` | `true` のみ許容（同意チェック等に使用） |
| `.isFalse()` | `false` のみ許容 |

文字列入力時の変換ルール：

| 入力値 | 変換結果 |
|---|---|
| `"true"` / `"1"` / `"yes"` / `"on"` | `true` |
| `"false"` / `"0"` / `"no"` / `"off"` | `false` |
| その他 | 型エラー |

#### 3.3.5 `date` 型チェック

| メソッド | 説明 | 例 |
|---|---|---|
| `.required()` | 必須チェック | `v.date().required()` |
| `.min(date)` | 最小日付チェック（指定日以降） | `.min(new Date('2020-01-01'))` |
| `.max(date)` | 最大日付チェック（指定日以前） | `.max(new Date())` |
| `.past()` | 過去日付チェック（今日より前） | `.past()` |
| `.future()` | 未来日付チェック（今日より後） | `.future()` |
| `.format(fmt)` | 日付フォーマットチェック（文字列入力時） | `.format('YYYY-MM-DD')` |

#### 3.3.6 `array` 型チェック

| メソッド | 説明 | 例 |
|---|---|---|
| `.required()` | 必須チェック（空配列は許容） | `v.array().required()` |
| `.minItems(n)` | 最小要素数チェック | `.minItems(1)` |
| `.maxItems(n)` | 最大要素数チェック | `.maxItems(10)` |
| `.items(schema)` | 各要素のバリデーションスキーマ指定 | `.items(v.number().min(0))` |
| `.unique()` | 要素の一意性チェック | `.unique()` |

#### 3.3.7 `object` 型チェック

| メソッド | 説明 | 例 |
|---|---|---|
| `.required()` | 必須チェック | `v.object().required()` |
| `.shape(schemaMap)` | 各プロパティのバリデーションスキーマ指定 | `.shape({ name: v.string().required() })` |
| `.strict()` | スキーマ定義外のプロパティを拒否 | `.strict()` |

### 3.4 バリデーション実行メソッド

| メソッド | 説明 | 戻り値 |
|---|---|---|
| `.parse(value)` | バリデーションを実行し、失敗時は例外をスロー | 変換後の値 |
| `.safeParse(value)` | バリデーションを実行し、結果オブジェクトを返す（例外なし） | `{ success, data, errors }` |
| `.validate(value)` | `safeParse` のエイリアス | `{ success, data, errors }` |

#### 3.4.1 `safeParse` の戻り値の型

```typescript
// 成功時
{
  success: true,
  data: T,          // バリデーション・変換後の値
  errors: []
}

// 失敗時
{
  success: false,
  data: undefined,
  errors: [
    {
      field: string,     // フィールド名（object型の場合）
      rule: string,      // 違反したルール名（例: "required", "min"）
      message: string,   // エラーメッセージ
      value: unknown     // 検証された値
    }
  ]
}
```

### 3.5 カスタムエラーメッセージ

各チェックメソッドにオプション引数としてカスタムメッセージを指定できること。

```typescript
v.number()
  .required('金額は必須です')
  .min(1, '金額は1以上で入力してください')
  .max(1000000, '金額は1,000,000以下で入力してください');
```

---

## 4. 使用例

### 4.1 基本的な使用例

```typescript
import { v } from 'vfine';

// number型（フロントエンドからの文字列入力も許容）
const ageSchema = v.number().required().min(0).max(150).integer();

// 成功例
ageSchema.safeParse('25');    // { success: true, data: 25 }
ageSchema.safeParse(25);      // { success: true, data: 25 }

// 失敗例
ageSchema.safeParse('');      // { success: false, errors: [{ rule: 'required', ... }] }
ageSchema.safeParse('-1');    // { success: false, errors: [{ rule: 'min', ... }] }
ageSchema.safeParse('abc');   // { success: false, errors: [{ rule: 'type', ... }] }
```

### 4.2 object型のネスト

```typescript
const userSchema = v.object().required().shape({
  name:  v.string().required().maxLength(50),
  email: v.string().required().email(),
  age:   v.number().optional().min(0).max(150).integer(),
});

const result = userSchema.safeParse({
  name: '山田太郎',
  email: 'taro@example.com',
  age: '30',  // 文字列でも変換
});

// { success: true, data: { name: '山田太郎', email: '...', age: 30 } }
```

### 4.3 array型の要素チェック

```typescript
const tagsSchema = v.array().required().minItems(1).maxItems(5).items(
  v.string().required().maxLength(20)
);
```

---

## 5. 非機能要件

### 5.1 動作環境

| 環境 | 要件 |
|---|---|
| ブラウザ | モダンブラウザ（Chrome / Firefox / Safari / Edge 最新2バージョン） |
| Node.js | v18.x 以上 |
| TypeScript | v5.x 以上 |
| モジュール形式 | ESM / CJS 両対応（デュアルパッケージ） |

### 5.2 依存関係

- **外部ライブラリへの依存はゼロ（zero dependencies）** を原則とする
- ビルドツール・テストツールはdevDependenciesに留める

### 5.3 型安全性

- TypeScriptの型推論を活用し、`.parse()` / `.safeParse()` の戻り値に正確な型がつくこと
- スキーマ定義から自動的に型を導出できること（`Infer<typeof schema>` パターン）

```typescript
const schema = v.object().shape({
  name: v.string().required(),
  age:  v.number().required(),
});

type User = v.Infer<typeof schema>;
// => { name: string; age: number }
```

### 5.4 パフォーマンス

- 単一フィールドのバリデーション実行時間：1ms未満（目安）
- バンドルサイズ：minified + gzip で 5KB 以下を目標とする

### 5.5 テスト

- カバレッジ：ステートメントカバレッジ 90% 以上
- ユニットテスト：型変換・各チェックルール・エラーメッセージを網羅
- E2Eテスト：ブラウザ環境・Node.js環境双方で動作確認

---

## 6. 公開・配布要件

### 6.1 GitHubリポジトリ

| 項目 | 内容 |
|---|---|
| ライセンス | MIT License |
| ブランチ戦略 | `main`（安定版） / `develop`（開発版） |
| 必須ドキュメント | README.md / CONTRIBUTING.md / CHANGELOG.md |
| Issue テンプレート | バグ報告・機能要望の2種類 |
| PR テンプレート | チェックリスト付き |

### 6.2 npmパッケージ

| 項目 | 内容 |
|---|---|
| パッケージ名 | vfine |
| バージョニング | Semantic Versioning（semver）準拠 |
| 公開対象 | `dist/` ディレクトリのみ |
| エントリーポイント | ESM：`dist/index.mjs` / CJS：`dist/index.cjs` |
| 型定義ファイル | `dist/index.d.ts` |

### 6.3 CI/CD

- プルリクエスト時：Lint / 型チェック / ユニットテスト の自動実行
- `main` マージ時：npm への自動パブリッシュ（GitHub Actions）

---

## 7. ディレクトリ構成（案）

```
vfine/
├── src/
│   ├── index.ts           # エントリーポイント・公開API
│   ├── core/
│   │   ├── BaseValidator.ts   # チェーンAPIの基底クラス
│   │   └── ValidationError.ts # エラー型定義
│   ├── validators/
│   │   ├── NumberValidator.ts
│   │   ├── StringValidator.ts
│   │   ├── BooleanValidator.ts
│   │   ├── DateValidator.ts
│   │   ├── ArrayValidator.ts
│   │   └── ObjectValidator.ts
│   └── types.ts           # 型定義・Infer ユーティリティ
├── tests/
│   ├── number.test.ts
│   ├── string.test.ts
│   └── ...
├── dist/                  # ビルド成果物（git管理外）
├── package.json
├── tsconfig.json
├── README.md
├── CONTRIBUTING.md
└── CHANGELOG.md
```

---

## 8. 今後の検討事項（将来バージョン）

| 項目 | 概要 |
|---|---|
| 非同期バリデーション | サーバー問い合わせが必要なバリデーション（一意性チェック等） |
| i18n対応 | エラーメッセージの多言語化 |
| スキーマの合成 | `.merge()` / `.extend()` / `.pick()` / `.omit()` による再利用 |
| 条件付きバリデーション | `.when(field, condition, schema)` による動的スキーマ切り替え |
| ファイル型 | `File` / `Blob` 型のバリデーション（フロントエンド向け） |

---


## 9. クラス設計・インターフェース定義

### 9.1 クラス構成の概要

```
ValidationContext                  ← エントリーポイント（複数フィールドをまとめて管理）
  └── validators: BaseValidator[]
      addString()  → StringValidator
      addNumber()  → NumberValidator
      addBoolean() → BooleanValidator
      addDate()    → DateValidator
      addArray()   → ArrayValidator
      addObject()  → ObjectValidator

BaseValidator（抽象）              ← チェーンAPIの本体、型別バリデーターの基底
  ├── NumberValidator  extends BaseValidator
  ├── StringValidator  extends BaseValidator
  ├── BooleanValidator extends BaseValidator
  ├── DateValidator    extends BaseValidator
  ├── ArrayValidator   extends BaseValidator
  └── ObjectValidator  extends BaseValidator

BaseRule（抽象）                   ← 個別チェックロジックの基底
  ├── RequiredRule      extends BaseRule   {label}
  ├── MinRule           extends BaseRule   {label} {min}
  ├── MaxRule           extends BaseRule   {label} {max}
  ├── MinLengthRule     extends BaseRule   {label} {min}
  ├── MaxLengthRule     extends BaseRule   {label} {max}
  ├── LengthRule        extends BaseRule   {label} {length}
  ├── EmailRule         extends BaseRule   {label}
  ├── PatternRule       extends BaseRule   {label}
  ├── MultipleOfRule    extends BaseRule   {label} {multipleOf}
  ├── DigitsRule        extends BaseRule   {label} {digits}
  ├── DecimalDigitsRule extends BaseRule   {label} {decimalDigits}
  ├── MinItemsRule      extends BaseRule   {label} {min}
  ├── MaxItemsRule      extends BaseRule   {label} {max}
  └── CustomRule        extends BaseRule   {label}
```

**設計方針**

- `required()` / `min()` 等の各メソッドは、対応する `XxxRule` クラスを生成して `rules[]` に追加し `this` を返す。これだけでメソッドチェーンが成立する。
- `ValidationContext` の `addString()` / `addNumber()` 等の型別メソッドが、バリデーターを生成・登録して返す。
- 型別バリデーターを直接 `new` すれば、単体でも使える。
- `attr` は英語（`input[name]` と対応）、`label` は日本語（エラーメッセージ表示用）と役割を分離する。
- エラーメッセージのプレースホルダーはルールごとに意味のある名前（`{min}` / `{max}` / `{length}` 等）を使う。`{label}` / `{attr}` はすべてのルールで共通して使用できる。

---

### 9.2 使用パターン

#### パターン①：ValidationContext 経由（複数フィールドをまとめて検証）

```typescript
const ctx = new ValidationContext();

ctx.addString('username', 'ユーザー名', formData.username)
   .required()
   .minLength(3)
   .maxLength(20);

ctx.addNumber('age', '年齢', formData.age)
   .required()
   .min(0)
   .max(150, '20以下で入力してください');

ctx.addString('bio', '自己紹介', formData.bio)
   .required()
   .minLength(10)
   .setMessage('入力内容を確認してください。（{min}文字以上で入力）');

if (ctx.hasError()) {
  const errors = ctx.getErrors(); // エラーのある ValidationResult[] のみ取得
}
```

#### パターン②：バリデータークラスを直接使用（単一フィールド・単体テスト向け）

```typescript
// 単一ルールクラスを直接利用
const rule = new RequiredRule();
rule.setMessage('{label}を入力してください');
const result = rule.validate(value, 'ユーザー名'); // RuleResult を返す
```

```typescript
// 型別バリデーターをチェーンで直接利用
const v = new StringValidator('email', 'メールアドレス', inputValue);
const result = v.required().email().validate(); // ValidationResult を返す
```

---

### 9.3 インターフェース定義（TypeScript）

#### RuleResult — 個別ルール1件のチェック結果

```typescript
interface RuleResult {
  ok: boolean;
  message?: string;  // 失敗時のみセット（プレースホルダー展開済み）
}
```

#### ValidationResult — フィールド1件のバリデーション結果

```typescript
interface ValidationResult {
  attr: string;      // 英語フィールド名（例: "username"）
  label: string;     // 日本語ラベル（例: "ユーザー名"）
  ok: boolean;
  errors: string[];  // 失敗したルールのメッセージ一覧（展開済み）
}
```

---

#### BaseRule — 全ルールクラスの抽象基底

```typescript
abstract class BaseRule {
  /**
   * サブクラスで定義するデフォルトメッセージ。
   * {label} {attr} に加え、ルール固有のプレースホルダー（{min} / {max} 等）を含む。
   */
  protected static readonly DEFAULT_MSG: string;

  /** 実際に使用するメッセージテンプレート（setMessage() で上書き可能） */
  protected message: string;

  /**
   * メッセージテンプレートを変更する。
   * テンプレート内のプレースホルダーは validate() 実行時に展開される。
   * @example rule.setMessage('入力内容を確認してください。（{min}文字以上で入力）')
   */
  setMessage(template: string): this;

  /**
   * 値を検証し RuleResult を返す。
   * @param value  検証対象の値
   * @param label  日本語ラベル（{label} プレースホルダーに展開）
   * @param attr   英語フィールド名（{attr} プレースホルダーに展開）
   */
  abstract validate(value: unknown, label: string, attr: string): RuleResult;

  /**
   * テンプレート内のプレースホルダーをすべて実値に置換する。
   * サブクラスは params にルール固有の値（min / max / length 等）を渡す。
   * @example this.buildMessage(label, attr, { min: 3 })
   */
  protected buildMessage(
    label: string,
    attr: string,
    params?: Record<string, string | number>
  ): string;
}
```

---

#### BaseValidator — チェーンAPIの本体（型別バリデーターの基底）

```typescript
abstract class BaseValidator {
  protected attr: string;       // 英語フィールド名
  protected label: string;      // 日本語ラベル
  protected value: unknown;     // 検証対象の値
  protected rules: BaseRule[];

  constructor(attr: string, label: string, value: unknown);

  /** 必須チェックを追加（全型共通） */
  required(msg?: string): this;

  /** カスタムバリデーション関数を追加 */
  custom(fn: (value: unknown) => boolean | string, msg?: string): this;

  /**
   * 直前に追加されたルールのメッセージテンプレートを変更する。
   * メソッドチェーンの中で使える setMessage() の委譲版。
   * @example
   *   ctx.addString('bio', '自己紹介', value)
   *      .minLength(10)
   *      .setMessage('入力内容を確認してください。（{min}文字以上で入力）');
   */
  setMessage(template: string): this;

  /** バリデーションをすべて実行し ValidationResult を返す */
  validate(): ValidationResult;
}
```

---

#### NumberValidator

```typescript
class NumberValidator extends BaseValidator {
  /** 最小値チェック。プレースホルダー: {min} */
  min(threshold: number, msg?: string): this;

  /** 最大値チェック。プレースホルダー: {max} */
  max(threshold: number, msg?: string): this;

  /** 整数チェック。プレースホルダー: なし */
  integer(msg?: string): this;

  /** 正数チェック（0より大きい）。プレースホルダー: なし */
  positive(msg?: string): this;

  /** 負数チェック（0より小さい）。プレースホルダー: なし */
  negative(msg?: string): this;

  /** n の倍数チェック。プレースホルダー: {multipleOf} */
  multipleOf(n: number, msg?: string): this;

  /** 整数部の桁数チェック。プレースホルダー: {digits} */
  digits(n: number, msg?: string): this;

  /** 小数部の桁数チェック。プレースホルダー: {decimalDigits} */
  decimalDigits(n: number, msg?: string): this;
}
```

#### StringValidator

```typescript
class StringValidator extends BaseValidator {
  /** 最小文字数チェック。プレースホルダー: {min} */
  minLength(n: number, msg?: string): this;

  /** 最大文字数チェック。プレースホルダー: {max} */
  maxLength(n: number, msg?: string): this;

  /** 固定文字数チェック。プレースホルダー: {length} */
  length(n: number, msg?: string): this;

  /** 正規表現チェック。プレースホルダー: なし */
  pattern(regex: RegExp, msg?: string): this;

  /** メールアドレス形式チェック。プレースホルダー: なし */
  email(msg?: string): this;

  /** URL形式チェック。プレースホルダー: なし */
  url(msg?: string): this;

  /** UUID形式チェック。プレースホルダー: なし */
  uuid(msg?: string): this;

  /** 数字のみチェック。プレースホルダー: なし */
  numeric(msg?: string): this;

  /** 英数字のみチェック。プレースホルダー: なし */
  alphanumeric(msg?: string): this;

  /** 前後の空白を除去（ルール追加ではなく前処理） */
  trim(): this;
}
```

#### BooleanValidator

```typescript
class BooleanValidator extends BaseValidator {
  /** true のみ許容（同意チェック等）。プレースホルダー: なし */
  isTrue(msg?: string): this;

  /** false のみ許容。プレースホルダー: なし */
  isFalse(msg?: string): this;
}
```

#### DateValidator

```typescript
class DateValidator extends BaseValidator {
  /** 最小日付チェック（指定日以降）。プレースホルダー: {min} */
  min(date: Date | string, msg?: string): this;

  /** 最大日付チェック（指定日以前）。プレースホルダー: {max} */
  max(date: Date | string, msg?: string): this;

  /** 過去日付チェック（今日より前）。プレースホルダー: なし */
  past(msg?: string): this;

  /** 未来日付チェック（今日より後）。プレースホルダー: なし */
  future(msg?: string): this;

  /** 日付フォーマットチェック（文字列入力時）。プレースホルダー: {format} */
  format(fmt: string, msg?: string): this;
}
```

#### ArrayValidator

```typescript
class ArrayValidator extends BaseValidator {
  /** 最小要素数チェック。プレースホルダー: {min} */
  minItems(n: number, msg?: string): this;

  /** 最大要素数チェック。プレースホルダー: {max} */
  maxItems(n: number, msg?: string): this;

  /** 各要素のスキーマ指定 */
  items(validator: BaseValidator): this;

  /** 要素の一意性チェック。プレースホルダー: なし */
  unique(msg?: string): this;
}
```

---

#### 個別ルールクラス — デフォルトメッセージとプレースホルダー

```typescript
class RequiredRule extends BaseRule {
  // プレースホルダー: {label} {attr}
  protected static DEFAULT_MSG = '{label}は必須項目です';
  validate(value: unknown, label: string, attr: string): RuleResult;
}

class MinRule extends BaseRule {
  // プレースホルダー: {label} {attr} {min}
  protected static DEFAULT_MSG = '{label}は{min}以上で入力してください';
  constructor(private min: number) { super(); }
  validate(value: unknown, label: string, attr: string): RuleResult;
}

class MaxRule extends BaseRule {
  // プレースホルダー: {label} {attr} {max}
  protected static DEFAULT_MSG = '{label}は{max}以下で入力してください';
  constructor(private max: number) { super(); }
  validate(value: unknown, label: string, attr: string): RuleResult;
}

class MinLengthRule extends BaseRule {
  // プレースホルダー: {label} {attr} {min}
  protected static DEFAULT_MSG = '{label}は{min}文字以上で入力してください';
  constructor(private min: number) { super(); }
  validate(value: unknown, label: string, attr: string): RuleResult;
}

class MaxLengthRule extends BaseRule {
  // プレースホルダー: {label} {attr} {max}
  protected static DEFAULT_MSG = '{label}は{max}文字以内で入力してください';
  constructor(private max: number) { super(); }
  validate(value: unknown, label: string, attr: string): RuleResult;
}

class LengthRule extends BaseRule {
  // プレースホルダー: {label} {attr} {length}
  protected static DEFAULT_MSG = '{label}は{length}文字で入力してください';
  constructor(private length: number) { super(); }
  validate(value: unknown, label: string, attr: string): RuleResult;
}

class MultipleOfRule extends BaseRule {
  // プレースホルダー: {label} {attr} {multipleOf}
  protected static DEFAULT_MSG = '{label}は{multipleOf}の倍数で入力してください';
  constructor(private multipleOf: number) { super(); }
  validate(value: unknown, label: string, attr: string): RuleResult;
}

class EmailRule extends BaseRule {
  // プレースホルダー: {label} {attr}
  protected static DEFAULT_MSG = '{label}は正しいメールアドレス形式で入力してください';
  validate(value: unknown, label: string, attr: string): RuleResult;
}

class PatternRule extends BaseRule {
  // プレースホルダー: {label} {attr}
  protected static DEFAULT_MSG = '{label}の形式が正しくありません';
  constructor(private pattern: RegExp) { super(); }
  validate(value: unknown, label: string, attr: string): RuleResult;
}
```

---

#### ValidationContext — 複数フィールドのとりまとめ

```typescript
class ValidationContext {
  private validators: BaseValidator[] = [];

  /**
   * 各メソッドは型別バリデーターを生成・登録して返す。
   * 返り値にメソッドチェーンでルールを追加する。
   *
   * @param attr   英語フィールド名（input[name] と対応）
   * @param label  日本語ラベル（エラーメッセージの {label} に展開）
   * @param value  検証対象の値
   */
  addString(attr: string, label: string, value: unknown): StringValidator;
  addNumber(attr: string, label: string, value: unknown): NumberValidator;
  addBoolean(attr: string, label: string, value: unknown): BooleanValidator;
  addDate(attr: string, label: string, value: unknown): DateValidator;
  addArray(attr: string, label: string, value: unknown): ArrayValidator;
  addObject(attr: string, label: string, value: unknown): ObjectValidator;

  /** 登録されたすべてのフィールドを検証し結果一覧を返す */
  validateAll(): ValidationResult[];

  /** 1件以上エラーがあれば true */
  hasError(): boolean;

  /** エラーのある結果だけを返す */
  getErrors(): ValidationResult[];
}
```

---

### 9.4 エラーメッセージのカスタマイズ

#### プレースホルダー一覧

すべてのルールで `{label}` と `{attr}` が使用できる。それに加えてルールごとに以下のプレースホルダーが使用できる。

| プレースホルダー | 展開される値 | 使用できるルール |
|---|---|---|
| `{label}` | 日本語ラベル（例: `ユーザー名`） | 全ルール共通 |
| `{attr}` | 英語フィールド名（例: `username`） | 全ルール共通 |
| `{min}` | 最小値・最小文字数・最小件数 | `MinRule` / `MinLengthRule` / `MinItemsRule` / `DateValidator.min()` |
| `{max}` | 最大値・最大文字数・最大件数 | `MaxRule` / `MaxLengthRule` / `MaxItemsRule` / `DateValidator.max()` |
| `{length}` | 固定文字数 | `LengthRule` |
| `{multipleOf}` | 倍数の基数 | `MultipleOfRule` |
| `{digits}` | 整数部の桁数 | `DigitsRule` |
| `{decimalDigits}` | 小数部の桁数 | `DecimalDigitsRule` |
| `{format}` | 日付フォーマット文字列 | `DateValidator.format()` |

#### デフォルトメッセージ一覧

| ルールクラス | デフォルトメッセージ | プレースホルダー |
|---|---|---|
| `RequiredRule` | `{label}は必須項目です` | `{label}` `{attr}` |
| `MinRule` | `{label}は{min}以上で入力してください` | + `{min}` |
| `MaxRule` | `{label}は{max}以下で入力してください` | + `{max}` |
| `MinLengthRule` | `{label}は{min}文字以上で入力してください` | + `{min}` |
| `MaxLengthRule` | `{label}は{max}文字以内で入力してください` | + `{max}` |
| `LengthRule` | `{label}は{length}文字で入力してください` | + `{length}` |
| `IntegerRule` | `{label}は整数で入力してください` | `{label}` `{attr}` |
| `MultipleOfRule` | `{label}は{multipleOf}の倍数で入力してください` | + `{multipleOf}` |
| `EmailRule` | `{label}は正しいメールアドレス形式で入力してください` | `{label}` `{attr}` |
| `PatternRule` | `{label}の形式が正しくありません` | `{label}` `{attr}` |
| `MinItemsRule` | `{label}は{min}件以上選択してください` | + `{min}` |
| `MaxItemsRule` | `{label}は{max}件以内で選択してください` | + `{max}` |

#### カスタマイズ方法

**① メソッドの第2引数で指定（最もシンプル）**
```typescript
ctx.addNumber('age', '年齢', value)
   .max(20, '{max}歳以下で入力してください');
```

**② チェーン末尾に `setMessage()` を追加（プレースホルダーを活用した書き換え）**
```typescript
ctx.addString('bio', '自己紹介', value)
   .required()
   .minLength(10)
   .setMessage('入力内容を確認してください。（{min}文字以上で入力）');
```

**③ グローバルデフォルトの変更（プロジェクト全体で統一）**
```typescript
import { MinLengthRule } from 'vfine';
// 初期化時に1度だけ設定
MinLengthRule.setDefaultMessage('入力内容を確認してください。（{min}文字以上で入力）');
```

**④ 複数プレースホルダーの組み合わせ例**
```typescript
// min と max を1つのメッセージで表現したいケース（RangeRule を想定）
ctx.addNumber('price', '価格', value)
   .min(100)
   .setMessage('{min}円以上')
   .max(99999)
   .setMessage('{max}円以下で入力してください');

// {attr} を使ってサーバーサイドのログ向けメッセージに変える例
MinRule.setDefaultMessage('[{attr}] {min} or more required');
```

---

---

### 9.5 スキップ制御：必須でない値の後続ルールスキップ

#### 仕様

`required()` をチェーンに含めない場合、値が「空」と判定されたとき後続のすべてのルールをスキップして `ok: true` を返す。これにより、任意項目に属性チェックを定義しても、未入力時はエラーにならない。

「空」の判定基準は型によって異なる。

| 型 | 空と判定する値 |
|---|---|
| string | `""` / `null` / `undefined` |
| number | `null` / `undefined` / `""` |
| boolean | `null` / `undefined` |
| date | `null` / `undefined` / `""` |
| array | `null` / `undefined` |
| object | `null` / `undefined` |

#### 動作フロー

```
validate() 実行時

  値が空？
  ├─ YES かつ rules に RequiredRule が含まれる
  │     → RequiredRule を実行 → エラー（後続スキップ）
  ├─ YES かつ RequiredRule が含まれない
  │     → 全ルールをスキップ → ok: true を返す   ← 任意項目の未入力
  └─ NO（値あり）
        → 全ルールを順に実行
```

#### コード例

```typescript
// 任意項目：未入力ならスキップ、入力があれば minLength を検証
ctx.addString('nickname', 'ニックネーム', value)
   .minLength(2)
   .maxLength(20);
// value = ""   → ok: true（スキップ）
// value = "A"  → ok: false（minLength エラー）
// value = "AB" → ok: true

// 必須項目：未入力ならエラー
ctx.addString('username', 'ユーザー名', value)
   .required()
   .minLength(2)
   .maxLength(20);
// value = "" → ok: false（required エラー、minLength はスキップ）
```

---

### 9.6 バリデーションの分割実行

#### 仕様

`validate()` の引数 `requiredOnly` で実行範囲を切り替える。

| 呼び出し | 実行されるルール |
|---|---|
| `validate(true)` | `RequiredRule` のみ |
| `validate()` または `validate(false)` | 全ルール（必須 + 属性 + 桁数チェック） |

ルールクラスの分類は以下の通り。追加のフラグや設定は不要で、`RequiredRule` かどうかだけで判別する。

| 分類 | 対象クラス |
|---|---|
| 必須チェック | `RequiredRule` のみ |
| それ以外（属性・桁数） | `MinRule` / `MaxRule` / `MinLengthRule` / `MaxLengthRule` / `EmailRule` / `PatternRule` 等すべて |

#### BaseValidator の変更

```typescript
abstract class BaseValidator {
  /**
   * バリデーションを実行し ValidationResult を返す。
   * @param requiredOnly
   *   true  → RequiredRule のみ実行
   *   false / 省略 → 全ルールを実行
   */
  validate(requiredOnly?: boolean): ValidationResult;
}
```

#### ValidationContext の変更

```typescript
class ValidationContext {
  validateAll(requiredOnly?: boolean): ValidationResult[];
  hasError(requiredOnly?: boolean): boolean;
  getErrors(requiredOnly?: boolean): ValidationResult[];
}
```

#### コード例

```typescript
ctx.addString('username', 'ユーザー名', value)
   .required()
   .minLength(2)
   .maxLength(20);

// 必須チェックのみ（入力中のリアルタイム検証など）
ctx.validateAll(true);
// → RequiredRule だけ実行。minLength / maxLength はスキップ。

// 全チェック（送信ボタン押下時など）
ctx.validateAll();
// → required + minLength + maxLength をすべて実行。
```

```typescript
// 単体バリデーターでも同様
const v = new StringValidator('email', 'メールアドレス', inputValue);
v.required().email();

v.validate(true);   // required のみ
v.validate();       // required + email
```

---


### 9.7 ルール文字列による簡易構築（`rule()` メソッド）

#### 仕様

`rule(ruleString)` メソッドを `BaseValidator` に追加する。パイプ（`|`）区切りの文字列でルールを一括定義でき、チェーンメソッドと完全に等価な結果になる。

引数付きルールはコロン（`:`）で値を渡す。複数の引数はカンマ（`,`）区切りとする。

#### ルール文字列の構文

```
rule("ルール名|ルール名:引数|ルール名:引数,グループ名")
```

| 構文例 | 等価なメソッドチェーン |
|---|---|
| `"required"` | `.required()` |
| `"min:5"` | `.min(5)` |
| `"max:20"` | `.max(20)` |
| `"minLength:2"` | `.minLength(2)` |
| `"maxLength:100"` | `.maxLength(100)` |
| `"length:8"` | `.length(8)` |
| `"email"` | `.email()` |
| `"integer"` | `.integer()` |
| `"pattern:^[a-z]+$"` | `.pattern(/^[a-z]+$/)` |

グループ指定はルール名の後に `,グループ名` を付与する。

```
"required,basic|minLength:2,basic|maxLength:20,detail"
```

#### BaseValidator の拡張

```typescript
abstract class BaseValidator {
  /**
   * パイプ区切りのルール文字列を解析し、対応するルールを追加する。
   * メソッドチェーンと混在して使用できる。
   * @example
   *   validator.rule('required|min:5|max:20')
   *   validator.rule('required,basic|minLength:2,basic|maxLength:100,detail')
   */
  rule(ruleString: string): this;
}
```

#### コード例

```typescript
// チェーンと完全に等価
ctx.addNumber('age', '年齢', value)
   .rule('required|min:0|max:150');

// グループ指定付き
ctx.addString('username', 'ユーザー名', value)
   .rule('required,basic|minLength:2,basic|maxLength:20,detail');

// チェーンと混在も可能
ctx.addString('bio', '自己紹介', value)
   .rule('required|minLength:10')
   .setMessage('入力内容を確認してください。（{min}文字以上で入力）');

// パターン②（単体利用）でも使用可能
const v = new StringValidator('email', 'メールアドレス', inputValue);
v.rule('required|email').validate();
```

#### サポートするルール文字列一覧

| ルール文字列 | 引数 | 対応メソッド |
|---|---|---|
| `required` | なし | `.required()` |
| `min:n` | 数値 | `.min(n)` |
| `max:n` | 数値 | `.max(n)` |
| `minLength:n` | 数値 | `.minLength(n)` |
| `maxLength:n` | 数値 | `.maxLength(n)` |
| `length:n` | 数値 | `.length(n)` |
| `integer` | なし | `.integer()` |
| `positive` | なし | `.positive()` |
| `negative` | なし | `.negative()` |
| `email` | なし | `.email()` |
| `url` | なし | `.url()` |
| `uuid` | なし | `.uuid()` |
| `numeric` | なし | `.numeric()` |
| `alphanumeric` | なし | `.alphanumeric()` |
| `pattern:regex` | 正規表現文字列 | `.pattern(new RegExp(regex))` |
| `multipleOf:n` | 数値 | `.multipleOf(n)` |
| `past` | なし | `.past()` |
| `future` | なし | `.future()` |
| `minItems:n` | 数値 | `.minItems(n)` |
| `maxItems:n` | 数値 | `.maxItems(n)` |

> カスタムルール（`custom()`）はコールバック関数を必要とするため、ルール文字列では指定できない。チェーンメソッドで追加すること。


## 改訂履歴

| バージョン | 日付 | 変更内容 |
|---|---|---|
| 1.0.0 | 2026-06-28 | 初版作成 |
| 1.1.0 | 2026-06-28 | クラス設計・インターフェース定義・エラーメッセージカスタマイズ仕様を追加 |
| 1.2.0 | 2026-06-28 | 設計をシンプル化：ValidationContext導入、attr/label分離、使用パターン2種を整理 |
| 1.3.0 | 2026-06-28 | add()をaddString()/addNumber()等の型別メソッドに変更、プレースホルダーをルール固有名（{min}/{max}/{length}等）に統一 |
| 1.4.0 | 2026-06-28 | 必須なし時の後続スキップ仕様、グループ分割実行、rule()文字列構文を追加 |
| 1.5.0 | 2026-06-28 | 分割実行をvalidate(boolean)に簡略化（true=必須のみ、false/省略=全件） |
| 1.6.0 | 2026-06-28 | ライブラリ名を vfine に決定、全文に反映 |
