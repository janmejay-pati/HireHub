import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#38bdf8", "#8b5cf6", "#f59e0b", "#10b981", "#f43f5e", "#22c55e"];

const AnalyticsChart = ({ type = "line", data = [], xKey = "label", series = [], title, height = 280 }) => {
  const chartData = data.length ? data : [{ label: "No data", value: 1 }];

  const renderTooltipContent = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;

    return (
      <div
        style={{
          background: "var(--surface-strong)",
          border: "1px solid var(--border)",
          borderRadius: 18,
          padding: 12,
          color: "var(--text)",
          backdropFilter: "blur(22px)",
        }}
      >
        <p style={{ fontWeight: 700, marginBottom: 8 }}>{label}</p>
        {payload.map((entry) => (
          <p key={entry.dataKey} style={{ margin: 0, color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  };

  const commonProps = {
    data: chartData,
    margin: { top: 12, right: 12, left: -16, bottom: 4 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border p-4"
      style={{
        borderColor: "var(--border)",
        background: "linear-gradient(135deg, var(--surface), transparent)",
        boxShadow: "var(--shadow)",
      }}
    >
      {title && (
        <div className="mb-3">
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            {title}
          </p>
        </div>
      )}

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === "bar" ? (
            <BarChart {...commonProps}>
              <CartesianGrid stroke="rgba(148,163,184,0.2)" vertical={false} />
              <XAxis dataKey={xKey} stroke="var(--muted)" tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted)" tickLine={false} axisLine={false} />
              <Tooltip content={renderTooltipContent} />
              {series.map((item, index) => (
                <Bar
                  key={item.dataKey}
                  dataKey={item.dataKey}
                  fill={item.color || COLORS[index % COLORS.length]}
                  radius={[10, 10, 0, 0]}
                  maxBarSize={52}
                />
              ))}
            </BarChart>
          ) : type === "area" ? (
            <AreaChart {...commonProps}>
              <defs>
                <linearGradient id="analytics-fill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(148,163,184,0.2)" vertical={false} />
              <XAxis dataKey={xKey} stroke="var(--muted)" tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted)" tickLine={false} axisLine={false} />
              <Tooltip content={renderTooltipContent} />
              {series.map((item, index) => (
                <Area
                  key={item.dataKey}
                  type="monotone"
                  dataKey={item.dataKey}
                  stroke={item.color || COLORS[index % COLORS.length]}
                  fill="url(#analytics-fill)"
                  strokeWidth={3}
                />
              ))}
            </AreaChart>
          ) : type === "pie" ? (
            <PieChart>
              <Tooltip content={renderTooltipContent} />
              <Legend />
              <Pie data={chartData} dataKey="value" nameKey="label" innerRadius={52} outerRadius={90} paddingAngle={3}>
                {chartData.map((entry, index) => (
                  <Cell key={entry.label} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          ) : (
            <LineChart {...commonProps}>
              <CartesianGrid stroke="rgba(148,163,184,0.2)" vertical={false} />
              <XAxis dataKey={xKey} stroke="var(--muted)" tickLine={false} axisLine={false} />
              <YAxis stroke="var(--muted)" tickLine={false} axisLine={false} />
              <Tooltip content={renderTooltipContent} />
              {series.map((item, index) => (
                <Line
                  key={item.dataKey}
                  type="monotone"
                  dataKey={item.dataKey}
                  stroke={item.color || COLORS[index % COLORS.length]}
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              ))}
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default AnalyticsChart;
