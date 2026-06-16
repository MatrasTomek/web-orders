# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

`web-order` is an Angular 15 SPA for managing freight/transport orders ("zlecenia transportowe"). The UI text and PDF output are in Polish. It manages clients, carriers, and orders, generates order PDFs (jsPDF), and attaches uploaded documents. Data lives in Firebase (Firestore + Auth); uploaded files go to a separate PHP endpoint.

## Commands

- `npm start` / `ng serve` — dev server at `http://localhost:4200/`
- `npm run build` / `ng build` — production build to `dist/web-order`
- `npm run watch` — development build with `--watch`
- `npm test` / `ng test` — unit tests via Karma + Jasmine
- Run a single spec: `ng test --include='**/order.service.spec.ts'`

There is no linter configured. Formatting is Prettier (`.prettierrc`): **tabs (width 4)**, single quotes, semicolons, `printWidth` 140, CRLF line endings. Match this style.

## Architecture

### State: NgRx for orders & customers, services for everything else
Orders and customers flow through NgRx (`src/app/store/{actions,reducers,effects,selectors}`). Effects call the Firestore-backed services and dispatch `*Success`/`*Failure` actions. There is also a `spinner` slice toggled to show the global loading spinner.

Crucially, the **services are the Firestore boundary** — components and effects never touch `AngularFirestore` directly:
- `OrderService` / `CustomerService` wrap `db.collection('orders' | 'customers')`. Note `getOrders()` wraps a `valueChanges()` subscription in a `Promise` (resolves once), so the store holds a snapshot, not a live stream.
- `AuthService` wraps `AngularFireAuth` + the `users` collection. It also exposes `docsMode$` (a `BehaviorSubject`) — see below.
- `OrderNumberGeneratorService` builds order numbers like `12/CZE/2026` (Polish month abbreviations).
- `PdfGeneratorService` builds order PDFs with jsPDF + jspdf-autotable.

When adding a feature that reads/writes Firestore, follow the existing pattern: service method → effect → action → reducer → selector. Don't call Firestore from components.

### Document uploads go to PHP, not Firebase Storage
`DocumentService.uploadDocument()` POSTs a `FormData` file to `environment.phpUploadUrl` (the PHP script in `php/upload.php`, deployed at `zlecenia.developerweb.pl`). The PHP script validates type (PDF/JPG/PNG), saves to `uploads/`, and returns `{ url }`. That URL is stored on the order as `IOrder.documentUrl`. The Firestore order record only holds the URL string.

### Auth & "docs mode"
Routing is in `src/app/app-routing.module.ts`. Some routes carry `data: { isAuth: true }` but **there is no route guard wired up** — auth gating is handled in components/nav via `AuthService.isAuthenticated$`. `docsMode$` is a separate flag: a limited "documents only" access mode (the `/docs` page + login) distinct from full authentication.

### UI structure
- Pages live in `src/app/pages/*` (start, orders, add-order, customers, docs, login, about) declared in `PagesModule`.
- Modals are standalone feature modules (e.g. `add-customer-modal`, `edit-customer-modal`, `show-order-modal`, `docs-modal`, `login-modal`, `register-modal`, `confirmation-modal`). Visibility is coordinated by `ModalService` (register/toggle by string id) — modals are not opened via the router.
- `SharedModule` holds reusable pieces: `alert`, `input`, `modal`, `spinner`, `truncate-text`.
- UI built with **PrimeNG 15** + PrimeFlex + PrimeIcons (theme `lara-light-blue`); forms use `ngx-mask`.

### Domain model
`src/app/models/order.model.ts` is the core type. An `IOrder` groups `clientDetails`, `carrierDetails`, `orderDetails` (load/unload places, dates, goods), `conditions` (freight terms, ADR/frigo/fixed flags), and optional `orderNumber` / `documentUrl`. `customer.model.ts` and `user.model.ts` cover the other collections.

## Configuration notes
- Firebase config (including API key) and `phpUploadUrl` live in `src/environments/environment.ts` / `environment.prod.ts` — committed to the repo.
- NgRx store-devtools is imported but commented out in `app.module.ts`; uncomment to enable.
- `firebase.json` is empty (`{}`); deployment is not driven through the Firebase CLI here.