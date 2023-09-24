import React, { useState } from 'react';
import './result_pagination.css';

export default function ResultPagination({ pageNum, updatePageFn }) {
    const maxButtons = 10;
    const [btnPage, setBtnPage] = useState({ current: 1, total: pageNum });
    const btnNeeded = pageNum - (btnPage.current * maxButtons) > 0 ? maxButtons : maxButtons + pageNum - (btnPage.current * maxButtons);
    //e.g. 10 btn at a time means need 5 btn page, if 41 pages needed => 5 btn page => 5th btn page => 41-50 > 0 (false) => 10 + (41-50)
    //5th btn page has 1 btn

    function handleChange(event) {
        setBtnPage({ ...btnPage, ...{ current: Number.parseInt(event.target.value) } });
    }

    return (
        <div>
            <div className='page-button-wrapper'>
                {Array(pageNum <= maxButtons ? pageNum : btnNeeded).fill(btnPage.current - 1).map((num, index) =>
                    <button key={num * maxButtons + index + 1} className='page-button' onClick={() => updatePageFn(num * maxButtons + index + 1)}>{num * maxButtons + index + 1}</button>)}
            </div>
            {pageNum <= maxButtons ? null : <div className='page-button-select-wrapper'>Pages <select className='page-button-select' onChange={handleChange}>
                {Array(Math.ceil(pageNum / maxButtons)).fill(1).map((num, index) =>
                    <option key={'btnPg' + index} value={index + 1}>{index * maxButtons + 1} - {Math.min(pageNum, (index + 1) * maxButtons)}</option>)}
            </select></div>
            }
        </div>
    )
}