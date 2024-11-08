"use client";
import React, { useEffect } from 'react'

export default function UserProfile({ token }: { token: string }) {
    // decide is profile editable (user uid checker)
    useEffect(() => {
        console.log("qwe");
    }, []);
    return (
        <div>Profile {token}</div>
    )
}
