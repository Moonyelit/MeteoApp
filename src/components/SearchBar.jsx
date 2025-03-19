import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../styles/SearchBar.css";

const SearchBar = ({ onSearch }) => {
    // Déclaration des états pour gérer la ville, les suggestions, les villes récentes et l'affichage des villes récentes
    const [city, setCity] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [recentCities, setRecentCities] = useState(
        JSON.parse(localStorage.getItem("recentCities")) || []
    );
    const [showRecent, setShowRecent] = useState(false);
    const searchRef = useRef(null);

    // Fonction pour gérer les changements dans l'input
    const handleChange = async (event) => {
        const value = event.target.value;
        setCity(value);

        if (value.length > 2) {
            try {
                const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
                const response = await axios.get(
                    `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${value}`
                );
                setSuggestions(response.data);
                setShowRecent(false); // Cache les villes récentes lorsqu'on tape
            } catch (error) {
                console.error("Erreur lors de la récupération des suggestions :", error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
            if (value === "") {
                setShowRecent(true); // Réaffiche les villes récemment recherchées si l'input est vide
            }
        }
    };

    // Fonction pour gérer la sélection d'une suggestion
    const handleSelectSuggestion = (cityName) => {
        setCity(cityName);
        setSuggestions([]);
        setShowRecent(false);
        updateRecentCities(cityName);
        onSearch(cityName);
    };

    // Fonction pour gérer la soumission du formulaire
    const handleSubmit = (event) => {
        event.preventDefault();
        if (city.trim() !== "") {
            updateRecentCities(city);
            onSearch(city);
            setSuggestions([]);
            setShowRecent(false);
        }
    };

    // Fonction pour mettre à jour les villes récemment recherchées
    const updateRecentCities = (newCity) => {
        let updatedCities = [newCity, ...recentCities.filter((c) => c !== newCity)];
        updatedCities = updatedCities.slice(0, 5);
        setRecentCities(updatedCities);
        localStorage.setItem("recentCities", JSON.stringify(updatedCities));
    };

    // Effet pour gérer les clics en dehors de la barre de recherche
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSuggestions([]);
                setShowRecent(false); // Cache les villes récemment recherchées mais ne les efface pas
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="search-container" ref={searchRef}>
            <form className="search-bar" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Entrez une ville"
                    value={city}
                    onChange={handleChange}
                    onFocus={() => {
                        if (city.trim() === "" && recentCities.length > 0) {
                            setShowRecent(true);
                        }
                    }}
                    className="search-input"
                />
                <button type="submit" className="search-button">🔍</button>
            </form>

            {/* Affichage des suggestions API */}
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSelectSuggestion(suggestion.name)}>
                            {suggestion.name}, {suggestion.country}
                        </li>
                    ))}
                </ul>
            )}

            {/* Affichage des villes récemment recherchées */}
            {showRecent && recentCities.length > 0 && (
                <ul className="recent-cities">
                    <p className="recent-title">🔄 Villes récemment recherchées</p>
                    {recentCities.map((city, index) => (
                        <li key={index} onClick={() => handleSelectSuggestion(city)}>
                            {city}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
