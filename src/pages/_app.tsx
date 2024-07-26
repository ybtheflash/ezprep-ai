import React, { useState, useEffect } from "react";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import Head from "next/head";
import "../styles/globals.css";
import Preloader from "../components/preloader";

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleStart = (url: string) => {
      setLoading(true);
    };

    const handleComplete = (url: string) => {
      setTimeout(() => setLoading(false), 1000); // Ensure minimum 1 second display
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <>
      <Head>
        <title>ezPrep AI - Master New Skills With ProjectQ</title>
        <meta
          name="description"
          content="AI-powered learning platform for effortless skill acquisition and enjoyable knowledge growth."
        />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="any" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Solway&family=Alata&display=swap"
          rel="stylesheet"
        />
      </Head>
      {loading && <Preloader />}
      <div className="min-h-screen">
        <Component {...pageProps} />
      </div>
      <footer className="py-6 text-center text-black-600">
        © 2024 ezPrep AI. All rights reserved.
      </footer>
    </>
  );
}

export default MyApp;
