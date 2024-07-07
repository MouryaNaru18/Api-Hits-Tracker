// src/components/TotalRequests.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TotalRequests = () => {
    const [totalRequests, setTotalRequests] = useState(0);

    useEffect(() => {
        fetchTotalRequests();
    }, []);

    const fetchTotalRequests = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api-hits-data');
            // Calculate total number of requests
            setTotalRequests(response.data.length); // Assuming response.data is an array of logs
        } catch (error) {
            console.error('Error fetching logs:', error);
        }
    };

    return (
        <div className="total-requests">
            <h2>Total Requests</h2>
            <p>{totalRequests}</p>
        </div>
    );
};

export default TotalRequests;
