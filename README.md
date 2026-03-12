# 📱 TP_Groupe_ReactNative

## 📖 Présentation

Objectif :
Créer une application mobile **Expo / React Native** permettant de capturer des moments, de les stocker localement et de les retrouver via une interface intuitive (Carte, Calendrier, Galerie).

### Fonctionnalités principales

* 📷 **Capture & Stockage** : Prise de photos avec localisation GPS et sauvegarde SQLite.
* 🗺 **Carte Interactive** : Visualisation des souvenirs sur une carte avec regroupement par markers.
* 📅 **Explorateur Temporel** : Calendrier personnalisé pour filtrer les photos par date.
* 🖼 **Galerie Intelligente** : Recherche textuelle, filtrage par distance et défilement infini (pagination).
* 👤 **Profil & Stats** : Statistiques calculées en SQL (distance max, jours actifs).

---

# ⚙️ Installation & Lancement

## Pré-requis

* Node.js LTS
* npm
* Expo CLI
* appareil physique ou émulateur

---

## Installation des dépendances

```bash
npx expo install expo-location
npx expo install react-native-maps
npx expo install expo-device
npx expo install expo-router
npx expo install expo-camera
npx expo install expo-sqlite
npx expo install react-native-calendars
```

---

## Lancer le projet

```bash
npx expo start
```

Puis :

* scanner le QR code avec **Expo Go**
* ou utiliser un **simulateur Android/iOS**

---

# 🔑 Variables d’environnement

Créer un fichier `.env` à la racine :

```env
API_KEY_GOOGLE=VOTRE_CLE
```

Cette clé permet d’utiliser **Google Maps sur Android et iOS**.

---

# 🗺 Configuration Google Maps

Le fichier `app.config.js` lit le `.env` et injecte la clé dans la configuration Expo.

### Android

```
android.config.googleMaps.apiKey
```

### iOS

```
ios.config.googleMapsApiKey
```

Les plugins Expo sont centralisés dans :

```
app.plugins.js
```

Puis injectés automatiquement par :

```
app.config.js
```

---

# ⚠️ Problème rencontré

Le package :

```
react-native-maps

```

(version **1.20.1 / SDK 54**)

ne fournit **pas de config plugin Expo**.

Conséquence :

* il ne peut pas être géré via `app.plugins.js`
* la clé Google Maps doit rester injectée via `app.config.js`

---

Le package :

```
expo-sqlite

```

(version SDK 54) nécessite une configuration complexe pour le support Web.
Conséquence :

ne fournit **pas de config plugin Expo**.

Conséquence :

* L'utilisation de openDatabaseSync est optimisée pour le natif (iOS/Android).
* Solution choisie : L'application restreint l'usage de la DB aux plateformes mobiles via Platform.OS !== 'web'.

---

# 🧭 Architecture

## Navigation principale

L’application utilise **Expo Router + React Navigation**.

```
Tabs
│
├── 📷 Camera       -> Capture de souvenirs
├── 🗺 Map          -> Visualisation géographique
├── 📅 Calendar     -> Navigation par date (Custom Calendar)
├── 🖼 Photos       -> Galerie avec recherche et filtres
└── 👤 Profile      -> Statistiques et gestion utilisateur
      │
      └── Drawer Navigator
            ├── Profile
            └── Logout
    PhotoDetails
```

---

## Structure navigation

```
Tabs
Map -> app/(tabs)/map.tsx -> components/MapComponent.tsx
Camera -> app/(tabs)/camera.tsx
Profile -> app/(tabs)/profile/index.tsx
```

---

# 📁 Architecture du projet

## Schéma services et données

```
UI
MapComponent -> utils/location.js -> expo-location
MapComponent -> services/database.ts -> expo-sqlite
ProfileScreen -> services/database.ts -> expo-sqlite
PhotoDetail -> services/database.ts -> expo-sqlite
PhotosScreen    -> services/database.ts   -> expo-sqlite
CalendarScreen  -> services/database.ts   -> expo-sqlite
```

---

## Schéma composants

```
app/(tabs)/map.tsx
  -> components/MapComponent.tsx

app/(tabs)/calendar.tsx
  -> components/CustomCalendar.tsx
  -> components/PhotoCard.tsx
  -> components/EditPhotoModal.tsx

app/(tabs)/photos.tsx
  -> components/PhotoCard.tsx (Réutilisation)

app/(tabs)/profile/index.tsx

app/(tabs)/camera/index.tsx
```

---

# 🗂 Structure des fichiers

```
app/
 ├── (tabs)
 │    ├── camera.tsx
 │    ├── map.tsx
 │    ├── calendar.tsx
 │    ├── photos.tsx
 │    └── profile
 │         ├── index.tsx
 │         └── logout.tsx
     PhotoDetail.tsx
 │
components/
 └── MapComponent.tsx
     PhotoComponent.tsx
     EditPhotoModal.tsx
     Customcalendar.tsx

services/
 ├── database.ts
 └── photo.ts
     map.ts

utils/
 └── location.js
```

---

# 📊 Modèles de données

## Photo

Fichier :

```
services/photo.ts
```

Structure :

```
id
uri
name
description
latitude
longitude
takenAt
```


## Map

Fichier :
```
services/map.ts
```

Structure :
```
markers?: Photo[];
initialRegion?: MapRegion;



```
---


## User

Fichier :

```
services/database.ts
```

Structure :

```
id
username
email
```

---

## Calendrier

Fichier :
```
services/database.ts
```

Structure :
```
[date: string]: {
  marked: boolean;
  dotColor: string;
  selected?: boolean;
  selectedColor?: string;
}


```
---

## Filtres Galerie

Fichier :
```
services/photo.ts
```

Structure :
```
id: number;
uri: string;
name?: string;
description?: string;
latitude: number;
longitude: number;
takenAt: string;


```
---

# 🖥 Écrans de l'application

## Map

Fichier :

```
app/(tabs)/map.tsx
```

Fonction :

* afficher la carte
* afficher les markers des photos
* recentrer sur l’utilisateur

---

## Profile

Fichier :

```
app/(tabs)/profile/index.tsx
```

Fonction :

* afficher les informations utilisateur
* éditer username et email
* afficher les statistiques

---

## Camera

Fichier :

```
app/(tabs)/camera/index.tsx
```

Fonction :

* prendre une photo
* éditer username et email
* afficher les statistiques

---

## Calendrier

Fichier :

```
app/(tabs)/calendar.tsx
```

Fonction :

* naviguer à travers les souvenirs par date
* visualiser les jours d'activité grâce au marquage dynamique
* afficher une liste détaillée des photos pour le jour sélectionné
* éditer ou supprimer des photos directement depuis la vue temporelle

---

## Photos (Galerie)

Fichier :

```
app/(tabs)/photos.tsx
```

Fonction :

* afficher l'intégralité des photos sous forme de grille optimisée
* filtrer les souvenirs par recherche textuelle ou par proximité (km)
* trier dynamiquement les photos (plus récentes ou plus anciennes)
* charger les images progressivement via un système de pagination (infinite scroll)

---

# 🔌 Services / API

## SQLite

Fichier :

```
services/database.ts
```

Utilisé pour :

* stocker les photos
* stocker les informations utilisateur

---

## Localisation

Fichier :

```
utils/location.js
```

Utilise :

```
expo-location
```

Permet :

* récupérer la position GPS
* recentrer la carte

---

# 🧩 Composants natifs

## Carte

Package :

```
react-native-maps
```

Composants :

* MapView
* Marker

---

## Localisation

Package :

```
expo-location
```

Utilisé pour :

* récupérer latitude / longitude
* centrer la carte

---

## Camera 

Package :

```
expo-camera
```

Utilisé pour :

- accéder à la caméra de l'appareil
- prendre des photos
- afficher un aperçu de la caméra

Composants :

- CameraView
- useCameraPermissions

---

## Calendrier 

Package :

```
react-native-calendars
```

Utilisé pour :

- afficher une interface de navigation par date
- marquer les jours contenant des photos (dots)
- gérer la sélection et le changement de mois

Composants :

- Calendar
- LocaleConfig (Configuration de la langue)

---

## Router 

Package :

```
expo-router
```


Utilisé pour :

- gérer la navigation de l'application
- organiser les routes à partir de la structure des fichiers
- naviguer entre les écrans avec `router.push`

---

## SqLite

Package :

```
expo-sqlite
```

Utilisé pour :
stocker les photos localement
enregistrer les informations utilisateur
calculer les statistiques du profil

---

## Devise

Package :

```
expo-device
```

Utilisé pour :
récupérer des informations sur l'appareil
adapter certains comportements selon le device

---




# 🗺 Implémentation Map

Fonctionnalités :

* affichage carte avec provider **Google Maps sur Android**
* récupération des photos depuis **SQLite**
* fusion markers (props + base)
* suppression des doublons par **id**

### Comportement

* fit automatique sur les markers
* recentrage sur position utilisateur
* navigation vers détail photo

Navigation utilisée :

```
router.push
```

---

# 👤 Implémentation Profile

Fonctionnalités :

* lecture utilisateur depuis SQLite
* modification username / email
* sauvegarde locale

### Statistiques calculées

* nombre total de photos
* jour le plus actif
* distance maximale entre photos

Calcul distance :

```
formule de Haversine
```

---

# 📷   Implémentation Camera

Fonctionnalités :

* prendre une photo
* choisir une photo depuis la galerie
* récupérer les coordonnées GPS
* sauvegarder dans SQLite


---

# 📅 Implémentation Calendrier 

Fonctionnalités :
* Affichage d'un calendrier interactif via `react-native-calendars`.
* **Marquage dynamique** : Les dates contenant des souvenirs sont marquées d'un point grâce à `photoDatabase.getMarkedDates()`.
* **Filtrage temporel** : Mise à jour en temps réel de la liste des photos lors de la sélection d'un jour.

### Détails techniques
* **Localisation** : Configuration intégrale en français (mois, jours).
* **Optimisation** : Utilisation de `useMemo` pour fusionner les marques de la base de données avec le style de la date sélectionnée sans recalculs inutiles.
* **Gestion d'état** : Synchronisation entre la date sélectionnée et l'affichage des `PhotoCard` via `useEffect`.

---

# 🖼 Implémentation Galerie

Fonctionnalités :
* Affichage en grille (3 colonnes) avec rendu performant.
* **Recherche & Filtres** : Recherche par texte (date/lieu) et filtrage par distance géographique.
* **Tri dynamique** : Bascule entre un affichage chronologique croissant ou décroissant.

### Optimisations Performance
* **Pagination (Infinite Scroll)** : Implémentation d'un chargement par lots (`PAGE_SIZE = 12`) avec `onEndReached` pour éviter la surcharge mémoire.
* **Calculs mémorisés** : Le filtrage et le tri sont encapsulés dans un `useMemo` pour garantir la fluidité de l'interface même avec un grand volume de photos.
* **Rafraîchissement** : Utilisation de `useFocusEffect` pour recharger les données dès que l'utilisateur revient sur l'onglet Galerie.

---

# 🔄 Flux de fonctionnement

## Prendre une photo

1. ouvrir la caméra
2. capturer la photo
3. récupérer la localisation GPS
4. afficher un aperçu
5. sauvegarder dans SQLite

---

## Choisir une photo

1. ouvrir la galerie
2. sélectionner une image
3. récupérer GPS
4. afficher aperçu
5. sauvegarder SQLite

---

## 🧠 Concepts techniques utilisés

### React
* **useState** : Gestion des états locaux (photos, recherche, date sélectionnée).
* **useEffect** : Synchronisation initiale avec la base de données.
* **useFocusEffect** : Rafraîchissement automatique des données lors du retour sur un onglet.
* **useMemo** : Optimisation des performances pour le filtrage de la galerie et le marquage du calendrier.
* **useCallback** : Mémorisation des fonctions pour éviter des rendus inutiles.
* **useRef** : Référence aux composants (Camera, Map).

### Expo
* **expo-camera** : Interface de prise de vue native.
* **expo-location** : Géocodage et positionnement GPS.
* **expo-sqlite** : Persistance des données en SQL local.
* **expo-device** : Informations sur le matériel utilisé.

### Bibliothèques Tierces
* **react-native-calendars** : Gestion de l'affichage et de la navigation temporelle.
* **lucide-react-native** : Bibliothèque d'icônes pour l'interface utilisateur.

### Navigation
* **Expo Router** : Navigation typée basée sur la structure des fichiers.
* **React Navigation** : Gestion des onglets (Tabs) et du tiroir latéral (Drawer).




# Tableau des tâches

# 📊 Tableau des tâches

┌──────────┬──────────────────┬─────────────────────┐
│ Personne │ Fonctionnalité 1 │ Fonctionnalité 2    │
├──────────┼──────────────────┼─────────────────────┤
│ Jason    │ Navigation       │ Camera              │
├──────────┼──────────────────┼─────────────────────┤
│ Romain   │ Map              │ Profil              │
├──────────┼──────────────────┼─────────────────────┤
│ Yanis    │ Calendrier       │ Galerie & Filtres   │
└──────────┴──────────────────┴─────────────────────┘