import React from 'react'

import '../style/Footer.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle, faPaperPlane, faSearch } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
    return (
        <footer className="footer-container space-navbar">
            <div className="footer">&copy;Devents2020</div>
            <div className="footer"></div>
            <div className="footer">
                <FontAwesomeIcon className="icon" icon={faQuestionCircle} />
                <FontAwesomeIcon className="icon" icon={faPaperPlane} />
                <FontAwesomeIcon className="icon section" icon={faSearch} />
            </div>
        </footer>
    )
}