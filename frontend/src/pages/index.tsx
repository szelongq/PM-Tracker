import { Button } from "@chakra-ui/react";
import type { NextPage } from "next";
import Head from "next/head";

const HomePage: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>Test</h1>
        <Button>Test</Button>
      </main>
    </div>
  );
};

export default HomePage;
