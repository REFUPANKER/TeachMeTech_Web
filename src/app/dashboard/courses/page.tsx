"use client";
import { db } from '@/app/firebase/dbm'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { WhereFilterOp, collection, deleteDoc, doc, getDocs, limit, orderBy, query, where } from 'firebase/firestore'
import { ChevronLeftIcon, ChevronRightIcon, Heart, PenBoxIcon, Trash2Icon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function courses() {

  const router = useRouter();
  const [Courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isEmpty, setIsEmpty] = useState(false)

  const [dateMin, setDateMin] = useState()
  const [dateMax, setDateMax] = useState()
  const [pageNumber, setPageNumber] = useState(-1)

  async function GetCourses(condition: WhereFilterOp, timestamp: any, timeOrder: any = "desc", range = 8) {
    setIsLoading(true);
    setIsEmpty(false);
    try {
      const r = await getDocs(
        query(collection(db, "Courses"),
          where("date", condition, timestamp),
          orderBy("date", timeOrder),
          limit(range)))
      const rc: any = r.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => b.date.seconds - a.date.seconds || b.date.nanoseconds - a.date.nanoseconds);
      if (rc.length > 0) {
        setDateMin(rc[rc.length - 1].date)
        setDateMax(rc[0].date)
        setCourses(rc)
        setPageNumber(pageNumber + (timeOrder == "asc" ? -1 : 1))
      } else {
        setPageNumber(0)
        setIsEmpty(true);
        setIsLoading(false);
      }
    } catch (e) { }
    setIsLoading(false);
  }
  useEffect(() => {
    const c = async () => {
      await GetCourses('>=', new Date(0))
    }
    c()
  }, [])

  function DateConverter(time: any) {
    return new Date(time.seconds * 1000 + time.nanoseconds / 1e6).toISOString().split('T')[0];
  }

  async function DeleteContent(token: string) {
    try {
      toast({
        title: "Deleting course ...",
        description: "it might take up to 5min",
        style: { background: "#151515", color: "white" }
      });
      await deleteDoc(doc(db, "Courses", token));
      await GetCourses('>=', new Date(0));
      toast({
        title: "Course deleted",
        description: "its not existing anymore",
        style: { background: "#151515", color: "white" }
      });
    } catch (error) {
      alert("Error : cant deleting course");
    }
  }

  function GetCoursesPaginated(forNext = true) {
    if (forNext) {
      GetCourses(">", dateMax, "asc")
    } else {
      GetCourses("<", dateMin, "desc")
    }
  }

  return (
    <div className='overflow-x-hidden d-flex flex-column h-fit'>
      <div className="mb-4 d-flex gap-x-4">
        <h3>Listing Courses</h3>
        {!isLoading && (
          <div className='d-flex items-center gap-x-4'>
            <Button onClick={() => { GetCoursesPaginated(true) }} variant={'ghost'} title='Previous Page'><ChevronLeftIcon /></Button>
            {pageNumber}
            <Button onClick={() => { GetCoursesPaginated(false) }} variant={'ghost'} title='Next Page'><ChevronRightIcon /></Button>
          </div>
        )}
      </div>
      <div className="row g-3">
        <div className='d-flex flex-column w-100'>
          {isLoading && (<div className='bg-[#252525] rounded-3 mb-3 p-2 animate-pulse text-3xl'>Fetching courses...</div>)}
          {!isLoading && (Courses.length == 0 || isEmpty) && (
            <div className='alert alert-warning d-flex gap-x-2 items-center'>
              <i className='fas fa-warning'></i>
              No courses existing
            </div>
          )}
        </div>
        {Courses.map((e, i) => (
          <div key={i} className="col-6 col-lg-3">
            <div className="d-flex flex-column p-2 rounded-3 border-2 border-solid border-[#303030] bg-[#202020] h-100">
              <div className='d-flex gap-x-3 justify-between'>
                <h5 className='cursor-default'><u>{e.title}</u></h5>
                <PenBoxIcon className='cursor-pointer' onClick={() => { router.push(`/dashboard/courses/edit/${e.id}`) }} />
              </div>
              <p>
                {e.description}
              </p>
              <Accordion type="single" collapsible>
                <AccordionItem value={`item-${i}`} className='border-none p-0 m-0'>
                  <AccordionTrigger className='text-sm p-0 m-0'>Contents</AccordionTrigger>
                  <AccordionContent>
                    <div>
                      {e.contents.map((x: any, y: any) => (
                        <div key={y} className='d-flex items-center gap-x-2'>
                          <ChevronRightIcon />
                          <Link href={`/dashboard/courses/contents/edit/${x}`} target='_blank' key={y}>{x}</Link>
                        </div>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
              <mark className="rounded-3 bg-[#151515] p-2 d-flex justify-between flex-wrap">
                <div className='d-flex items-center gap-x-2'>
                  <Heart /> {e.likes}
                </div>
                <div className='bg-[#303030] rounded-3 p-2'>
                  {e.category}
                </div>
              </mark>
              <div className='d-flex items-center justify-between mt-2'>
                {DateConverter(e.date)}
                <div className='hover:bg-[#303030] rounded-3 active:bg-[#151515] p-2' onClick={() => { DeleteContent(e.id) }} style={{ transition: "0.3s" }}>
                  <Trash2Icon className='text-danger cursor-grab active:cursor-grabbing ' />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
