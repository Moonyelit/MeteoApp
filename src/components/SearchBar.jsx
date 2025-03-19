import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../styles/SearchBar.css";

const SearchBar = ({ onSearch }) => {
    // 🏙️ État pour stocker la ville saisie par l'utilisateur
    const [city, setCity] = useState("");

    // 📌 État pour stocker les suggestions renvoyées par l'API
    const [suggestions, setSuggestions] = useState([]);

    // 🔄 État pour stocker les dernières villes recherchées (récupérées depuis le localStorage)
    const [recentCities, setRecentCities] = useState(
        JSON.parse(localStorage.getItem("recentCities")) || []
    );

    // 👀 État pour afficher ou cacher les villes récemment recherchées
    const [showRecent, setShowRecent] = useState(false);

    // 📌 useRef pour détecter les clics en dehors de la barre de recherche
    const searchRef = useRef(null);

    // 📝 Fonction pour gérer la saisie de l'utilisateur
    const handleChange = async (event) => {
        const value = event.target.value;
        setCity(value);

        if (value.length > 2) {
            try {
                const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
                // 🔍 Requête API pour obtenir les villes correspondant à la saisie
                const response = await axios.get(
                    `https://api.weatherapi.com/v1/search.json?key=${apiKey}&q=${value}`
                );
                setSuggestions(response.data); // Met à jour les suggestions
                setShowRecent(false); // Cache les villes récentes lorsqu'on tape
            } catch (error) {
                console.error("Erreur lors de la récupération des suggestions :", error);
                setSuggestions([]); // Réinitialise les suggestions en cas d'erreur
            }
        } else {
            setSuggestions([]); // Efface les suggestions si l'entrée est trop courte
            if (value === "") {
                setShowRecent(true); // Réaffiche les villes récemment recherchées si l'input est vide
            }
        }
    };

    // 🖱️ Fonction pour sélectionner une ville dans les suggestions
    const handleSelectSuggestion = (cityName) => {
        setCity(cityName);
        setSuggestions([]); // Efface les suggestions
        setShowRecent(false); // Cache la liste des villes récentes
        updateRecentCities(cityName); // Met à jour les villes récentes
        onSearch(cityName); // Met à jour la météo de la ville sélectionnée
    };

    // 📤 Fonction pour soumettre le formulaire et chercher une ville
    const handleSubmit = (event) => {
        event.preventDefault();
        if (city.trim() !== "") {
            updateRecentCities(city); // Ajoute la ville à l'historique
            onSearch(city); // Met à jour la météo
            setSuggestions([]); // Cache les suggestions
            setShowRecent(false); // Cache la liste des villes récentes
        }
    };

    // 🔄 Fonction pour enregistrer les villes récemment recherchées
    const updateRecentCities = (newCity) => {
        let updatedCities = [newCity, ...recentCities.filter((c) => c !== newCity)];
        updatedCities = updatedCities.slice(0, 5); // Garde uniquement les 5 dernières villes
        setRecentCities(updatedCities);
        localStorage.setItem("recentCities", JSON.stringify(updatedCities)); // Enregistre dans le localStorage
    };

    // 🖱️ Gestion des clics en dehors de la barre de recherche
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSuggestions([]); // Cache les suggestions
                setShowRecent(false); // Cache la liste des villes récemment recherchées
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="search-container" ref={searchRef}>
            {/* 🔎 Formulaire de recherche */}
            <form className="search-bar" onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Entrez une ville"
                    value={city}
                    onChange={handleChange}
                    onFocus={() => {
                        if (city.trim() === "" && recentCities.length > 0) {
                            setShowRecent(true); // Affiche les villes récentes si l'input est vide
                        }
                    }}
                    className="search-input"
                />
                <button type="submit" className="search-button">🔍</button>
            </form>

            {/* 🏙️ Liste des suggestions de villes */}
            {suggestions.length > 0 && (
                <ul className="suggestions-list">
                    {suggestions.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSelectSuggestion(suggestion.name)}>
                            {suggestion.name}, {suggestion.country}
                        </li>
                    ))}
                </ul>
            )}

            {/* 🔄 Liste des villes récemment recherchées */}
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
