//V
// JudgeHome.js
import React from 'react';
import JudgeButtons from './JudgeButtons';
import { storages } from '../../stores';
import { observer } from 'mobx-react-lite';
import Feed from '../../utils/Feed';
import './JudgeHome.css';


const JudgeHome = observer(() => {
    const { userStorage } = storages;
    const user = userStorage.user;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-blue-50">
            <header className="py-6 bg-white text-center border-b border-gray-200">
            
            <h3 className="anton-regular"> <span style={{ color: '#175a94' }}>Welcome, Judge {user?.name}!</span></h3>
                <JudgeButtons />
            </header>
            <Feed />
        </div>
    );
});

export default JudgeHome;