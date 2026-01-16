# Mode Maintenance - Telemetry Dashboard

## 🔒 Système de Protection Pré-Livraison

Ce système empêche l'accès au dashboard avant la date de livraison officielle.

## 📅 Configuration

### Modifier la date de livraison

Édite les fichiers suivants et change la date:

1. **middleware.ts** (ligne 5):
```typescript
const DELIVERY_DATE = new Date('2026-01-31T00:00:00');
```

2. **app/maintenance/page.tsx** (ligne 17):
```typescript
const deliveryDate = new Date('2026-01-31T00:00:00');
```

## 🔑 Accès Développeur

Pour accéder au système même avant la date de livraison:

### Option 1: Via Cookie (Recommandé)
1. Ouvre la console du navigateur (F12)
2. Va dans l'onglet "Console"
3. Exécute:
```javascript
document.cookie = "dev_access=dev_access_2026; path=/; max-age=31536000";
```
4. Rafraîchis la page

### Option 2: Modifier le middleware
Dans `middleware.ts`, commente temporairement la vérification de date:
```typescript
// if (now >= DELIVERY_DATE) {
    return NextResponse.next();
// }
```

## 🚀 Activation/Désactivation

### Pour ACTIVER le mode maintenance:
1. Assure-toi que la date dans `middleware.ts` est dans le futur
2. Déploie sur Vercel:
```bash
git add .
git commit -m "feat: Enable maintenance mode"
git push
vercel --prod
```

### Pour DÉSACTIVER le mode maintenance:

**Option A: Changer la date**
1. Mets une date dans le passé dans `middleware.ts` et `app/maintenance/page.tsx`
2. Déploie

**Option B: Supprimer le middleware**
1. Renomme `middleware.ts` en `middleware.ts.disabled`
2. Déploie

**Option C: Modifier le middleware**
Dans `middleware.ts`, remplace tout par:
```typescript
import { NextResponse } from 'next/server';
export function middleware() {
    return NextResponse.next();
}
export const config = { matcher: [] };
```

## 📝 Exemple d'utilisation

### Scénario: Livraison prévue le 31 janvier 2026

1. **Aujourd'hui (16 janvier)**: Active le mode maintenance
   - Date dans middleware: `2026-01-31T00:00:00`
   - Le client voit la page de maintenance avec compte à rebours

2. **Pendant le développement**: Utilise le cookie dev_access pour tester

3. **31 janvier 2026**: Le système s'active automatiquement
   - Aucune action requise
   - Le middleware laisse passer automatiquement

4. **Après livraison**: Optionnel - supprime le middleware pour nettoyer le code

## ⚠️ Important

- **Ne commit JAMAIS** de vraie clé d'accès dans le code
- Change `DEVELOPER_ACCESS_KEY` pour chaque projet
- Teste toujours en local avant de déployer
- Garde une copie de la date de livraison dans tes notes

## 🔄 Déploiement

```bash
# 1. Vérifie les changements
git status

# 2. Commit
git add middleware.ts app/maintenance/
git commit -m "feat: Add maintenance mode with delivery date"

# 3. Push vers GitHub
git push

# 4. Déploie sur Vercel
vercel --prod
```

## 📞 Support

Pour toute question, contacte JC Soft Labs.
