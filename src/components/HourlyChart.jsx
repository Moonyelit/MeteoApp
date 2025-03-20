import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

/**
 * CustomTooltip : Tooltip personnalisé avec un fond sombre
 * et un texte en blanc pour une meilleure lisibilité.
 */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      style={{
        background: "rgba(0, 0, 0, 0.7)", // Fond sombre semi-transparent
        backdropFilter: "blur(4px)",
        borderRadius: "8px",
        padding: "8px 12px",
        color: "#fff", // Texte blanc pour le contraste
        boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
      }}
    >
      <p style={{ margin: 0, fontWeight: "bold" }}>{label}</p>
      <p style={{ margin: 0 }}>{`${payload[0].value} °C`}</p>
    </div>
  );
};

const HourlyChart = ({ forecast }) => {
  if (!forecast || !forecast.forecastday || forecast.forecastday.length === 0)
    return null;

  const hourlyData = forecast.forecastday[0].hour.map((hour) => ({
    time: new Date(hour.time).getHours() + "h",
    temp: hour.temp_c,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={hourlyData}
        margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
        style={{ filter: "drop-shadow(0 4px 10px rgba(0,0,0,0.2))" }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
        <XAxis dataKey="time" tick={{ fill: "#fff" }} />
        <YAxis
          domain={["dataMin - 2", "dataMax + 2"]}
          tick={{ fill: "#fff" }}
          tickFormatter={(value) => value.toFixed(1)}
        />
        <Tooltip content={<CustomTooltip />} wrapperStyle={{ outline: "none" }} />

        <defs>
          <linearGradient id="lineColor" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#4F8DFD">
              <animate
                attributeName="stop-color"
                values="#4F8DFD; #9A57FD; #4F8DFD"
                dur="5s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="100%" stopColor="#9A57FD">
              <animate
                attributeName="stop-color"
                values="#9A57FD; #4F8DFD; #9A57FD"
                dur="5s"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>

          <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4F8DFD" stopOpacity={0.4} />
            <stop offset="100%" stopColor="#9A57FD" stopOpacity={0} />
          </linearGradient>
        </defs>

        <Area
          type="monotone"
          dataKey="temp"
          stroke="url(#lineColor)"
          strokeWidth={3}
          fill="url(#areaColor)"
          dot={{ r: 2, stroke: "#fff", strokeWidth: 1 }}
          activeDot={{ r: 4 }}
          isAnimationActive={true}
          animationDuration={2000}
          animationEasing="ease-in-out"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default HourlyChart;
