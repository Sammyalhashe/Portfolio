import Document, {
    Html,
    Main,
    NextScript,
    Head
} from 'next/document';

class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps
        };
    }

    render() {
        return (
            <Html>
                <Head>
                    <script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
                    <link rel="alternate" type="application/rss+xml" title="Notes from the Terminal" href="/rss.xml" />
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
