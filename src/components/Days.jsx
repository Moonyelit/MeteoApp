import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Weather.css";

const Days = ({ city, onSelectDay }) => {
  // États pour gérer les prévisions météo, le chargement et les erreurs
  const [forecast, setForecast] = useState([]); // Stocke les prévisions des prochains jours
  const [loading, setLoading] = useState(true); // Indique si les données sont en train de charger
  const [error, setError] = useState(null); // Stocke les éventuelles erreurs

  // 🌦️ Récupère les prévisions météo pour les 5 prochains jours
  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        if (!apiKey) throw new Error("Clé API manquante !");

        const response = await axios.get(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&lang=fr&aqi=no`
        );

        setForecast(response.data.forecast.forecastday); // Stocke les prévisions dans l'état
      } catch (error) {
        console.error("Erreur lors de la récupération des prévisions :", error);
        setError(error.message); // Stocke l'erreur
      } finally {
        setLoading(false); // Fin du chargement
      }
    };

    fetchForecast();
  }, [city]); // 📌 Se déclenche à chaque changement de ville

  // ⏳ Affichage du message de chargement
  if (loading) return <p className="text-center text-white">Chargement des prévisions...</p>;
  // ❌ Affichage du message d'erreur en cas de problème
  if (error) return <p className="text-center text-red-500">Erreur : {error}</p>;

  return (
    <div className="forecast-container">
      {/* 🔽 Liste des prévisions météo pour les prochains jours */}
      {forecast.map((day, index) => (
        <div
          key={index}
          className="forecast-day"
          onClick={() => onSelectDay(day)} // 🔄 Met à jour le jour sélectionné dans Weather.jsx
        >
          {/* 📅 Affiche le jour de la semaine */}
          <p className="date">
            {new Date(day.date).toLocaleDateString("fr-FR", {
              weekday: "long",
            })}
          </p>
          {/* 🌥️ Icône météo du jour */}
          <img
            src={day.day.condition.icon}
            alt="weather icon"
            className="forecast-icon"
          />
          {/* 🌡️ Température moyenne du jour */}
          <p className="temp">{day.day.avgtemp_c}°C</p>
          {/* ☁️ Condition météo (ex: "Nuageux", "Ensoleillé", etc.) */}
          <p className="condition">{day.day.condition.text}</p>
        </div>
      ))}
    </div>
  );
};

export default Days;
