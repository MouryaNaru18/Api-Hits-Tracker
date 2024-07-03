// src/ApiLogs.js

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assuming you're using axios for HTTP requests
import { Link } from 'react-router-dom';

const ApiLogs = () => {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [filters, setFilters] = useState({
        timestamp: '',
        requestType: '',
        browser: '' // Add browser filter to state
    });

    useEffect(() => {
        fetchLogs();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [logs, filters]);

    const fetchLogs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api-hits-data'); // Adjust URL as per your backend setup
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    const applyFilters = () => {
        let filteredData = logs.filter(log => {
            return (
                log.request_time.includes(filters.timestamp) &&
                log.request_type.includes(filters.requestType) &&
                (filters.browser === '' || (log.browser && log.browser.toLowerCase().includes(filters.browser.toLowerCase())))
                // Check if log.browser is not null or undefined before calling toLowerCase()
            );
        });
        setFilteredLogs(filteredData);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
    };

    const handleSort = (key) => {
        const sortedData = [...filteredLogs].sort((a, b) => {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        });
        setFilteredLogs(sortedData);
    };

    return (
        <div className="api-logs">
            <div className="header">
                <h2 className="title">API HITS TRACKER</h2>
                <Link to="/charts" className="button">Charts</Link> {/* Link to Charts route */}
            </div>
            <div className="filters" style={{ marginBottom: '1rem' }}>
                <label style={{ marginRight: '0.5rem' }}>Timestamp:</label>
                <input
                    type="text"
                    name="timestamp"
                    value={filters.timestamp}
                    onChange={handleFilterChange}
                    style={{ marginRight: '1rem', padding: '0.5rem' }}
                />

                <label style={{ marginRight: '0.5rem' }}>Request Type:</label>
                <input
                    type="text"
                    name="requestType"
                    value={filters.requestType}
                    onChange={handleFilterChange}
                    style={{ marginRight: '1rem', padding: '0.5rem' }}
                />

                <label style={{ marginRight: '0.5rem' }}>Browser:</label> {/* Add browser filter input */}
                <input
                    type="text"
                    name="browser"
                    value={filters.browser}
                    onChange={handleFilterChange}
                    style={{ marginRight: '1rem', padding: '0.5rem' }}
                />
            </div>
            <table className="api-log-table">
                <thead>
                    <tr>
                        <th onClick={() => handleSort('id')}>ID</th>
                        <th onClick={() => handleSort('request_time')}>Timestamp</th>
                        <th onClick={() => handleSort('request_type')}>Request Type</th>
                        <th onClick={() => handleSort('request_id')}>API Endpoint</th>
                        <th onClick={() => handleSort('user_agent')}>User Agent</th>
                        <th onClick={() => handleSort('payload')}>Request Body</th>
                        <th onClick={() => handleSort('os')}>Operating System</th>
                        <th onClick={() => handleSort('ip_address')}>IP Address</th>
                        <th onClick={() => handleSort('browser')}>Browser</th> {/* Ensure this column is added */}
                    </tr>
                </thead>
                <tbody>
                    {filteredLogs.map((log) => (
                        <tr key={log.id}>
                            <td>{log.id}</td>
                            <td>{log.request_time}</td>
                            <td>{log.request_type}</td>
                            <td>{log.request_id}</td>
                            <td>{log.user_agent}</td>
                            <td>{log.payload}</td>
                            <td>{log.os}</td>
                            <td>{log.ip_address}</td>
                            <td>{log.browser}</td> {/* Display the browser column */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ApiLogs;
