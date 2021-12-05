/**
 * We wrapped the root component of the app into the Layout component bcs we want to have it around all the pages.
 */

import Layout from '../components/layout/Layout'
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
        <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp
