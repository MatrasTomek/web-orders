# Plan implementacji responsywności (media-query) — web-orders

## Kontekst

Aplikacja `web-order` (Angular 15 SPA) jest obecnie zaprojektowana pod desktop.
Przegląd wszystkich widoków wykazał, że responsywność praktycznie nie istnieje —
tylko `nav.component.scss` używa `@media`. Reszta opiera się na sztywnych
szerokościach (modale `800px`, `flex-basis` `45%/48%/30%`, `$pagePadding: 40px`)
i szerokich tabelach PrimeNG (Zlecenia ~30 kolumn), które na tablecie i telefonie
się rozjeżdżają.

Cel: dwa jasno rozdzielone układy sterowane jednym breakpointem `1020px`.

**Decyzje projektowe:**
- **Dwa poziomy media, jeden próg — `1020px`:**
  - **Układ 1 — `max-width: 1020px`** (telefon + tablet): nowy, uproszczony układ mobilny.
  - **Układ 2 — `min-width: 1020.02px`** (laptop + duży ekran): widoki **bez zmian**, dokładnie jak dziś zaimplementowane.
- **Desktop-first:** obecny CSS pozostaje bazą (= układ 2). Cała responsywność
  to **nadpisania w bloku `@media (max-width: 1020px)`** dla układu 1. Nie ruszamy
  stylów desktopowych — dzięki temu układ 2 gwarantowanie zostaje taki jak obecnie.
- Zmienne: **tylko SCSS**. Bez CSS custom properties.

---

## 1. Breakpoint

| Układ | Warunek | Urządzenia | Charakterystyka |
|---|---|---|---|
| **Układ 1** | `@media (max-width: 1020px)` | telefon, tablet | karty/badge zamiast tabel, formularze i przyciski w kolumnie, inputy 100% |
| **Układ 2** | powyżej `1020px` (baza, bez media) | laptop, duży ekran | **stan obecny aplikacji — bez zmian** |

Uwaga na granicę: żeby uniknąć nakładania się z ewentualnym `min-width`, granicę
układu 2 opisujemy jako `1020.02px`. W praktyce cały układ 2 to po prostu istniejący
CSS bez media-query, a układ 1 to `max-width: 1020px`.

---

## 2. Fundament (foundation)

`src/assets/styles/_variables.scss` — jeden próg:

```scss
// media-query — pojedynczy próg rozdzielający dwa układy
$layout-breakpoint: 1020px;
```

`src/assets/styles/_mixins.scss` — mixin dla układu 1 (desktop-first, max-width):

```scss
// Układ 1: telefon + tablet (do 1020px włącznie).
// Zawartość jest nadpisaniem bazy (= układu 2 / desktop).
@mixin layout-mobile {
  @media screen and (max-width: $layout-breakpoint) {
    @content;
  }
}
```

Migracja istniejących `@media` w `nav.component.scss` (klucze `medium`/`large`) —
sprowadzić do jednego progu `layout-mobile` lub pozostawić, jeśli nawigacja ma
własne, drobniejsze progi (do decyzji przy implementacji; nie blokuje reszty).

---

## 3. Układ 1 — szczegóły (`max-width: 1020px`)

### 3.1 Tabele → karty (div/badge)

Zamiast tabel PrimeNG na widokach z listami (**orders-page**, w miarę potrzeby
customers/docs) renderujemy **listę kart**. Każda karta jednego zlecenia pokazuje
skrótowo:

- **data załadunku**,
- **data rozładunku**,
- **numer zlecenia**,
- **skąd → dokąd** (miejsce załadunku → miejsce rozładunku),
- przycisk **„Pokaż / ukryj szczegóły”**.

Kliknięcie „Pokaż szczegóły” otwiera **pełne zlecenie w modalu** (`show-order-modal`),
i **dopiero tam** dostępne są akcje: podgląd, **edycja, usuwanie**, pobranie PDF itd.
Karta sama w sobie jest tylko skrótem — nie zawiera akcji edycyjnych inline.

Implementacja:
- W szablonie listy (`orders-page.component.html`) dodać alternatywny widok kart,
  przełączany klasą/`*ngIf` sterowanym CSS-owo (tabela ukryta w układzie 1, karty
  ukryte w układzie 2) — najprościej dwa bloki, każdy widoczny w swoim układzie.
- Karta = `div` z „badge"ami” (data zał./rozł., nr zlecenia) + linia „skąd → dokąd”
  + przycisk otwierający modal (ten sam mechanizm co dziś: `ModalService` +
  akcja/selektor wybranego zlecenia).
- Dane do karty czerpiemy z istniejącego `IOrder` (`orderDetails` — miejsca i daty,
  `orderNumber`). Brak nowych pól w modelu.

### 3.2 Formularze i inputy — układ kolumnowy

W całym układzie 1:
- **wszystkie formularze** ustawione **z góry na dół** (jedno pole pod drugim),
- **wszystkie inputy** mają **szerokość 100%**,
- **wszystkie przyciski** również w kolumnie (jeden pod drugim), pełna szerokość
  (lub blokowo), bez układu w rząd.

Dotyczy w szczególności:
- `add-order-page` — sekcje `forms__customer .item-wrapper`,
  `add-order-form-wrapper__pickup/__delivery/__goods/__driver`,
  `add-condition-form-wrapper__require/__payment`: `flex-basis 45%/48%/30%` →
  nadpisane na `100%` w `layout-mobile`. Kroki `.p-menuitem-link` (`200px`) →
  elastyczne / pełna szerokość.
- modale z formularzami (`add-customer-modal`, `edit-customer-modal`,
  `login-modal`, `register-modal`, `docs-modal`, `add-doc-only-modal`,
  `get-customer-modal`): `width: 800px` → `width: 100%` w układzie 1; pola i
  przyciski w kolumnie, inputy 100%.
- toolbary list (przyciski + wyszukiwarka) → stack (kolumna), pełna szerokość.

### 3.3 Modale

- Szerokość modali w układzie 1: `width: 100%` (z rozsądnym marginesem/`max-width`),
  zawartość w jednej kolumnie.
- `show-order-modal`: sekcja „sides” (Zleceniodawca / Zleceniobiorca) → stack
  (jedna pod drugą) w układzie 1; wewnętrzne tabele w kontenerze ze scrollem
  poziomym; zweryfikować `scale(0.8)` podglądu wydruku na wąskim ekranie.

### 3.4 Strona / padding

- `_pages.scss` `.page-wrapper`: w `layout-mobile` mniejszy padding (np. `16px`),
  baza (układ 2) bez zmian (`$pagePadding: 40px`).

---

## 4. Układ 2 — bez zmian

Wszystkie widoki laptop/desktop pozostają dokładnie takie, jak obecnie
zaimplementowane. Nie dodajemy dla nich nowych stylów — to jest baza CSS.
Jedyny warunek: nowe reguły układu 1 muszą żyć **wyłącznie** wewnątrz
`@include layout-mobile { … }`, żeby nie wyciekły do układu 2.

---

## 5. Wzorzec użycia (przykład)

```scss
@import "mixins";

// baza = układ 2 (desktop) — bez zmian
.add-order-form-wrapper__pickup {
  flex-basis: 48%;
}

// nadpisanie tylko dla układu 1
@include layout-mobile {
  .add-order-form-wrapper__pickup {
    flex-basis: 100%;
  }
}
```

Lista zleceń — dwa widoki obok siebie w szablonie:

```html
<!-- Układ 2: obecna tabela -->
<div class="orders-table">…p-table…</div>

<!-- Układ 1: karty -->
<div class="orders-cards">
  <div class="order-card" *ngFor="let o of orders">
    <span class="badge">Zał.: {{ o.orderDetails.pickupDate }}</span>
    <span class="badge">Rozł.: {{ o.orderDetails.deliveryDate }}</span>
    <span class="badge">Nr: {{ o.orderNumber }}</span>
    <div class="route">{{ pickupPlace }} → {{ deliveryPlace }}</div>
    <button (click)="openOrder(o)">Pokaż szczegóły</button>
  </div>
</div>
```

```scss
.orders-cards { display: none; }
@include layout-mobile {
  .orders-table { display: none; }
  .orders-cards { display: flex; flex-direction: column; gap: 12px; }
}
```

---

## 6. Pliki do zmiany (implementacja)

- `src/assets/styles/_variables.scss` — `$layout-breakpoint: 1020px`.
- `src/assets/styles/_mixins.scss` — mixin `layout-mobile`, migracja `nav`/`links`.
- `src/assets/styles/_pages.scss` — padding strony w układzie 1.
- `src/app/nav/nav.component.scss` — sprowadzenie media-query do progu 1020.
- `src/app/pages/orders-page/…` (`.scss` + `.html`/`.ts`) — widok kart dla układu 1,
  przycisk „Pokaż szczegóły” otwierający `show-order-modal`.
- `src/app/pages/add-order-page/add-order-page.component.scss` — kolumna, inputy 100%.
- `src/app/show-order-modal/…scss` — stack sekcji, modal 100%, scroll tabel wewnątrz.
- `src/app/{add-customer-modal,edit-customer-modal,shared/modal}/…scss` — modale 100%,
  formularze w kolumnie, inputy 100%.
- (opcjonalnie) `customers-page`, `docs-page` — analogicznie karty/scroll, jeśli
  potrzebne.

---

## 7. Weryfikacja

- `npm start` → DevTools tryb responsywny:
  - **≤ 1020px** (np. 375px, 768px, 1020px): widok kart zamiast tabeli, formularze
    w jednej kolumnie, inputy i przyciski 100%, „Pokaż szczegóły” otwiera modal.
  - **> 1020px** (np. 1280px, 1440px): widok **identyczny jak dziś**.
- Brak poziomego przewijania strony w układzie 1 (poza celowym scrollem tabel w modalu).
- `npm run build` — kompilacja SCSS bez błędów.
