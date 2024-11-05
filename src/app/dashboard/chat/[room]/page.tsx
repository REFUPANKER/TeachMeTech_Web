"use client";
import { auth, focusTo, getServerTimeZone, rtdb } from '@/app/firebase/dbm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import {
    onChildAdded, onChildChanged, onChildRemoved, onValue, query, ref, off, startAt, orderByChild, set, remove, get, serverTimestamp
} from 'firebase/database';
import { Send } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export default function Page({ params }: { params: any }) {
    const [messages, setMessages] = useState<any[]>([]);
    const dbRefRoot = `/ChatRooms/${params.room}/Messages/`;
    const messagesRef = ref(rtdb, dbRefRoot);

    // current timezone of server
    const [ctm, setCtm] = useState<number | null>(null);
    const [roomState, setRoomState] = useState(false);

    const SwitchActiveState = useCallback(async (entry: boolean) => {
        setRoomState(entry);
        await set(ref(rtdb, `/ChatRooms/${params.room}/State`), entry);
    }, [params.room]);

    useEffect(() => {
        const getCtm = async () => {
            const x = await getServerTimeZone();
            setCtm(x);
        }
        const getState = async () => {
            // check roomstate
            await get(query(ref(rtdb, `/ChatRooms/${params.room}/State`)))
                .then(e => {
                    if (e.val() === null) {
                        SwitchActiveState(true);
                    } else {
                        setRoomState(e.val());
                    }
                })
        }

        getCtm();
        getState();
    }, [params.room])


    useEffect(() => {
        if (ctm === null) return;

        const messagesQuery = query(
            messagesRef,
            orderByChild("timestamp"),
            startAt(ctm),
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

    }, [ctm, params.room]);


    const [message, setMessage] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (message.trim()) {
            const msgToken = crypto.randomUUID()
            set(ref(rtdb, `/ChatRooms/${params.room}/Messages/${msgToken}`), {
                "token": msgToken,
                "sender": "Admin",
                "timestamp": serverTimestamp(),
                "message": message.trim(),
                "user": auth.currentUser?.uid,
            })
            setMessage('')
        } else {
            toast({
                title: "Type message",
                description: "cant sent emtpy message",
                style: { background: "#151515", color: "white" }
            });
            focusTo("adminMsgEntry")
        }
    }

    async function RemoveMessage(token: string) {
        await remove(ref(rtdb, dbRefRoot.concat(token)))
    }

    const nameColors = useRef(new Map());

    const getRandomHexColor = (token: string) => {
        if (nameColors.current.has(token)) {
            return nameColors.current.get(token);
        }
        const min = 100;
        const max = 200;
        let r = 100, g = 100, b = 100;
        switch (Math.floor(Math.random() * 3)) {
            case 0:
                r = Math.floor(Math.random() * (max - min) + min);
                g = Math.floor(Math.random() * (min + max - r) + min);
                b = Math.floor(Math.random() * (min + max - r) + min);
                break;
            case 1:
                g = Math.floor(Math.random() * (max - min) + min);
                r = Math.floor(Math.random() * (min + max - g) + min);
                b = Math.floor(Math.random() * (min + max - g) + min);
                break;
            case 2:
                b = Math.floor(Math.random() * (max - min) + min);
                r = Math.floor(Math.random() * (min + max - b) + min);
                g = Math.floor(Math.random() * (min + max - b) + min);
                break;
        }
        const color = `rgb(${r},${g},${b})`;
        nameColors.current.set(token, color);
        return color;
    };

    return (
        <div className='d-flex flex-col'>
            <div className='d-flex gap-x-2'>
                <h3>{params.room}</h3>
                <div className='d-flex gap-x-2 items-center'>
                    Room State
                    <Switch
                        checked={roomState}
                        onCheckedChange={e => SwitchActiveState(e)}
                        title={`Currenlty : ${roomState === true ? "open" : "closed"}`}
                        className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-gray-400" />
                </div>
            </div>
            <div className="w-full mx-auto p-1 mb-2 bg-[#303030] rounded-lg shadow-lg">
                <form onSubmit={handleSubmit} className="flex items-center space-x-2">
                    <Input
                        id='adminMsgEntry'
                        type="text"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-grow bg-[#202020] text-white"
                    />
                    <Button type="submit" variant="ghost" size="icon" className="text-white hover:bg-[#707070] focus:ring-2 focus:ring-blue-500">
                        <Send className="h-5 w-5" />
                        <span className="sr-only">Send message</span>
                    </Button>
                </form>
            </div>
            <div className='h-[70vh] overflow-auto d-flex flex-column gap-y-2'>
                {messages.length <= 0 && (<>No messages</>)}
                {messages.map((msg, index) => (
                    <div key={index}>
                        <div className='d-flex items-start gap-x-2'>
                            <i onClick={() => { RemoveMessage(msg.token) }} className='fas fa-trash text-danger cursor-pointer p-3 text-xl rounded-3 hover:bg-[#252525] active:bg-[#151515]'></i>
                            <div>
                                <h5 className='d-flex gap-x-2 items-center'>
                                    <u style={{ color: getRandomHexColor(msg.sender) }}>{msg.sender}</u>
                                    <i className='text-[#707070] text-xs'>{msg.user}</i>
                                </h5>
                                <h6>{msg.message}</h6>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}