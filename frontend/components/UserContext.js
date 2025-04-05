import React, { createContext, useContext, useState, useEffect } from "react";

import authService from "../services/authService";
import userService from "../services/userService";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userRole, setUserRole] = useState({ phone: "", role: "" });
    const [user, setUser] = useState({ id_user: "", role: "abc", name: "", email: "", phone: ""});
    const [loading, setLoading] = useState(true);

    const fetchUserRole = async () => {
        try {
            const userData = await authService.getCurrentUser();
            setUserRole({ phone: userData.phone, role: userData.role });
        } catch (error) {
            setUserRole({ phone: "", role: "" });
        } finally {
            setLoading(false);
        }
    };

    const fetchUser = async (phone) => {
        try {
            const userData = await userService.getData("phone", phone);
            setUser(userData[0] || { id_user: "", role: "", name: "", email: "", phone: "" });
        } catch (err) {
            console.log(err.message, "ở UserContext");
            setUser({ id_user: "", role: "", name: "", email: "", phone: "" });
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            setUserRole({ phone: "", role: "" });
            setUser({ id_user: "", role: "", name: "", email: "", phone: "" });
        } catch (error) {
            console.log(error.message, "ở UserContext logout");
        }
    };

    useEffect(() => {
        fetchUserRole();
    }, []);

    useEffect(() => {
        if (userRole.phone) {
            fetchUser(userRole.phone);
        } else {
            setUser({ id_user: "", role: "", name: "", email: "", phone: "" });
        }
    }, [userRole.phone]);

    return (
        <UserContext.Provider value={{ userRole, user, loading, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);