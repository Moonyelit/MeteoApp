import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Weather.css"; // <-- Ton fichier Weather.css
import Days from "./Days";
import SearchBar from "./SearchBar";
import HourlyChart from "./HourlyChart";

const Weather = () => {
  // États
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState("Paris");
  const [selectedDay, setSelectedDay] = useState(null);

  // Géolocalisation
  useEffect(() => {
    const fetchLocation = () => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
              const response = await axios.get(
                `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${latitude},${longitude}&lang=fr`
              );
              setCity(response.data.location.name);
            } catch (error) {
              console.error("Erreur lors de la récupération de la localisation :", error);
              setCity("Paris");
            }
          },
          (error) => {
            console.warn("Géolocalisation refusée ou erreur :", error);
            setCity("Paris");
          }
        );
      } else {
        console.warn("Géolocalisation non supportée par le navigateur.");
      }
    };

    fetchLocation();
  }, []);

  // Récupération météo
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
        if (!apiKey) throw new Error("Clé API manquante !");
        const response = await axios.get(
          `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&lang=fr&aqi=no&hours=24`
        );
        setWeather(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des données météo :", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [city]);

  // Gestion de la recherche
  const handleSearch = (newCity) => {
    setCity(newCity);
    setSelectedDay(null);
  };

  // Affichage du chargement / erreur
  if (loading) return <p className="text-center text-white">Chargement...</p>;
  if (error) return <p className="text-center text-red-500">Erreur : {error}</p>;

  return (
    <div className="weather-container fade-in">
      {/* Barre de recherche */}
      <SearchBar onSearch={handleSearch} />

      {/* Carte météo */}
      <div className="weather card">
        <div className="card-content">
          <h2>{weather.location.name}</h2>
          <img
            src={
              selectedDay
                ? selectedDay.day.condition.icon
                : weather.current.condition.icon
            }
            alt="weather icon"
          />
          <span className="temperature">
            {selectedDay
              ? selectedDay.day.avgtemp_c
              : weather.current.temp_c}
            °C
          </span>

          {/* Graphique horaire */}
          {!selectedDay ? (
            <HourlyChart forecast={weather.forecast} />
          ) : selectedDay.hour ? (
            <HourlyChart forecast={{ forecastday: [selectedDay] }} />
          ) : (
            <p className="text-center text-gray-400">
              📊 Données horaires non disponibles pour ce jour.
            </p>
          )}

          {/* Détails */}
          <p>{selectedDay ? selectedDay.day.condition.text : weather.current.condition.text}</p>
          <p>🌬️ Vent: {selectedDay ? selectedDay.day.maxwind_kph : weather.current.wind_kph} km/h</p>
          <p>💧 Humidité: {selectedDay ? selectedDay.day.avghumidity : weather.current.humidity}%</p>
          <p>🔽 Pression: {selectedDay ? selectedDay.day.pressure_mb || "N/A" : weather.current.pressure_mb} hPa</p>
          <p>🌡️ Ressentie: {selectedDay ? "N/A" : weather.current.feelslike_c}°C</p>
        </div>
      </div>

      {/* Prévisions des prochains jours */}
      <Days city={city} onSelectDay={setSelectedDay} />
    </div>
  );
};

export default Weather;
