import Head from 'next/head';
import React from 'react';

/**
 * ThemeHead - Carrega CDNs necessários para o tema Gardyn
 * Este componente deve ser incluído no Layout do tema
 */
export function ThemeHead() {
    return (
        <Head>
            {/* Font Awesome 6 - Ícones sociais e gerais */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
                integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
                crossOrigin="anonymous"
                referrerPolicy="no-referrer"
            />

            {/* Icofont - Ícones de contato (topbar e footer) */}
            <link
                rel="stylesheet"
                href="https://cdn.jsdelivr.net/npm/icofont@1.0.1/dist/icofont.min.css"
            />

            {/* Bootstrap 5 - Grid system (container, row, col-*) */}
            <link
                href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css"
                rel="stylesheet"
                integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN"
                crossOrigin="anonymous"
            />

            {/* Google Fonts - Plus Jakarta Sans e Heebo */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,200;1,300;1,400;1,500;1,600;1,700;1,800&family=Heebo:wght@200;300;400;500;600;700;800&display=swap"
                rel="stylesheet"
            />

            {/* Meta tags para melhor renderização */}
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </Head>
    );
}
