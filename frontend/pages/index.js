import React, { useEffect } from "react";
import { useRouter } from "next/router"; 

// let reset = false;

// function setResetTrue() {
//     reset = true;
// }

// function setResetFalse() {
//     reset = false;
// }

// module.exports = {
//     setResetTrue,
//     setResetFalse,
//     getReset: () => reset 
// };

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