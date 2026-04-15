# AI Integration

The backend uses two Claude models via [OpenRouter](https://openrouter.ai), accessed through the OpenAI Java SDK pointed at `https://openrouter.ai/api/v1`.

## Model Strategy

| Model | OpenRouter ID | Used for | Reason |
|---|---|---|---|
| Claude Sonnet 4.6 | `anthropic/claude-sonnet-4-6` | Image/photo extraction | Vision capability required |
| Claude Haiku 4.5 | `anthropic/claude-haiku-4-5` | Text extraction, PDF extraction, categorisation, duplicate check | High volume, lower cost |

**OpenRouter, not Anthropic direct:** Using OpenRouter gives an OpenAI-compatible API, making it easy to switch models and providers without changing SDK code.

## Adapter

`OpenRouterLlmAdapter` (in `infrastructure.llm.adapter`) implements `LlmPort`. It is configured via `OpenRouterConfig` which creates an `OpenAIClient` bean with:

- Base URL: `https://openrouter.ai/api/v1`
- API key: `OPENROUTER_API_KEY` environment variable

All three `LlmPort` methods use **structured outputs** (OpenAI JSON Schema response format), so the LLM is constrained to return valid JSON — no regex-based post-processing.

---

## Method Details

### `extractTransaction(String content, String entryType)`

Extracts a structured `ExtractedTransaction` from a receipt.

**Model selection:**
- `entryType == "image"` → Sonnet 4.6 with base64-encoded JPEG (vision message)
- `entryType == "text"` or `"pdf"` → Haiku 4.5 with a text-only prompt

**Prompt (text/PDF variant):**

```
You are a financial assistant. Extract the transaction details from the following receipt text.
Return a JSON object with the fields: amount (positive decimal), date (YYYY-MM-DD),
establishment (merchant name), description (brief description), tax_id (CNPJ/CPF if present, else null),
transaction_type ("EXPENSE" or "INCOME"), payment_method ("CREDIT", "DEBIT", or null),
confidence (0.0 to 1.0 indicating extraction quality).
```

**Image variant:** same instruction but the content is sent as an image part in the message array.

**Expected JSON response:**

```json
{
  "amount": 42.50,
  "date": "2026-04-13",
  "establishment": "Supermercado Extra",
  "description": "Compras no mercado",
  "tax_id": "12.345.678/0001-99",
  "transaction_type": "EXPENSE",
  "payment_method": "DEBIT",
  "confidence": 0.95
}
```

The response is deserialised into `ExtractedTransaction`. The compact constructor then validates `amount` and formats `tax_id`.

**Error handling:** Any HTTP error or JSON parse failure throws `LlmExtractionException`, which the controller catches and logs without crashing the webhook handler.

---

### `categorize(ExtractedTransaction extracted, List<String> categoryNames)`

Picks the best matching category for the extracted transaction.

**Model:** Haiku 4.5

**Prompt:**

```
You are a financial assistant. Given the following transaction details and a list of available
categories, return the single best-matching category name.
Transaction: <JSON of extracted transaction>
Available categories: ["Alimentação", "Transporte", ...]
Return: {"category": "<chosen name>"}
```

**Expected JSON response:**

```json
{ "category": "Alimentação" }
```

**Fallback:** If the LLM returns an unrecognised name or an empty response, the adapter defaults to the first category in the list.

---

### `isDuplicate(ExtractedTransaction extracted, List<Transaction> recentTransactions)`

Checks whether the new transaction appears to be a duplicate of any of the 3 most recent saved transactions.

**Model:** Haiku 4.5

**Prompt:**

```
You are a financial assistant. Determine if the new transaction is a duplicate of any of the
recent transactions listed below. A duplicate has the same amount, date, and merchant.
New transaction: <JSON>
Recent transactions: <JSON array>
Return: {"duplicate": true} or {"duplicate": false}
```

**Expected JSON response:**

```json
{ "duplicate": false }
```

**Fallback:** Any error (HTTP failure, parse error) returns `false` — the default is to allow the save rather than silently block a legitimate transaction.

---

## Observability

Every LLM call is wrapped in an **OpenTelemetry span** with these attributes:

| Attribute | Value |
|---|---|
| `llm.model` | Model ID (e.g. `anthropic/claude-haiku-4-5`) |
| `llm.tokens.input` | Prompt token count |
| `llm.tokens.output` | Completion token count |
| `llm.finish_reason` | Stop reason from the API (`stop`, `length`, etc.) |

Spans are exported to the configured OTLP endpoint (`SIGNOZ_OTLP_ENDPOINT`). See `personal-finances-backend-signoz/` for the SigNoz setup.

---

## Configuration

```properties
openrouter.api-key=${OPENROUTER_API_KEY}
otel.service.name=finances-backend
otel.exporter.otlp.endpoint=${SIGNOZ_OTLP_ENDPOINT}
otel.exporter.otlp.protocol=http/protobuf
```

The `OpenRouterConfig` bean wires the `OpenAIClient` and injects `OPENROUTER_API_KEY` via `@Value`.
