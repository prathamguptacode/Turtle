import React from 'react';
import './Card.css';

type cardsT = {
    name: string;
    price: number;
    description: string;
    id: string;
};

function Card({ name, price, description, id }: cardsT) {
    return (
        <div>
            <div className="movie-card">
                {/* <img src={imageUrl} alt="movie poster" className="cardPoster" /> */}
                <div className="card-info">
                    <div className="card-title">{name}</div>

                    <div className="card-meta">
                        <span className="description">{description}</span>
                        <span className="price">${price}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Card;
