"use client";
import { db } from '@/app/firebase/dbm'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { WhereFilterOp, collection, deleteDoc, doc, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { ChevronLeftIcon, ChevronRightIcon, PenBoxIcon, Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player';

export default function contents() {

  const router = useRouter();
  const [contents, setContents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)

  const [dateMin, setDateMin] = useState()
  const [dateMax, setDateMax] = useState()
  const [pageNumber, setPageNumber] = useState(-1)

  async function GetContents(condition: WhereFilterOp, timestamp: any, timeOrder: any = "desc", range = 8) {
    setIsLoading(true);
    setIsEmpty(false);
    try {
      const r = await getDocs(
        query(collection(db, "CourseContents"),
          where("time", condition, timestamp),
          orderBy("time", timeOrder),
          limit(range)))
      const rc: any = r.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => b.time.seconds - a.time.seconds || b.time.nanoseconds - a.time.nanoseconds);
      if (rc.length > 0) {
        setDateMin(rc[rc.length - 1].time)
        setDateMax(rc[0].time)
        setContents(rc)
        setPageNumber(pageNumber + (timeOrder == "asc" ? -1 : 1))
      } else {
        setIsEmpty(true);
        setIsLoading(false);
      }
    } catch (e) { }
    setIsLoading(false);
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

  function GetContentsPaginated(forNext = true) {
    if (forNext) {
      GetContents(">", dateMax, "asc")
    } else {
      GetContents("<", dateMin, "desc")
    }
  }

  return (
    <div className='overflow-x-hidden d-flex flex-column h-fit'>
      <div className="mb-4 d-flex gap-x-4">
        <h3>Listing Contents</h3>
        {!isLoading && (
          <div className='d-flex items-center gap-x-4'>
            <Button onClick={() => { GetContentsPaginated(true) }} variant={'ghost'} title='Previous Page'><ChevronLeftIcon /></Button>
            {pageNumber}
            <Button onClick={() => { GetContentsPaginated(false) }} variant={'ghost'} title='Next Page'><ChevronRightIcon /></Button>
          </div>
        )}
      </div>
      <div className="row g-3">
        <div className='d-flex flex-column w-100'>
          {isLoading && (<div className='bg-[#252525] rounded-3 mb-3 p-2 animate-pulse text-3xl'>Fetching contents...</div>)}
          {!isLoading && (contents.length == 0 || isEmpty) && (
            <div className='alert alert-warning d-flex gap-x-2 items-center'>
              <i className='fas fa-warning'></i>
              No contents existing
            </div>
          )}
        </div>
        {contents.map((e, i) => (
          <div key={i} className="col-6 col-lg-3">
            <div className="d-flex flex-column p-2 rounded-3 border-2 border-solid border-[#303030] bg-[#202020] h-100">
              <div className='d-flex gap-x-3 justify-between'>
                <h5 className='cursor-default'><u>{e.title}</u></h5>
                <PenBoxIcon className='cursor-pointer' onClick={() => { router.push(`/dashboard/courses/contents/edit/${e.id}`) }} />
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
