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


                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" />
                    <link rel="stylesheet" href="/assets/css/base.css" />
                    <link rel="stylesheet" href="/assets/css/index.css" />
                    <link rel="stylesheet" href="/assets/css/introduce.css" />
                    <link rel="stylesheet" href="/assets/css/news.css" />
                    <link rel="stylesheet" href="/assets/css/manualRubik.css" />
                    <link rel="stylesheet" href="/assets/css/modal_login_register.css" />
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css" />
                    <link rel="stylesheet" href="/assets/fonts/fontawesome-free-6.5.2-web/css/all.min.css" />
                
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
