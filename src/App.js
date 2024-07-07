import React, { useState, useEffect } from 'react';
import './App.css';
import ApiLogs from './components/ApiLogs';
import Charts from './components/Charts';
import axios from 'axios';

const App = () => {
    const [totalRequests, setTotalRequests] = useState(0);
    const [timeFilter, setTimeFilter] = useState('last30days'); // Default filter to Last 30 Days

    useEffect(() => {
        fetchTotalRequests();
    }, []); // Only run once when component mounts

    const fetchTotalRequests = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api-hits-data');
            setTotalRequests(response.data.length);
        } catch (error) {
            console.error('Error fetching total requests:', error);
        }
    };

    const handleTimeFilterChange = (filter) => {
        setTimeFilter(filter);
    };

    return (
        <div className="App">
            <div className="sidebar">
                <div className="sidebar-title">API DASHBOARD</div>
                <ul>
                    <li>Product</li>
                    <li>Customers</li>
                    <li>Income</li>
                    <li>Promote</li>
                    <li>Help</li>
                </ul>
                <div className="sidebar-bottom"><h4>Upgrade to pro</h4></div>
                <div className="sidebar-bbottom"><h4>Mourya Naru</h4></div>
            </div>
            <div className="content">
                <div className="header">
                    <div className="title">Hello Mourya</div>
                    <div className="search-container">
                        <input type="text" className="search-input" placeholder="Search..." />
                        <button className="search-button">Search</button>
                    </div>
                </div>
                <div className="box">
                    <div className="left-content">Total Requests: {totalRequests}</div>
                    <div className="center-content">Avg Response Time: {totalRequests}</div>
                    <div className="right-content">Failed Requests: {totalRequests}</div>
                </div>
                <div className="additional-boxes">
                    <div className="additional-box">
                        <h3>Browser</h3>
                        <Charts chartType="pie" />
                    </div>
                    <div className="additional-box">
                        <h3>Request Type</h3>
                        <Charts chartType="requestType" criteria="requestType" />
                    </div>
                </div>
                <div className="big-box">
                    <h3>Requests</h3>
                    <div className="time-filters">
                        <select value={timeFilter} onChange={(e) => handleTimeFilterChange(e.target.value)}>
                            <option value="last30days">Last 30 Days</option>
                            <option value="last1day">Last 1 Day</option>
                            <option value="last1hour">Last 1 Hour</option>
                        </select>
                    </div>
                    
                </div>
                <ApiLogs timeFilter={timeFilter} />
            </div>
        </div>
    );
};

export default App;
