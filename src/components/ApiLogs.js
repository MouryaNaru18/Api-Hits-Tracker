import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApiLogs = () => {
    const [logs, setLogs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 10;

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api-hits-data');
            setLogs(response.data);
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    const handleSort = (key) => {
        const sortedData = [...logs].sort((a, b) => {
            if (a[key] < b[key]) return -1;
            if (a[key] > b[key]) return 1;
            return 0;
        });
        setLogs(sortedData);
    };

    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(logs.length / logsPerPage)) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    return (
        <div className="api-logs">
            <div className="header">
             
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
                    </tr>
                </thead>
                <tbody>
                    {currentLogs.map(log => (
                        <tr key={log.id}>
                            <td>{log.id}</td>
                            <td>{log.request_time}</td>
                            <td>{log.request_type}</td>
                            <td>{log.api_endpoint}</td>
                            <td>{log.user_agent}</td>
                            <td>{log.payload}</td>
                            <td>{log.os}</td>
                            <td>{log.ip_address}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>
                    Previous
                </button>
                <button onClick={handleNextPage} disabled={currentPage === Math.ceil(logs.length / logsPerPage)}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default ApiLogs;
