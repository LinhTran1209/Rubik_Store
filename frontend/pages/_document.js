import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps };
    }

    render() {
        return (
            <Html lang="en">
                <Head>
                    <link id="theme-css" href={`/themes/lara-light-indigo/theme.css`} rel="stylesheet"></link>

                    <meta charset="UTF-8" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <title>Rubik Store</title> 
                    {/* <link typeof='image/x-icon' rel="shortcut icon" href="" /> */}

                    {/* <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />

                    <link rel="stylesheet" href="/assets/css/base.css" />
                    <link rel="stylesheet" href="/assets/css/index.css" />
                    <link rel="stylesheet" href="/assets/css/modal_login_register.css" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" />
                    <link rel="stylesheet" href="/assets/fonts/fontawesome-free-6.5.2-web/css/all.min.css" />


                    <script src="/assets/js/jquery-3.7.1.js"></script>
                    <script src="/assets/js/Scroll.js"></script>
                    <script src="/assets/js/modal_register_login.js"></script>
                    <script src="/assets/js/middle__header.js"></script> */}
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}

export default MyDocument;
