import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';

const PieChart = () => {
    const [browserData, setBrowserData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api-hits-data'); // Adjust URL as per your backend setup
            const logs = response.data;
            const browserCounts = countBrowsers(logs);
            setBrowserData(browserCounts);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const countBrowsers = (logs) => {
        const browserCounts = {};
        logs.forEach(log => {
            const browser = log.browser || 'Unknown'; // Default to 'Unknown' if browser is not specified
            if (browserCounts[browser]) {
                browserCounts[browser]++;
            } else {
                browserCounts[browser] = 1;
            }
        });
        return browserCounts;
    };

    const prepareChartData = () => {
        const labels = Object.keys(browserData);
        const data = Object.values(browserData);
        return {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: getRandomColors(labels.length),
            }]
        };
    };

    const getRandomColors = (numColors) => {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`;
            colors.push(color);
        }
        return colors;
    };

    return (
        <div className="pie-chart">
            <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Requests by Browser</h2>
            <div style={{ width: '80%', margin: '0 auto' }}>
                <Pie data={prepareChartData()} />
            </div>
        </div>
    );
};

export default PieChart;
