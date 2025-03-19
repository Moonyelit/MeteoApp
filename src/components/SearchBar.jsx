import { useState } from "react";
import axios from "axios";
import "../styles/SearchBar.css";

const SearchBar = ({ onSearch }) => {
    const [city, setCity] = useState("");
    const [suggestions, setSuggestions] = useState([]); // Stocke les suggestions de villes

    const handleChange = async (event) => {
        const value = event.target.value;
        setCity(value);

        if (value.length > 2) { // Lance la recherche après 3 lettres tapées
            try {
                const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
                const response = await axios.get(
                    `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${value}`
                );
                setSuggestions(response.data);
            } catch (error) {
                console.error("Erreur lors de la récupération des suggestions :", error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]); // Si moins de 3 lettres, on vide les suggestions
        }
    };

    const handleSelectSuggestion = (cityName) => {
        setCity(cityName);
        setSuggestions([]);
        onSearch(cityName); // Lance la recherche avec la ville sélectionnée
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (city.trim() !== "") {
            onSearch(city);
            setSuggestions([]); // Cache les suggestions après la recherche
        }
    };

    return (
        <div className="search-container">
            <form className="search-bar" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Entrez une ville"
                    value={city}
                    onChange={handleChange}
                    className="search-input"
                />
                <button type="submit" className="search-button">🔍</button>
            </form>

            {/* Affichage des suggestions */}
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSelectSuggestion(suggestion.name)}>
                            {suggestion.name}, {suggestion.country}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
