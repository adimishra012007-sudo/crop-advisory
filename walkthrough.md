# Project Walkthrough - Week 7 AI Integration

This document summarizes the changes, architecture, request flows, and testing status of the Google Gemini AI Advisory integration completed for Week 7.

---

## 1. Architecture Overview

We have implemented a clean, decoupled architecture separating services, controllers, routing, and UI:

```mermaid
graph TD
  FE[Next.js Chatbot Page] -->|POST api/ai/chat| API[src/lib/api.js askAIChat]
  API -->|JWT Token in Header| ROUTE[backend/routes/aiRoutes.js]
  ROUTE -->|protect Auth Middleware| ROUTE_OK[Route Authorized]
  ROUTE_OK -->|dbCheck Middleware| CTRL[backend/controllers/aiController.js]
  CTRL -->|Validate req.body.message| SERV[backend/services/geminiService.js]
  SERV -->|systemInstruction & gemini-1.5-flash| GEMINI[Google Gemini API]
  GEMINI -->|Text response| SERV
  SERV -->|JSON {response}| CTRL
  CTRL -->|HTTP 200 OK| FE
```

---

## 2. File Directory Changes

### Created Files
1. **[geminiService.js](file:///d:/crop/crop-advisory/backend/services/geminiService.js)**: Configures Google Generative AI client, system instructions, timeout (15s), and handles error mapping.
2. **[aiController.js](file:///d:/crop/crop-advisory/backend/controllers/aiController.js)**: Validates requests (ensures non-empty text), triggers the Gemini service, and replies with JSON or formats HTTP errors.
3. **[aiRoutes.js](file:///d:/crop/crop-advisory/backend/routes/aiRoutes.js)**: Configures express routes, applies authentication checks, and binds endpoints to controllers.
4. **[PROMPTS.md](file:///d:/crop/crop-advisory/PROMPTS.md)**: Logs the prompt engineering process, testing variations, and selecting the optimal prompt.
5. **[walkthrough.md](file:///d:/crop/crop-advisory/walkthrough.md)**: This architecture and validation report.

### Modified Files
1. **[server.js](file:///d:/crop/crop-advisory/backend/server.js)**: Registered the new `/api/ai` endpoints.
2. **[api.js](file:///d:/crop/crop-advisory/src/lib/api.js)**: Integrated the `askAIChat` API utility with automatic header/JWT credentials transmission.
3. **[page.jsx](file:///d:/crop/crop-advisory/src/app/chatbot/page.jsx)**: Swapped mock responses with live backend chat connection, updated loading indicator strings, and disabled submit button when busy.
4. **[.env.example](file:///d:/crop/crop-advisory/backend/.env.example)**: Documented `GEMINI_API_KEY` configuration.
5. **[.env](file:///d:/crop/crop-advisory/backend/.env)**: Stored local environment development values (ignored in Git).
6. **[README.md](file:///d:/crop/crop-advisory/README.md)**: Updated installation guidelines, architectural outlines, endpoints catalog, and troubleshooting lists.

---

## 3. Dependencies Added

### Backend
- **`@google/generative-ai`** (v0.21.0 or latest): The official Google Generative AI Node.js SDK for accessing the Gemini model family.

---

## 4. How the AI Advisory Works

### System Instruction & Constraints
The AI operates with an agricultural expert personality customized for Uttarakhand farming. 
It processes queries such as season recommendations, water requirements, crop diseases, and pests. If an off-topic question is supplied (e.g. general knowledge, programming, history), it triggers a pre-trained restriction to refuse politely.

### Request Flow
1. User enters text on the **Chatbot Page** and clicks **Send**.
2. Frontend triggers loading animation, disables Send button, and invokes `askAIChat(message)`.
3. `askAIChat` attaches user's JWT from `localStorage` as a Bearer authorization header and posts to `/api/ai/chat`.
4. Backend `protect` middleware decodes the JWT and validates the user.
5. `aiController` ensures message payload is clean, then calls `geminiService`.

### Response Flow
1. `geminiService` issues content request to Gemini model `gemini-1.5-flash` wrapped in a 15-second timeout promise race.
2. Gemini returns text suggestions formatting responses with headers and lists.
3. If successful, `aiController` maps response and returns `200 OK` JSON `{ response: "AI advice..." }`.
4. If an error occurs (e.g. timeout, limit quota), `aiController` maps status (429, 503, 504) returning a friendly error JSON payload.
5. Frontend receives response, stops loader, enables input fields, and renders formatted response, or presents a Toast error banner if failed.

---

## 5. Testing Checklist & Results

| Feature Tested | Action / Scenario | Expected Result | Status |
|:---|:---|:---|:---|
| **Route Protection** | Call `POST /api/ai/chat` without authorization header. | Returns `401 Unauthorized` status. | **PASS** |
| **Validation** | Call `POST /api/ai/chat` with empty message body. | Returns `400 Bad Request` with validation error message. | **PASS** |
| **Farming Advisory** | Ask about Apple leaf spot disease. | Returns detailed, structured agricultural instructions. | **PASS** |
| **Off-topic Block** | Ask: "How does blockchain work?" | Politeness refusal: redirects user to agricultural questions. | **PASS** |
| **Error Handlers** | Simulate server down or invalid key. | Displays a Toast notification stating connection failure. | **PASS** |
| **Loader Behavior** | Submit query on Chatbot page. | Send button disabled, Loader displays: "AI Assistant is thinking..." | **PASS** |
| **JWT Propagation** | Check request headers on POST. | Authorization header matches `Bearer <token>`. | **PASS** |

---

## 6. Recommended Screenshots to Capture

For project submission, capture these key states:
1. **Chatbot Interface (Loading State)**: Displaying the text "AI Assistant is thinking..." and a disabled Send button.
2. **Agricultural Response**: Standard, nicely formatted markdown response answering a crop disease question.
3. **Off-topic Rejection**: AI replying with the polite redirection text when queried about non-farming items.
4. **Toast notification**: Disconnecting the backend server and submitting a query, showing the red Toast error banner on top.
