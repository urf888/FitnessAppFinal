/* eslint-disable no-unused-vars */
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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
        <div className="macro-tooltip">
          <div className="tooltip-header">{data.name}</div>
          <div className="tooltip-content">
            <div className="tooltip-value">{data.value}% din total calorii</div>
            <div className="tooltip-grams">{data.grams}g pe zi</div>
            <div className="tooltip-info">
              {data.name === 'Proteine' ? 
                '4 calorii/gram - esențial pentru mușchi și recuperare' : 
                data.name === 'Carbohidrați' ? 
                '4 calorii/gram - principala sursă de energie' : 
                '9 calorii/gram - important pentru hormoni și absorbția vitaminelor'}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Renderizarea etichetelor direct pe grafic
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor="middle" 
        dominantBaseline="central"
        style={{ fontWeight: "bold", fontSize: "14px", textShadow: "0px 0px 2px rgba(0,0,0,0.5)" }}
      >
        {`${value}%`}
      </text>
    );
  };

  return (
    <div className="macronutrient-chart-container">
      <div className="chart-legend">
        {data.map((entry, index) => (
          <div key={`legend-${index}`} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: entry.color }}></div>
            <div className="legend-text">
              <span className="legend-name">{entry.name}</span>
              <span className="legend-value">{entry.grams}g ({entry.value}%)</span>
            </div>
          </div>
        ))}
      </div>
      
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
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="macros-explanation">
        <div className="macro-info protein">
          <h4>Proteine: {macros.protein.grams}g</h4>
          <p>Esențiale pentru construirea și repararea țesuturilor musculare. Importante pentru recuperare după antrenament.</p>
        </div>
        <div className="macro-info carbs">
          <h4>Carbohidrați: {macros.carbs.grams}g</h4>
          <p>Principala sursă de energie. Necesari pentru performanță fizică și activitatea cerebrală.</p>
        </div>
        <div className="macro-info fat">
          <h4>Grăsimi: {macros.fat.grams}g</h4>
          <p>Importante pentru absorbția vitaminelor, producția hormonală și sănătatea celulară.</p>
        </div>
      </div>
    </div>
  );
};

export default MacronutrientChart;