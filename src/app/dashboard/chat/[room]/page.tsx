"use client";
import { getMsInTimeZone, rtdb } from '@/app/firebase/dbm';
import { Button } from '@/components/ui/button';
import {
    onChildAdded, onChildChanged, onChildRemoved, onValue, query, ref, off, startAt, orderByChild, startAfter, orderByValue, set, serverTimestamp, push, orderByPriority, endAt
} from 'firebase/database';
import React, { useEffect, useState } from 'react';

export default function Page({ params }: { params: any }) {
    const [messages, setMessages] = useState<any[]>([]);
    const messagesRef = ref(rtdb, `/ChatRooms/${params.room}/Messages/`);
    
    useEffect(() => {
        const currentTimestamp = Date.now();
        const messagesQuery = query(
            messagesRef,
            orderByChild("timestamp"),
            endAt(currentTimestamp),
        );

        const handleValueChange = (snapshot: any) => {
            const data = snapshot.val();
            const sortedMessages = data ? Object.values(data).sort((a: any, b: any) => a.timestamp - b.timestamp) : [];
            setMessages(sortedMessages);
        };        

        const handleChildAdded = (snapshot: any) => {
            setMessages((prev) => [...prev, snapshot.val()]);
        };

        const handleChildChanged = (snapshot: any) => {
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === snapshot.key ? snapshot.val() : msg
                )
            );
        };

        const handleChildRemoved = (snapshot: any) => {
            setMessages((prev) =>
                prev.filter((msg) => msg.id !== snapshot.key)
            );
        };

        onValue(messagesQuery, handleValueChange);
        onChildAdded(messagesQuery, handleChildAdded);
        onChildChanged(messagesQuery, handleChildChanged);
        onChildRemoved(messagesQuery, handleChildRemoved);

        return () => {
            off(messagesQuery);
        };
    }, [params.room]);

    return (
        <div className='d-flex flex-col'>
            <h3>Displaying {params.room}</h3>
            <Button onClick={(e) => {
                set(ref(rtdb, `/ChatRooms/${params.room}/Messages/${crypto.randomUUID()}`), {
                    "token": Date.now(),
                    "sender": "asd",
                    "timestamp": getMsInTimeZone("America/Chicago"),
                    "message": "ts" + Date.now(),
                    "user": Date.now(),
                })
            }}>send</Button>
            <div>
                {messages.map((msg, index) => (
                    <div key={index}>{msg.message}</div>
                ))}
            </div>
        </div>
    );
}
//77455
//09383
