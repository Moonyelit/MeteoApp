import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const HourlyChart = ({ forecast }) => {
  if (!forecast || !forecast.forecastday || forecast.forecastday.length === 0)
    return null;

  const hourlyData = forecast.forecastday[0].hour.map((hour) => ({
    time: new Date(hour.time).getHours() + "h",
    temp: hour.temp_c,
  }));

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={hourlyData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis
          domain={["dataMin - 2", "dataMax + 2"]}
          tickFormatter={(value) => value.toFixed(1)}
        />
        <Line type="monotone" dataKey="temp" stroke="#61dafb" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default HourlyChart;
