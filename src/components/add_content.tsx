"use client";

import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '@/app/firebase/dbm';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';

export default function Add_Content({ token = "" }) {
    const maxItems = 30;
    const router = useRouter();
    const [content, setContent] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingData, setEditingData] = useState<any>(null);

    const [contentTitle, setContentTitle] = useState('');

    const [inEditLoading, setInEditLoading] = useState(false)

    useEffect(() => {
        const f = async () => {
            setInEditLoading(true);
            let error = false;
            await getDoc(doc(db, "CourseContents", token))
                .then(r => {
                    if (r.data()) {
                        const d = r.data();
                        setContent([...d?.data]);
                        setContentTitle(d?.title)
                        setInEditLoading(false);
                    } else {
                        error = true;
                    }
                })
                .catch(() => { error = true; })
            if (error) {
                toast({
                    title: "Can't edit content",
                    description: "Be sure token is right",
                    style: { background: "#151515", color: "white", }
                });
                setInEditLoading(false);
            }
        }
        if (token) {
            f();
        }
    }, [token])



    function AddItem(itemType: string) {
        if (content.length + 1 > maxItems) {
            toast({
                title: "Can't add item",
                description: "Reached the limit",
                style: {
                    background: "#151515",
                    color: "white",
                }
            });
            return;
        }
        switch (itemType) {
            case "video":
                setContent(prev => [
                    ...prev,
                    { type: "video", target: "" }
                ]);
                break;
            case "title":
                setContent(prev => [
                    ...prev,
                    { type: "title", text: "New Title", size: 25 }
                ]);
                break;
            case "paragraph":
                setContent(prev => [
                    ...prev,
                    { type: "paragraph", text: "New Paragraph" }
                ]);
                break;
            case "link":
                setContent(prev => [
                    ...prev,
                    { type: "link", target: "#", text: "New Link" }
                ]);
                break;
        }
    }

    function DeleteItem(index: number) {
        setContent(prev => prev.filter((_, i) => i !== index));
    }

    function EditItem(index: number) {
        setEditingIndex(index);
        setEditingData(content[index]);
        setIsEditing(true);
    }

    function SaveEdit() {
        if (editingIndex === null) return;

        const updatedContent = [...content];
        updatedContent[editingIndex] = editingData;

        setContent(updatedContent);
        setEditingIndex(null);
        setIsEditing(false);
        setEditingData(null);
    }

    function GetObjectByType(item: any) {
        switch (item.type) {
            case "video": return (
                <div className='w-75 h-100'>
                    <ReactPlayer
                        width="100%"
                        controls={true}
                        url={`https://youtu.be/${item.target}`}
                    />
                </div>)
            case "title": return (
                <p style={{ fontSize: `${item.size}px` }}>{item.text}</p>
            )
            case "paragraph": return (
                <p className='text-l'>{item.text}</p>
            )
            case "link": return (
                <a title={`Goes to : ${item.target}`} className='text-[#37A4ED] text-xl'>{item.text}</a>
            )
        }
    }

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [dropdownOpenIndex, setDropdownOpenIndex] = useState<number | null>(null);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (index: number) => {
        if (draggedIndex === null) return;
        const updatedContent = [...content];
        const [movedItem] = updatedContent.splice(draggedIndex, 1);
        updatedContent.splice(index, 0, movedItem);
        setContent(updatedContent);
        setDraggedIndex(null);
    };

    const [postState, setPostState] = useState(false)


    function PublishContent() {
        if (postState) {
            toast({
                title: "Publishing ...",
                description: "it might take up to 5min",
                style: {
                    background: "#151515",
                    color: "white",
                }
            });
            return
        }
        if (contentTitle.replace(" ", "").length < 1) {
            toast({
                title: "Cant publish content",
                description: "Title must be valid",
                style: {
                    background: "#151515",
                    color: "white",
                }
            });
            return
        }
        if (content.length < 1) {
            toast({
                title: "Cant publish content",
                description: "Add more item",
                style: {
                    background: "#151515",
                    color: "white",
                }
            });
            return
        }
        toast({
            title: "Publishing...",
            description: "it wont take long time :)",
            style: {
                background: "#151515",
                color: "white",
            }
        });
        setPostState(true)
        setDoc(doc(db, "CourseContents", token ? token : crypto.randomUUID() || ""),
            {
                "data": content,
                "title": contentTitle,
                "time": serverTimestamp()
            })
            .then(() => {
                toast({
                    title: "Content Published",
                    description: "You can now use for courses",
                    style: {
                        background: "#151515",
                        color: "white",
                    }
                });
                router.push("/dashboard/courses/contents")
            }).catch(() => {
                setPostState(false)
            })
    }

    return (
        <div className='d-flex flex-col w-100 h-100'>
            <div className='d-flex gap-x-6'>
                <h3>Content Title</h3>
                <Input placeholder='Type your content title here' required maxLength={32} className='placeholder:text-[#cccccc] bg-dark w-50 md:w-25'
                    value={contentTitle}
                    onChange={(e) => setContentTitle(e.target.value)} />
            </div>
            <div className="w-100 d-flex flex-col-reverse gap-y-3 mt-2 lg:flex-row">
                <div className='w-100 h-100 d-flex flex-column items-center'>
                    <div className='h-100  w-100 overflow-auto d-flex flex-column gap-y-3'>
                        {inEditLoading && (<div className='bg-[#252525] rounded-3 p-2 m-3 animate-pulse text-3xl'>Fetching content data ...</div>)}
                        {content.map((e, i) => (
                            <div
                                key={i}
                                draggable
                                onDragStart={() => handleDragStart(i)}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(i)}
                                className='d-flex md:w-50 w-100 gap-x-3 h-auto'>
                                <div className='items-center h-100 d-flex cursor-pointer'>
                                    <button
                                        onClick={() => setDropdownOpenIndex(dropdownOpenIndex === i ? null : i)}
                                        className='border-1 border-[#909090] h-[2rem] md:h-[3rem] text-center aspect-square rounded hover:bg-[#454545]'>
                                        <i className="fa-solid fa-ellipsis-vertical"></i>
                                    </button>
                                    {dropdownOpenIndex === i && (
                                        <div className='absolute mt-2 bg-[#303030] border border-[#454545] rounded p-2'>
                                            <button
                                                onClick={() => { DeleteItem(i); setDropdownOpenIndex(null); }}
                                                className='block w-full text-left p-2 hover:bg-[#454545] text-danger'>
                                                <i className="fa-solid fa-trash"></i> Delete
                                            </button>
                                            <button
                                                onClick={() => { EditItem(i); setDropdownOpenIndex(null); }}
                                                className='block w-full text-left p-2 hover:bg-[#454545]'>
                                                <i className="fa-solid fa-edit"></i> Edit
                                            </button>
                                            <button
                                                onClick={() => { setDropdownOpenIndex(null); }}
                                                className='block w-full text-left p-2 hover:bg-[#454545]'>
                                                <i className="fa-solid fa-x"></i> Close
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <div className='w-100 cursor-pointer d-flex'>
                                    {GetObjectByType(e)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className='md:w-100 p-3 bg-[#202020] rounded-xl h-fit'>
                    <p className='text-center text-l m-0 p-0'>Toolbar</p>
                    <div className='m-0 d-flex gap-y-1 justify-between lg:justify-start lg:flex-col'>
                        <Button onClick={() => { AddItem("video") }} variant="ghost" className='w-100 lg:w-auto lg:justify-start d-flex gap-x-3 text-l lg:text-2xl items-center p-1 rounded'>
                            <i className="fa-brands fa-youtube"></i>
                            Video
                        </Button>
                        <Button onClick={() => { AddItem("title") }} variant="ghost" className='w-100 lg:w-auto lg:justify-start d-flex gap-x-3 text-l lg:text-2xl items-center p-1 rounded'>
                            <i className="fa-solid fa-heading"></i>
                            Title
                        </Button>
                        <Button onClick={() => { AddItem("paragraph") }} variant="ghost" className='w-100 lg:w-auto lg:justify-start d-flex gap-x-3 text-l lg:text-2xl items-center p-1 rounded'>
                            <i className="fa-solid fa-paragraph"></i>
                            Paragraph
                        </Button>
                        <Button onClick={() => { AddItem("link") }} variant="ghost" className='w-100 lg:w-auto lg:justify-start d-flex gap-x-3 text-l lg:text-2xl items-center p-1 rounded'>
                            <i className="fa-solid fa-arrow-up-right-from-square"></i>
                            Link
                        </Button>
                    </div>
                    <div className='w-100 d-flex md:flex-row items-center gap-x-4 justify-center mt-2'>
                        <p className='text-center text-l m-0 p-0'>Items {content.length}/{maxItems}</p>
                        <Button className='bg-[#408040] hover:bg-[#306030]' onClick={() => { PublishContent() }}>
                            Publish
                        </Button>
                    </div>
                </div>
            </div>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent className='bg-dark w-75 rounded-4'>
                    <DialogTitle>Edit Item</DialogTitle>
                    <DialogDescription>
                        {editingData?.type === 'video' && (
                            <input
                                type="text"
                                value={editingData?.target || ''}
                                onChange={(e) => setEditingData({ ...editingData, target: e.target.value })}
                                placeholder="Youtube video ID"
                                className="w-full p-2 rounded text-white"
                            />
                        )}
                        {editingData?.type === 'title' && (
                            <>
                                <input
                                    type="text"
                                    value={editingData?.text || ''}
                                    onChange={(e) => setEditingData({ ...editingData, text: e.target.value })}
                                    placeholder="Title text"
                                    className="w-full p-2 rounded text-white"
                                />
                                <input
                                    type="number"
                                    value={editingData?.size || ''}
                                    onChange={(e) => setEditingData({ ...editingData, size: Number(e.target.value) })}
                                    placeholder="Title size"
                                    className="w-full p-2 rounded text-white"
                                    min={10} max={40}
                                />
                            </>
                        )}
                        {editingData?.type === 'paragraph' && (
                            <textarea
                                value={editingData?.text || ''}
                                onChange={(e) => setEditingData({ ...editingData, text: e.target.value })}
                                placeholder="Paragraph text"
                                className="w-full p-2 rounded text-white"
                            />
                        )}
                        {editingData?.type === 'link' && (
                            <>
                                <input
                                    type="text"
                                    value={editingData?.text || ''}
                                    onChange={(e) => setEditingData({ ...editingData, text: e.target.value })}
                                    placeholder="Link text"
                                    className="w-full p-2 rounded text-white"
                                />
                                <input
                                    type="text"
                                    value={editingData?.target || ''}
                                    onChange={(e) => setEditingData({ ...editingData, target: e.target.value })}
                                    placeholder="Link target"
                                    className="w-full p-2 rounded text-white"
                                />
                            </>
                        )}
                        <Button onClick={SaveEdit} className='mt-3'>Save</Button>
                    </DialogDescription>
                </DialogContent>
            </Dialog>
        </div>
    )
}
