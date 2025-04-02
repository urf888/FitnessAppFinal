import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import './MacronutrientChart.css';

const MacronutrientChart = ({ macros }) => {
  // Pregătirea datelor pentru grafic
  const data = [
    {
      name: 'Proteine',
      value: macros.protein.percentage,
      color: '#4CAF50', // Verde
      grams: macros.protein.grams
    },
    {
      name: 'Carbohidrați',
      value: macros.carbs.percentage,
      color: '#2196F3', // Albastru
      grams: macros.carbs.grams
    },
    {
      name: 'Grăsimi',
      value: macros.fat.percentage,
      color: '#FFC107', // Galben
      grams: macros.fat.grams
    }
  ];

  // Personalizarea tooltip-ului
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="macro-chart-tooltip">
          <p className="tooltip-label">{data.name}</p>
          <p className="tooltip-value">{data.value}% ({data.grams}g)</p>
        </div>
      );
    }
    return null;
  };

  // Personalizarea legendei
  const renderCustomizedLegend = (props) => {
    const { payload } = props;
    
    return (
      <ul className="macro-chart-legend">
        {payload.map((entry, index) => (
          <li key={`item-${index}`} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: entry.color }}></div>
            <span className="legend-text">{entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="macronutrient-chart">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            label={({ name, value }) => `${name} ${value}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            content={renderCustomizedLegend}
            verticalAlign="bottom" 
            align="center"
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MacronutrientChart;