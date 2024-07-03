// src/App.js

import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import Charts from './Charts'; // Import or create Charts component
import './App.css';
import ApiLogs from './ApiLogs';
const App = () => {
    return (
        <Router>
            <div className="App">
                <div className="content">
                    <Routes>
                        <Route path="/" element={<ApiLogs />} />
                        <Route path="/charts" element={<Charts />} />
                    </Routes>
                </div>
                <div className="sidebar">
                    {/* No sidebar links */}
                </div>
            </div>
        </Router>
    );
};

export default App;
