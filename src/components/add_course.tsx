"use client"
import React, { useCallback, useEffect, useState } from 'react'
import { Button } from './ui/button'
import Link from 'next/link'
import { CircleXIcon, ExternalLinkIcon } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import ReactPlayer from 'react-player'
import { toast } from '@/hooks/use-toast'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db, focusTo } from '@/app/firebase/dbm'
import { useRouter } from 'next/navigation'

export default function Add_Course({ token = "" }) {
    const maxContentCount = 20;
    const [searchEntry, setSearchEntry] = useState("")
    const [contentImports, setContentImports] = useState<any[]>([])
    const [importLoading, setImportLoading] = useState(false)

    const router = useRouter();

    const [courseTitle, setCourseTitle] = useState("")
    const [courseDescription, setCourseDescription] = useState("")
    const [courseCategory, setCourseCategory] = useState("")

    const [inEditLoading, setInEditLoading] = useState(false)

    const TryMakeImport = useCallback(async (token: any, directImport = false) => {
        let error = false;
        if (!directImport) {
            if (contentImports.length + 1 > maxContentCount) {
                toast({
                    title: "Cant import content",
                    description: "You reached to content limit",
                    style: { background: "#151515", color: "white" }
                });
                return;
            }
            if (searchEntry.replace(" ", "").length < 1) {
                toast({
                    title: "Fill the import input",
                    description: "import search not valid",
                    style: { background: "#151515", color: "white" }
                });
                setSearchEntry("")
                return;
            }
        }
        setImportLoading(true);
        setSearchEntry("")
        try {
            await getDoc(doc(db, "CourseContents", token))
                .then(r => {
                    if (!r.data()) {
                        error = true;
                    } else {
                        setContentImports(pre => [...pre, { "id": r.id, ...r.data() }])
                    }
                })
                .catch(() => { error = true })
        } catch { error = true; }
        if (error == true) {
            toast({
                title: "Can't get content data",
                description: "be sure about token is right",
                style: { background: "#151515", color: "white" }
            });
        }
        setImportLoading(false);
    }, [contentImports.length,searchEntry]);


    useEffect(() => {
        const f = async () => {
            setInEditLoading(true);
            let error = false;
            try {
                const r = await getDoc(doc(db, "Courses", token))
                if (r && r.data()) {
                    const d = r.data();
                    setCourseTitle(d?.title)
                    setCourseDescription(d?.description)
                    setCourseCategory(d?.category)
                    d?.contents.forEach((e: any) => {
                        TryMakeImport(e, true);
                    })
                    setInEditLoading(false);
                } else {
                    error = true;
                }
            } catch { error = true; }

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
    }, [token, TryMakeImport])



    function DeleteItem(index: number) {
        setContentImports(prev => prev.filter((_, i) => i !== index));
    }
    function DateConverter(time: any) {
        return new Date(time.seconds * 1000 + time.nanoseconds / 1e6).toISOString().split('T')[0];
    }

    const [publishState, setPublishState] = useState(false)
    async function PublishCourse() {
        if (publishState == true) {
            toast({
                title: "Course is publishing ...",
                description: "it might take up to 5min",
                style: { background: "#151515", color: "white" }
            });
            return;
        }
        if (courseTitle.replace(" ", "").length < 1) {
            focusTo("Course_Title")
            return
        }
        if (courseDescription.replace(" ", "").length < 1) {
            focusTo("Course_Description")
            return
        }
        if (courseCategory.replace(" ", "").length < 1) {
            focusTo("Course_Category")
            return
        }
        if (contentImports.length == 0) {
            focusTo("Course_Imports")
            return
        }
        setPublishState(true);
        toast({
            title: "Publish started",
            description: "it might take up to 5min",
            style: { background: "#151515", color: "white" }
        });
        const importsTokens = contentImports.map(e => { return e.id })
        await setDoc(doc(db, "Courses", token ? token : crypto.randomUUID() || ""), {
            "date": serverTimestamp(),
            "likes": 0,
            "title": courseTitle,
            "description": courseDescription,
            "category": courseCategory,
            "contents": importsTokens
        }).then(() => {
            toast({
                title: "Publish completed",
                description: "Redirecting ...",
                style: { background: "#151515", color: "white" }
            });
            router.push("/dashboard/courses")
        }).catch(() => {
            setPublishState(false);
            toast({
                title: "Error while publishing",
                description: "Something went wrong",
                style: { background: "#151515", color: "white" }
            });
        })
    }

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
    };

    const handleDrop = (index: number) => {
        if (draggedIndex === null) return;
        const updatedContent = [...contentImports];
        const [movedItem] = updatedContent.splice(draggedIndex, 1);
        updatedContent.splice(index, 0, movedItem);
        setContentImports(updatedContent);
        setDraggedIndex(null);
    };

    return (
        <div className='d-flex flex-col gap-y-4'>
            {inEditLoading && (<div className='bg-[#252525] rounded-3 p-2 m-3 animate-pulse text-3xl'>Fetching content data ...</div>)}
            <div className='d-flex flex-col lg:flex-row gap-4'>
                <div className='d-flex flex-col w-full'>
                    <h4>Course Properties</h4>
                    <h6>Title</h6>
                    <input id='Course_Title' value={courseTitle} onChange={e => { setCourseTitle(e.target.value) }} required placeholder='Type Title' className='mb-3 p-2 rounded-3 border-2 border-solid border-[#505050]' maxLength={64} />
                    <h6>Description</h6>
                    <textarea id='Course_Description' value={courseDescription} onChange={e => { setCourseDescription(e.target.value) }} required placeholder='Type Description' className='max-h-[15vh] mb-3 p-2 rounded-3 border-2 border-solid border-[#505050]' maxLength={128} />
                    <h6>Category</h6>
                    <input id='Course_Category' value={courseCategory} onChange={e => { setCourseCategory(e.target.value) }} required placeholder='Type Category' className='mb-3 p-2 rounded-3 border-2 border-solid border-[#505050]' maxLength={16} />
                    <button onClick={() => { PublishCourse() }} className='btn btn-success'>Publish Course</button>
                </div>
                <div className='w-full d-flex flex-col mr-3'>
                    <h4 className='mb-0'>Steps</h4>
                    <div className='d-flex flex-col md:flex-row md:items-center gap-x-3 mb-2'>
                        <h6 className='m-0 p-0'>Type content token to import</h6>
                        <Link href={"/dashboard/courses/contents"} className='d-flex gap-x-1' target='_blank'>( Available Contents <ExternalLinkIcon />)</Link>
                    </div>
                    <div className='d-flex items-center gap-x-2'>
                        <input id='Course_Imports' required value={searchEntry} onChange={e => { setSearchEntry(e.target.value) }} placeholder='Type Content Token' className='w-100 p-2 rounded-3 border-2 border-solid border-[#505050]' maxLength={64} />
                        <Button onClick={() => { TryMakeImport(searchEntry) }} variant={"ghost"} className='border-2 border-solid border-[#505050]'>Import</Button>
                    </div>
                    <i>Contents added {contentImports.length}/{maxContentCount}</i>
                    <div className='d-flex flex-col mt-3 gap-y-2  overflow-auto'>
                        {importLoading && (
                            <div className="animate-pulse cursor-default d-flex flex-column p-2 rounded-3 border-2 border-solid border-[#303030] bg-[#202020] h-100">
                                <h5>Title Loading...</h5>
                                <p className='text-sm'>Fetching Items ...</p>
                                <mark className="rounded-3 bg-[#151515] p-2 d-flex justify-between">Reading Date ... </mark>
                            </div>
                        )}
                        {contentImports.map((e, i) => (
                            <div key={i}
                                draggable
                                onDragStart={() => handleDragStart(i)}
                                onDragOver={handleDragOver}
                                onDrop={() => handleDrop(i)}>
                                <div className="cursor-grab active:cursor-grabbing d-flex flex-column p-2 rounded-3 border-2 border-solid border-[#303030] bg-[#202020] h-100">
                                    <div className='d-flex gap-x-3 justify-between'>
                                        <h5><u>{e.title}</u></h5>
                                        <CircleXIcon onClick={() => { DeleteItem(i) }} className='text-danger cursor-grab active:cursor-grabbing' />
                                    </div>
                                    <Accordion type="single" collapsible>
                                        <AccordionItem value={`item-${i}`} className='border-none p-0 m-0'>
                                            <AccordionTrigger className='text-sm p-0 m-0'>Items</AccordionTrigger>
                                            <AccordionContent>
                                                {e.data.map((x: any, y: any) => (
                                                    <Accordion key={y} type="single" collapsible>
                                                        <AccordionItem value={`item-${i + y}`} className='border-none p-0 m-0'>
                                                            <AccordionTrigger className='text-xs border-none p-0 m-0'>{x.type}</AccordionTrigger>
                                                            <AccordionContent>
                                                                {x.type == "title" || x.type == "paragraph" ? (
                                                                    <div style={{ fontSize: (x.size ? x.size / 1.3 : 'unset') }}>{x.text}</div>
                                                                ) : (
                                                                    <div className='h-[40vh]'>
                                                                        <ReactPlayer
                                                                            width="100%"
                                                                            height="100%"
                                                                            controls={true}
                                                                            url={`https://youtu.be/${x.target}`}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </AccordionContent>
                                                        </AccordionItem>
                                                    </Accordion>
                                                ))}

                                            </AccordionContent>
                                        </AccordionItem>
                                    </Accordion>

                                    <mark className="rounded-3 bg-[#151515] p-2 d-flex justify-between items-center">
                                        {DateConverter(e.time)}
                                        <i className='text-center text-[#dddddd] text-xs cursor-pointer hover:underline active:text-[#b8b8b8]' onClick={() => {
                                            navigator.clipboard.writeText(e.id)
                                            alert("Content token copied to clipboard")
                                        }}>
                                            {e.id}
                                        </i>
                                    </mark>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
