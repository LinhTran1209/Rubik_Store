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

                    <link rel="icon" href={'https://res.cloudinary.com/dzweargsr/image/upload/v1742653489/favicon_mctiiz.ico'} type="image/x-icon"></link>
                    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" />
                    <link rel="stylesheet" href="/style/css/base.css" />
                    <link rel="stylesheet" href="/style/css/index.css" />
                    <link rel="stylesheet" href="/style/css/introduce.css" />
                    <link rel="stylesheet" href="/style/css/news.css" />
                    <link rel="stylesheet" href="/style/css/manualRubik.css" />
                    <link rel="stylesheet" href="/style/css/modal_login_register.css" />
                    <link rel="stylesheet" href="/style/css/detail_product.css" />
                    <link rel="stylesheet" href="/style/css/rubik2x2x2.css" />
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
