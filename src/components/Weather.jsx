import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Weather.css";
import Days from "./Days";
import SearchBar from "./SearchBar";
import HourlyChart from "./HourlyChart";

const Weather = () => {
  // États pour stocker les données météo, la ville, et gérer les chargements et erreurs
  const [weather, setWeather] = useState(null); // Stocke les données météo
  const [loading, setLoading] = useState(true); // Indique si les données sont en cours de chargement
  const [error, setError] = useState(null); // Stocke les erreurs s'il y en a
  const [city, setCity] = useState("Paris"); // Définit la ville par défaut à Paris

  // 📍 Géolocalisation : Récupère la position GPS de l'utilisateur et détermine sa ville
  useEffect(() => {
    const fetchLocation = () => {
      if ("geolocation" in navigator) { // Vérifie si le navigateur supporte la géolocalisation
        navigator.geolocation.getCurrentPosition(
          async (position) => { // Si l'utilisateur accepte, récupère latitude et longitude
            const { latitude, longitude } = position.coords;
            try {
              const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
              const response = await axios.get(
                `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&lang=fr`
              );
              setCity(response.data.location.name); // Met à jour la ville avec celle détectée
            } catch (error) {
              console.error("Erreur lors de la récupération de la localisation :", error);
              setCity("Paris"); // Si l'API échoue, reste sur Paris
            }
          },
          (error) => { // Si l'utilisateur refuse, on reste sur Paris
            console.warn("Géolocalisation refusée ou erreur :", error);
            setCity("Paris");
          }
        );
      } else {
        console.warn("Géolocalisation non supportée par le navigateur.");
      }
    };

    fetchLocation();
  }, []); // 📌 Exécuté uniquement au premier chargement de la page

  // 🌦️ Récupère les données météo pour la ville sélectionnée
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        if (!apiKey) throw new Error("Clé API manquante !");

        // Appel API pour récupérer la météo actuelle et les prévisions
        const response = await axios.get(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&lang=fr&aqi=no&hours=24`
        );

        setWeather(response.data); // Met à jour les données météo
      } catch (error) {
        console.error("Erreur lors de la récupération des données météo :", error);
        setError(error.message); // Stocke l'erreur
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchWeather();
  }, [city]); // 📌 Se déclenche à chaque changement de ville

  // 🔎 Fonction pour gérer la recherche d'une ville via la barre de recherche
  const handleSearch = (newCity) => {
    setCity(newCity); // Met à jour la ville sélectionnée
  };

  // 🗓️ Stocke le jour sélectionné dans l'affichage détaillé
  const [selectedDay, setSelectedDay] = useState(null);

  // ⏳ Affichage du message de chargement
  if (loading) return <p className="text-center text-white">Chargement...</p>;
  // ❌ Affichage d'un message en cas d'erreur
  if (error) return <p className="text-center text-red-500">Erreur : {error}</p>;

  return (
    <div className="weather-container">
      {/* 🔎 Barre de recherche pour changer de ville */}
      <SearchBar onSearch={handleSearch} /> 

      {/* 📌 Carte météo principale */}
      <div className="weather card">
        <div className="card-content">
          {/* 📍 Affichage du nom de la ville */}
          <h2>{weather.location.name}</h2>

          {/* 🌥️ Image de la météo du jour ou du jour sélectionné */}
          <img
            src={selectedDay ? selectedDay.day.condition.icon : weather.current.condition.icon}
            alt="weather icon"
          />

          {/* 🌡️ Température actuelle ou du jour sélectionné */}
          <span className="temperature">
            {selectedDay ? selectedDay.day.avgtemp_c : weather.current.temp_c}°C
          </span>

          {/* 📊 Affichage du graphique des températures horaires */}
          {!selectedDay ? (
            <HourlyChart forecast={weather.forecast} />
          ) : selectedDay.hour ? (
            <HourlyChart forecast={{ forecastday: [selectedDay] }} />
          ) : (
            <p className="text-center text-gray-400">
              📊 Données horaires non disponibles pour ce jour.
            </p>
          )}

          {/* 🌦️ Détails de la météo (conditions, vent, humidité, pression) */}
          <p>{selectedDay ? selectedDay.day.condition.text : weather.current.condition.text}</p>
          <p>🌬️ Vent: {selectedDay ? selectedDay.day.maxwind_kph : weather.current.wind_kph} km/h</p>
          <p>💧 Humidité: {selectedDay ? selectedDay.day.avghumidity : weather.current.humidity}%</p>
          <p>🔽 Pression: {selectedDay ? selectedDay.day.pressure_mb || "N/A" : weather.current.pressure_mb} hPa</p>
          <p>🌡️ Température ressentie: {selectedDay ? "N/A" : weather.current.feelslike_c}°C</p>
        </div>
      </div>

      {/* 📅 Liste des jours à venir avec possibilité de sélectionner un jour */}
      <Days city={city} onSelectDay={setSelectedDay} />
    </div>
  );
};

export default Weather;
