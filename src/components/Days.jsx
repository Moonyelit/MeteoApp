import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Weather.css"; 

const Days = ({ city }) => {
    const [forecast, setForecast] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchForecast = async () => {
            try {
                const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
                if (!apiKey) throw new Error("Clé API manquante !");

                const response = await axios.get(
                    `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=5&lang=fr&aqi=no`
                );

                setForecast(response.data.forecast.forecastday);
            } catch (error) {
                console.error("Erreur lors de la récupération des prévisions :", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchForecast();
    }, [city]); 

    if (loading) return <p className="text-center text-white">Chargement des prévisions...</p>;
    if (error) return <p className="text-center text-red-500">Erreur : {error}</p>;

    return (
        <div className="forecast-container">
            {forecast.map((day, index) => (
                <div key={index} className="forecast-day">
                    <p className="date">
                        {new Date(day.date).toLocaleDateString("fr-FR", { weekday: "long" })}
                    </p>
                    <img src={day.day.condition.icon} alt="weather icon" className="forecast-icon" />
                    <p className="temp">{day.day.avgtemp_c}°C</p>
                    <p className="condition">{day.day.condition.text}</p>
                </div>
            ))}
        </div>
    );
};

export default Days;
