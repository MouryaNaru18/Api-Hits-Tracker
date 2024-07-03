import React, { useRef, useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';

const Charts = () => {
    const pieChartRef = useRef(null); // Ref to hold the pie chart instance
    const barChartRef1 = useRef(null); // Ref to hold bar chart 1 instance
    const barChartRef2 = useRef(null); // Ref to hold bar chart 2 instance

    const [browserData, setBrowserData] = useState([]);
    const [osData, setOsData] = useState([]);
    const [barChartData1, setBarChartData1] = useState([]);
    const [barChartData2, setBarChartData2] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api-hits-data');
            const logs = response.data;

            // Process data for pie chart (Browsers)
            const browsers = {};
            logs.forEach(log => {
                const browser = log.browser || 'Unknown'; // Default to 'Unknown' if browser is not defined
                if (browser !== 'Unknown') {
                    if (browsers[browser]) {
                        browsers[browser]++;
                    } else {
                        browsers[browser] = 1;
                    }
                }
            });
            const browserChartData = {
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
            setBrowserData(browserChartData);

            // Process data for bar chart 1 (Request Type)
            updateBarChartData(logs, 'requestType', setBarChartData1);

            // Process data for bar chart 2 (IP Address)
            updateBarChartData(logs, 'ip_address', setBarChartData2);

        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const updateBarChartData = (logs, criteria, setChartData) => {
        const dataMap = {};
        logs.forEach(log => {
            let key;
            if (criteria === 'requestType') {
                key = log[criteria] || 'GET'; // Default to 'GET' if request type is undefined or null
            } else {
                key = log[criteria] || 'Unknown'; // Default to 'Unknown' for other criteria
            }
            if (dataMap[key]) {
                dataMap[key]++;
            } else {
                dataMap[key] = 1;
            }
        });

        const chartData = {
            labels: Object.keys(dataMap),
            datasets: [{
                label: `API Hits by ${criteria === 'requestType' ? 'Request Type' : 'IP Address'}`,
                data: Object.values(dataMap),
                backgroundColor: '#36A2EB' // Adjust as needed
            }]
        };

        setChartData(chartData);
    };

    useEffect(() => {
        // Function to create or update the pie chart
        const createOrUpdatePieChart = () => {
            if (pieChartRef.current) {
                pieChartRef.current.destroy(); // Destroy existing pie chart if it exists
            }
            
            const ctx = document.getElementById('myPieChart');
            if (ctx && browserData.datasets && browserData.labels) {
                pieChartRef.current = new Chart(ctx, {
                    type: 'pie',
                    data: browserData,
                    options: {
                        plugins: {
                            title: {
                                display: true,
                                text: 'API REQUESTS BY DIFFERENT BROWSER', // Title text
                                font: {
                                    size: 16 // Font size for the title
                                }
                            },
                            legend: {
                                position: 'bottom',
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        return `${tooltipItem.label}: ${tooltipItem.raw}`;
                                    }
                                }
                            }
                        },
                        responsive: true,
                        maintainAspectRatio: false, // Allows the chart to be smaller than its container
                        aspectRatio: 1 // Aspect ratio of 1:1 (square)
                    }
                });
            }
        };
        
        createOrUpdatePieChart(); // Initial pie chart creation on component mount

        return () => {
            if (pieChartRef.current) {
                pieChartRef.current.destroy(); // Clean up pie chart instance on component unmount
            }
        };
    }, [browserData]); // Dependency on browserData to update chart when data changes

    useEffect(() => {
        // Function to create or update bar chart 1 (Request Type)
        const createOrUpdateBarChart1 = () => {
            if (barChartRef1.current) {
                barChartRef1.current.destroy(); // Destroy existing bar chart if it exists
            }

            const ctx = document.getElementById('myBarChart1');
            if (ctx && barChartData1.datasets && barChartData1.labels) {
                barChartRef1.current = new Chart(ctx, {
                    type: 'bar',
                    data: barChartData1,
                    options: {
                        plugins: {
                            title: {
                                display: true,
                                text: 'API HITS BY REQUEST TYPE', // Title text for bar chart 1
                                font: {
                                    size: 16 // Font size for the title
                                }
                            },
                            legend: {
                                display: false,
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        return `${tooltipItem.label}: ${tooltipItem.raw}`;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        responsive: true,
                        maintainAspectRatio: false, // Allows the chart to be smaller than its container
                        aspectRatio: 1 // Aspect ratio of 1:1 (square)
                    }
                });
            }
        };

        createOrUpdateBarChart1(); // Initial bar chart 1 creation on component mount

        return () => {
            if (barChartRef1.current) {
                barChartRef1.current.destroy(); // Clean up bar chart 1 instance on component unmount
            }
        };
    }, [barChartData1]); // Dependency on barChartData1 to update chart when data changes

    useEffect(() => {
        // Function to create or update bar chart 2 (IP Address)
        const createOrUpdateBarChart2 = () => {
            if (barChartRef2.current) {
                barChartRef2.current.destroy(); // Destroy existing bar chart if it exists
            }

            const ctx = document.getElementById('myBarChart2');
            if (ctx && barChartData2.datasets && barChartData2.labels) {
                barChartRef2.current = new Chart(ctx, {
                    type: 'bar',
                    data: barChartData2,
                    options: {
                        plugins: {
                            title: {
                                display: true,
                                text: 'API HITS BY IP ADDRESS', // Title text for bar chart 2
                                font: {
                                    size: 16 // Font size for the title
                                }
                            },
                            legend: {
                                display: false,
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        return `${tooltipItem.label}: ${tooltipItem.raw}`;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        },
                        responsive: true,
                        maintainAspectRatio: false, // Allows the chart to be smaller than its container
                        aspectRatio: 1 // Aspect ratio of 1:1 (square)
                    }
                });
            }
        };

        createOrUpdateBarChart2(); // Initial bar chart 2 creation on component mount

        return () => {
            if (barChartRef2.current) {
                barChartRef2.current.destroy(); // Clean up bar chart 2 instance on component unmount
            }
        };
    }, [barChartData2]); // Dependency on barChartData2 to update chart when data changes

    return (
        <div className="charts">
            <div className="chart-container">
                <canvas id="myPieChart" width="200" height="200"></canvas> {/* Decreased width and height */}
            </div>
            <div className="chart-container">
                <canvas id="myBarChart1" width="200" height="200"></canvas> {/* Decreased width and height */}
            </div>
            <div className="chart-container">
                <canvas id="myBarChart2" width="200" height="200"></canvas> {/* Decreased width and height */}
            </div>
        </div>
    );
};

export default Charts;
