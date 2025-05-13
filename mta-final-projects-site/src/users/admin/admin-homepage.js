//V
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { storages } from '../../stores';
import AdminButtons from './AdminButtons';
import Feed from '../../utils/Feed';
import axios from 'axios';
import { backendURL } from '../../config';

const AdminHome = observer(() => {
    const navigate = useNavigate();
    const { userStorage } = storages;
    const user = userStorage.user;
    const [judgeMap, setJudgeMap] = useState({});
    const [projectMap, setProjectMap] = useState({});

    useEffect(() => {
        // Fetch and cache the judge and project maps when the admin page loads
        const fetchJudgeAndProjectMaps = async () => {
            try {
                const response = await fetch(`${backendURL}/admin/judgesProjectsMaps`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();

                // Optionally, store the data in localStorage for future sessions
                localStorage.setItem('judgeMap', JSON.stringify(data.judges));
                localStorage.setItem('projectMap', JSON.stringify(data.projects));
            } catch (error) {
                console.error('Error fetching judge and project maps:', error);
            }
        };

        fetchJudgeAndProjectMaps();
    }, []);

    return (
        <div className="max-w-3xl mx-auto p-6 bg-blue-50">
            <header className="py-6 bg-white text-center border-b border-gray-200"> 
            <h3 className="anton-regular"> <span style={{ color: '#175a94' }}>Welcome, Admin {user?.name}!</span></h3>
                <AdminButtons />
            </header>
            <Feed />
        </div>
    );
});

export { AdminHome };
