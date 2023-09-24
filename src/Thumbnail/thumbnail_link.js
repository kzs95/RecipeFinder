// @ts-check
import React from 'react'
import { Link } from 'react-router-dom';

import './thumbnail_link.css';

export default function ThumbnailLink({ recipeId, thumbText, imgURL }) {
    return (
        <div className='thumbnail-flex'>
            <div><img className='landscape' alt={thumbText} title={thumbText} src={imgURL} /></div>
            <div>
                <Link to={'/recipe/' + recipeId}>{thumbText}</Link >
            </div>
        </div>
    )
}