---
name: sync-reviews
description: >
  Haalt nieuwe Google reviews op van het Google Business profiel van audio.rikdewit.nl
  via Playwright en voegt nieuwe reviews toe aan components/Reviews.tsx.
  Gebruik als je zegt: "sync reviews", "haal reviews op", "update reviews", of "/sync-reviews".
---

# Skill: Sync Google Reviews

Haal nieuwe Google reviews op van het bedrijfsprofiel en voeg ze toe aan `components/Reviews.tsx`.

## Stappen

### 0. Stel de huidige datum vast

Voer uit: `date +%Y-%m-%d` via Bash. Gebruik deze datum als referentie voor het omrekenen van relatieve datums ("2 weken geleden", "een maand geleden", etc.) naar absolute `YYYY-MM-DD` datums.

### 1. Open het Google Business profiel via Playwright

Gebruik de Playwright MCP tool `browser_navigate` om naar deze URL te gaan:

```
https://share.google/tD5HfxZNP8AAnJb9B
```

Wacht tot de pagina volledig geladen is (`browser_wait_for`).

### 2. Ga naar het reviews-tabblad

Maak een snapshot (`browser_snapshot`) en zoek de "Reviews" of "Beoordelingen" tab.
Klik erop en wacht tot de reviews geladen zijn.

Scroll daarna meerdere keren naar beneden (`browser_evaluate` met `window.scrollBy`) om alle reviews te laden. Herhaal dit 3-5 keer met een wacht-moment tussendoor.

### 3. Extraheer de reviews via evaluate

Gebruik `browser_evaluate` om alle reviews te scrapen:

```js
(() => {
  const reviews = [];
  document.querySelectorAll('[data-review-id], [jslog*="review"]').forEach(el => {
    // probeer naam, rating en tekst te lezen
  });
  return reviews;
})()
```

Als dat niet werkt, gebruik dan `browser_snapshot` en lees de tekst handmatig uit de YAML-structuur.

Per review verzamel je:
- `displayName` — naam van de auteur
- `rating` — aantal sterren (1–5, te lezen uit aria-labels of sterren-icoontjes)
- `text` — de recensietekst (leeg laten als er geen tekst is)
- `publishDate` — publicatiedatum in `YYYY-MM-DD` formaat. Google toont relatieve datums ("2 weken geleden", "een maand geleden") — reken deze om naar een absolute datum op basis van de datum uit stap 0.

**Sla reviews met een rating van 3 of lager over.** Voeg alleen reviews toe met rating 4 of 5.

**Kopieer de tekst van elke review exact zoals die op Google staat.** Wijzig geen woorden, interpunctie, hoofdletters of zinsvolgorde. Als een review een "Meer weergeven" knop heeft, klik die dan eerst aan zodat de volledige tekst zichtbaar is voordat je kopieert.

### 4. Vergelijk met bestaande reviews

Lees `components/Reviews.tsx`. De bestaande reviews staan in de `REVIEWS` const array.

Een review is **nieuw** als er geen bestaande entry is met dezelfde `displayName` én `publishDate`.

### 5. Voeg nieuwe reviews toe

Voeg nieuwe reviews **bovenaan** de `REVIEWS` array in, gesorteerd op datum (nieuwste bovenaan).

Format voor een review mét tekst:
```ts
{
  authorAttribution: { displayName: 'Naam' },
  rating: 5,
  text: {
    text: 'De recensietekst...',
    languageCode: 'nl',
  },
  publishDate: '2026-05-26',
},
```

Format voor een review zonder tekst:
```ts
{
  authorAttribution: { displayName: 'Naam' },
  rating: 5,
  publishDate: '2026-05-26',
},
```

### 6. Rapporteer

Sluit af met een samenvatting:
- Hoeveel nieuwe reviews zijn toegevoegd
- Namen van de nieuwe reviewers
- Of er geen nieuwe reviews waren

Vraag daarna of de gebruiker wil committen en pushen.
