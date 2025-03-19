# Weather App 🌤️

Ce projet a été réalisé dans le cadre de mon apprentissage de React. L'objectif était de créer une application web de météo en utilisant une API gratuite, WeatherApi.

## Objectif du projet 🎯

L'idée était de développer une application web responsive qui affiche la météo pour différents appareils, similaire aux applications mobiles.

## Fonctionnalités ✨

- 🌐 Récupération des données météo via l'API WeatherApi.
- 🌡️ Affichage de la météo actuelle pour la ville de Lyon.
- 📅 Affichage des prévisions météo pour les 5 prochains jours.
- 🖱️ Possibilité de cliquer sur un jour pour afficher les détails de la météo de ce jour.
- 📍 Géolocalisation de l'utilisateur pour afficher la météo de sa position actuelle.
- 🔍 Ajouter une option pour saisir manuellement le nom de la ville.
- 🏙️ Afficher plusieurs villes en même temps et conserver ces villes en mémoire avec `localStorage`.
- 📊 Afficher les températures de la journée sous forme de graphiques.

## Composants 🧩

L'application est structurée en plusieurs composants React :

- `Header.js` : Affiche le header de l'application.
- `Weather.js` : Affiche les données météo actuelles.
- `Days.js` : Affiche les prévisions pour les 5 prochains jours.

## Communication entre composants 🔄

Les composants communiquent entre eux via les props, permettant de passer les données nécessaires d'un composant à un autre.

## Utilisation de l'API OpenWeatherMap 🌐

Pour récupérer les données météo, nous utilisons l'API OpenWeatherMap. Cela nous permet d'obtenir les informations nécessaires telles que la température, l'icône de la météo et la vitesse du vent.


Ce projet m'a permis de me familiariser avec React et de comprendre comment structurer une application en composants, gérer l'état et utiliser une API externe pour récupérer des données.
