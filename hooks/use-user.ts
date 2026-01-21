"use client"
import {useEffect, useState} from "react";
import {UserResponse} from "@/dtos/user";
import {USER_KEY} from "@/constaints";
export const useCurrentUser = () => {
    const [user, setUser] = useState<UserResponse | null>(null);
    useEffect(() => {
        const data = localStorage.getItem(USER_KEY);
        if (data) {
            setUser(JSON.parse(data) as UserResponse);
        }
    }, []);
    return {...user};
};