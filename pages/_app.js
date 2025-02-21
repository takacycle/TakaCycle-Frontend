import '../styles/globals.css'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'

function MyApp({ Component, pageProps }) {
    const router = useRouter();

    // Check if the current route is under "/portal"
    const isPortalPage = router.pathname.startsWith('/portal');

    return isPortalPage ? (
        <Component {...pageProps} />
    ) : (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}

export default MyApp;
