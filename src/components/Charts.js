// src/components/Charts.js

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Chart from 'chart.js/auto';

const Charts = ({ chartType, criteria }) => {
    const chartRef = useRef(null);
    const [chartData, setChartData] = useState(null);
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api-hits-data');
            const logs = response.data;

            if (chartType === 'pie') {
                createPieChartData(logs);
            } else if (chartType === 'bar') {
                createBarChartData(logs);
            } else if (chartType === 'requestType') {
                createRequestTypeChartData(logs);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const createPieChartData = (logs) => {
        // Process data for pie chart (Example: API Hits by Browser)
        const browsers = {};
        logs.forEach(log => {
            const browser = log.browser;
            if (browser) {
                if (browsers[browser]) {
                    browsers[browser]++;
                } else {
                    browsers[browser] = 1;
                }
            }
        });

        const pieChartData = {
            labels: Object.keys(browsers),
            datasets: [{
                label: 'API Hits by Browser',
                data: Object.values(browsers),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40',
                    '#4CAF50',
                    '#FF5733',
                    '#C70039',
                    '#900C3F'
                ]
            }]
        };

        setChartData(pieChartData);
    };

    const createBarChartData = (logs) => {
        // Process data for bar chart (Example: API Hits by IP Address)
        const ipAddresses = {};
        logs.forEach(log => {
            const ip = log.ip_address || 'Unknown'; // Default to 'Unknown' if IP address is not defined
            if (ipAddresses[ip]) {
                ipAddresses[ip]++;
            } else {
                ipAddresses[ip] = 1;
            }
        });

        const barChartData = {
            labels: Object.keys(ipAddresses),
            datasets: [{
                label: 'API Hits by IP Address',
                data: Object.values(ipAddresses),
                backgroundColor: '#36A2EB' // Adjust as needed
            }]
        };

        setChartData(barChartData);
    };

    const createRequestTypeChartData = (logs) => {
        // Process data for bar chart (Example: API Hits by Request Type)
        const requestTypes = {};
        logs.forEach(log => {
            const requestType = log[criteria] || 'GET'; // Assuming criteria is 'requestType'
            if (requestTypes[requestType]) {
                requestTypes[requestType]++;
            } else {
                requestTypes[requestType] = 1;
            }
        });

        const requestTypeChartData = {
            labels: Object.keys(requestTypes),
            datasets: [{
                label: 'API Hits by Request Type',
                data: Object.values(requestTypes),
                backgroundColor: '#FF6384' // Adjust as needed
            }]
        };

        setChartData(requestTypeChartData);
    };

    useEffect(() => {
        // Function to create or update the chart
        const createOrUpdateChart = () => {
            if (chartInstance) {
                chartInstance.destroy(); // Destroy existing chart instance
            }

            const ctx = chartRef.current.getContext('2d');
            if (ctx && chartData) {
                const newChartInstance = new Chart(ctx, {
                    type: chartType === 'pie' ? 'pie' : 'bar',
                    data: chartData,
                    options: {
                        plugins: {
                            title: {
                                display: true,
                                text: chartType === 'pie' ? 'API Hits by Browser' : (chartType === 'bar' ? 'API Hits by IP Address' : 'API Hits by Request Type'),
                                font: {
                                    size: 16
                                }
                            },
                            legend: {
                                position: 'bottom',
                            },
                            responsive: true,
                            maintainAspectRatio: false // Adjusted to allow chart resizing
                        }
                    }
                });
                setChartInstance(newChartInstance); // Save new chart instance
            }
        };

        createOrUpdateChart(); // Initial chart creation or update

        return () => {
            if (chartInstance) {
                chartInstance.destroy(); // Clean up chart instance on component unmount
            }
        };
    }, [chartData, chartType]); // Dependency on chartData and chartType to update chart when data changes

    return (
        <div className="chart-container">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default Charts;
