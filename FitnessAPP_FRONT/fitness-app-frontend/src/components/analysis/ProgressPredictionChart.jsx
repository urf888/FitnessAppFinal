import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import './ProgressPredictionChart.css';

const ProgressPredictionChart = ({ predictions }) => {
  // Găsim valorile minime și maxime pentru greutate pentru a ajusta axele
  const weights = predictions.map(p => p.weight);
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);
  
  // Ajustăm domeniul pentru a avea o margine vizuală
  const yDomain = [
    Math.floor(minWeight) - 1,
    Math.ceil(maxWeight) + 1
  ];
  
  // Personalizarea tooltip-ului
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="progress-chart-tooltip">
          <p className="tooltip-label">Săptămâna {label}</p>
          <p className="tooltip-value">{payload[0].value} kg</p>
        </div>
      );
    }
    return null;
  };

  // Pentru a adăuga marcaje la fiecare 4 săptămâni
  const CustomizedAxisTick = ({ x, y, payload }) => {
    // Afișăm doar săptămânile 0, 4, 8, 12
    if (payload.value % 4 === 0) {
      return (
        <g transform={`translate(${x},${y})`}>
          <text 
            x={0} 
            y={0} 
            dy={16} 
            textAnchor="middle" 
            fill="#666"
          >
            S{payload.value}
          </text>
        </g>
      );
    }
    return null;
  };

  // Determinăm dacă greutatea crește sau scade pentru a alege culoarea
  const isWeightGain = predictions[0].weight < predictions[predictions.length - 1].weight;
  const lineColor = isWeightGain ? '#4CAF50' : '#F44336'; // Verde pentru creștere, Roșu pentru scădere

  return (
    <div className="progress-prediction-chart">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={predictions}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 10,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="week" 
            tick={<CustomizedAxisTick />}
            label={{ value: 'Săptămâni', position: 'insideBottomRight', offset: -5 }}
          />
          <YAxis 
            domain={yDomain}
            label={{ value: 'Greutate (kg)', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine 
            y={predictions[0].weight} 
            stroke="#888" 
            strokeDasharray="3 3"
            label={{ 
              value: 'Greutate actuală', 
              position: 'left',
              fill: '#888',
              fontSize: 12
            }}
          />
          <Line
            type="monotone"
            dataKey="weight"
            stroke={lineColor}
            strokeWidth={2}
            dot={{ r: 3 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressPredictionChart;