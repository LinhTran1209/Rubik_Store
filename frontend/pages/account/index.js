import CustomToast from '../../components/CustomToast';
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Account = () => {
    return (
        <div>
            <h1>Account</h1>
        </div>
    );
}

Account.getLayoutWeb = function getLayoutWeb(page) {
    return page;
};  


export default Account;