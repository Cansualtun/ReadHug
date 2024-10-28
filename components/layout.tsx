"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMeMutation } from "@/store/UserStore";
import Cookies from "js-cookie";

export default function Layout({ children }: { children: React.ReactNode }) {
    const [me] = useMeMutation();
    const router = useRouter();

    useEffect(() => {
        const fetchUserData = async () => {
            const token = Cookies.get("token");
            if (!token) {
                router.push("auth/login");
            } else {
                await me();
            }
        };
        fetchUserData();
    }, [me, router]);

    return <div>{children}</div>;
}
