import React from 'react';
import '../styles/Statistics.css';

interface StatisticsProps {
  stats: {
    wordCount: number;
    charCount: number;
    lineCount: number;
  };
}

const Statistics: React.FC<StatisticsProps> = ({ stats }) => {
  return (
    <div className="statistics">
      <div className="stat-item">
        <span className="stat-label">Words:</span>
        <span className="stat-value">{stats.wordCount}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Characters:</span>
        <span className="stat-value">{stats.charCount}</span>
      </div>
      <div className="stat-item">
        <span className="stat-label">Lines:</span>
        <span className="stat-value">{stats.lineCount}</span>
      </div>
    </div>
  );
};

export default Statistics;