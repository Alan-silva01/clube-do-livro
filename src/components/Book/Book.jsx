
import React, { useState } from 'react';
import './Book.css';
import { ChevronRight, ChevronLeft } from 'lucide-react';

const Book = ({ pages, currentPage, onPageTurn }) => {
    // Logic to determine z-index and styles based on currentPage
    // pages is an array of content components

    return (
        <div className="book-container">
            <div className="book">
                {pages.map((pageContent, index) => {
                    // If index < currentPage, it is flipped (on the left pile)
                    // If index == currentPage, it is the current visible right page (or turning)
                    // If index > currentPage, it is on the right pile (underneath)

                    let zIndex = pages.length - index; // Default: lower pages are on top in the stack
                    if (index < currentPage) {
                        zIndex = index; // Once flipped, earlier pages should be on top of later flipped pages
                    }

                    const isFlipped = index < currentPage;

                    return (
                        <div
                            key={index}
                            className={`page ${index === 0 ? 'cover-page' : ''} ${isFlipped ? 'flipped' : ''}`}
                            style={{ zIndex }}
                        >
                            <div className="page-front">
                                {pageContent.front}
                            </div>
                            <div className="page-back">
                                {/* Back of the page could be empty or have content if we want double-sided */}
                                <div className="page-corner-decoration"></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Book;
