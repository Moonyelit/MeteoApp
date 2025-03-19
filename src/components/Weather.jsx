import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Weather.css";
import Days from "./Days"; 
import SearchBar from "./SearchBar";

const Weather = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [city, setCity] = useState("Paris"); 

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
                if (!apiKey) throw new Error("Clé API manquante !");

                const response = await axios.get(
                    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}&lang=fr&aqi=no`
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

    const handleSearch = (newCity) => {
        setCity(newCity);
    };

    if (loading) return <p className="text-center text-white">Chargement...</p>;
    if (error) return <p className="text-center text-red-500">Erreur : {error}</p>;

    return (
        <div className="weather-container">
            <SearchBar onSearch={handleSearch} /> {/* Ajout de la barre de recherche */}
            <div className="weather card">
                <div className="card-content">
                    <h2>{weather.location.name}</h2>
                    <img src={weather.current.condition.icon} alt="weather icon" />
                    <span className="temperature">{weather.current.temp_c}°C</span>
                    <p>{weather.current.condition.text}</p>
                    <p>🌬️ Vent: {weather.current.wind_kph} km/h</p>
                    <p>💧 Humidité: {weather.current.humidity}%</p>
                    <p>🔽 Pression: {weather.current.pressure_mb} hPa</p>
                    <p>🌡️ Température ressentie: {weather.current.feelslike_c}°C</p>
                </div>
            </div>
            <Days city={city} />
        </div>
    );
};


export default Weather;
