import React, { useEffect } from "react";
import { useRouter } from "next/router"; 


const Home = () => {
    const router = useRouter();

    useEffect(() => {

        router.push('/home');
    }, [router]);

    return null;
};

Home.getLayoutWeb = function getLayoutWeb(page) {
    return { page };
};

export default Home;