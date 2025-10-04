// pages/_app.js
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/globals.css';

import Layout from '../components/Layout';
import { SWRConfig } from 'swr';

const fetcher = async (...args) => {
  const res = await fetch(...args);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
};

export default function App({ Component, pageProps }) {
  return (
    <SWRConfig value={{ fetcher }}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </SWRConfig>
  );
}
