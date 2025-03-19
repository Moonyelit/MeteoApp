import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"; // 📊 Importation des composants pour le graphique

const HourlyChart = ({ forecast }) => {
  // ✅ Vérification : Si forecast est vide ou invalide, on ne retourne rien
  if (!forecast || !forecast.forecastday || forecast.forecastday.length === 0)
    return null;

  // 🕐 Transformation des données pour le graphique (température heure par heure)
  const hourlyData = forecast.forecastday[0].hour.map((hour) => ({
    time: new Date(hour.time).getHours() + "h", // ⏳ Formatage de l'heure (ex: "14h")
    temp: hour.temp_c, // 🌡️ Température en degrés Celsius
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      {/* 📊 Création du graphique */}
      <LineChart data={hourlyData}>
        {/* 🕸️ Ajout d'un quadrillage en pointillés */}
        <CartesianGrid strokeDasharray="3 3" />

        {/* 📍 Axe des X : Affichage des heures */}
        <XAxis dataKey="time" />

        {/* 📍 Axe des Y : Températures avec une plage ajustée */}
        <YAxis
          domain={["dataMin - 2", "dataMax + 2"]} // 🔼 Ajuste la plage pour une meilleure visibilité
          tickFormatter={(value) => value.toFixed(1)} // 🔢 Arrondi les valeurs à 1 décimale
        />

        {/* 🔎 Affichage des valeurs au survol */}
        <Tooltip />

        {/* 📈 Ligne représentant les températures */}
        <Line type="monotone" dataKey="temp" stroke="#61dafb" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HourlyChart;
