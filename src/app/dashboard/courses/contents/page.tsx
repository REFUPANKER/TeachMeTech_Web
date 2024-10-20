"use client";
import { db } from '@/app/firebase/dbm'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from '@/hooks/use-toast';
import { WhereFilterOp, collection, deleteDoc, doc, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { PenBoxIcon, Trash2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player';

export default function contents() {

  const [contents, setContents] = useState<any[]>([])

  async function GetContents(condition: WhereFilterOp, timestamp: any, range = 10, timeOrder: any = "desc") {
    const r = await getDocs(
      query(collection(db, "CourseContents"),
        where("time", condition, timestamp),
        orderBy("time", timeOrder),
        limit(range)))
    const rc: any = r.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setContents(rc)
    return rc
  }
  useEffect(() => {
    const c = async () => {
      await GetContents('>=', new Date(0))
    }
    c()
  }, [])

  function DateConverter(time: any) {
    return new Date(time.seconds * 1000 + time.nanoseconds / 1e6).toISOString().split('T')[0];
  }

  async function DeleteContent(token: string) {
    try {
      toast({
        title: "Deleting content ...",
        description: "it might take up to 5min",
        style: { background: "#151515", color: "white" }
      });
      await deleteDoc(doc(db, "CourseContents", token));
      await GetContents('>=', new Date(0));
      toast({
        title: "Content deleted",
        description: "its not existing anymore",
        style: { background: "#151515", color: "white" }
      });
    } catch (error) {
      alert("Error : cant deleting content");
    }
  }

  return (
    <div className='overflow-x-hidden overflow-auto h-[80vh]'>
      <h3 className="mb-4">Listing Contents</h3>
      {contents.length==0&&(
          <div className='alert alert-warning d-flex gap-x-2 items-center'>
            <i className='fas fa-warning'></i>
            No contents existing
          </div>
        )}
      <div className="row g-3">
        {contents.map((e, i) => (
          <div key={i} className="col-6 col-md-3">
            <div className="d-flex flex-column p-2 rounded-3 border-2 border-solid border-[#303030] bg-[#202020] h-100">
              <div onClick={() => { alert(e.id) }} className='cursor-pointer d-flex gap-x-3 justify-between'>
                <h5><u>{e.title}</u></h5>
                <PenBoxIcon />
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
                              <div className='h-[20vh]'>
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

              <mark className="rounded-3 bg-[#151515] p-2 d-flex justify-between">
                {DateConverter(e.time)}
                <Trash2Icon onClick={() => { DeleteContent(e.id) }} className='text-danger cursor-grab active:cursor-grabbing' />
              </mark>
              <i className='text-center text-[#909090] text-xs mt-2 cursor-pointer hover:underline active:text-[#b8b8b8]' onClick={() => {
                navigator.clipboard.writeText(e.id)
                alert("Content token copied to clipboard")
              }}>
                {e.id}
              </i>
            </div>
          </div>
        ))}
      </div>
    </div>

  )
}
