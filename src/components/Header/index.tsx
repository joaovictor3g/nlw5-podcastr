import React from 'react';
import format from 'date-fns/format';
import ptBr from 'date-fns/locale/pt-BR';

import { BiMenu } from 'react-icons/bi';
import styles from './styles.module.scss';

export function Header() {
    const currentDate = format(new Date(), 'EEEEEE, d MMM', {
        locale: ptBr
    });

    return (
        <header className={`${styles.headerContainer} ${styles.responsiveHeader}`}>
            <img src="/logo.svg" />

            <p>O melhor para você ouvir, sempre</p>

            <span>{currentDate}</span>

            <BiMenu 
                size={24} 
                color="#000"
                className={styles.icon}    
            />
        </header>
    );
}