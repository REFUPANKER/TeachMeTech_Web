"use client";

import { WhereFilterOp, collection, deleteDoc, doc, getDocs, limit, orderBy, query, serverTimestamp, setDoc, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebase/dbm';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, Link, SquareArrowOutUpRight, Trash2Icon } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion';

export default function page() {

  const [Announcements, setAnnouncements] = useState<any[]>([]);
  const [isAnnoncsLoading, setIsAnnoncsLoading] = useState(false);
  const [isAnnoncsEmpty, setIsAnnoncsEmpty] = useState(false);

  const [dateMin, setDateMin] = useState();
  const [dateMax, setDateMax] = useState();
  const [pageNumber, setPageNumber] = useState(-1);

  async function GetAnnouncements(condition: WhereFilterOp, timestamp: any, timeOrder: any = "desc", range = 3) {
    setIsAnnoncsLoading(true);
    setIsAnnoncsEmpty(false);
    try {
      const r = await getDocs(
        query(
          collection(db, "Announcements"),
          where("date", condition, timestamp),
          orderBy("date", timeOrder),
          limit(range)
        )
      );
      const rc: any = r.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort(
          (a: any, b: any) =>
            b.date.seconds - a.date.seconds || b.date.nanoseconds - a.date.nanoseconds
        );
      if (rc.length > 0) {
        setDateMin(rc[rc.length - 1].date);
        setDateMax(rc[0].date);
        setAnnouncements(rc);
        setPageNumber(pageNumber + (timeOrder == "asc" ? -1 : 1));
      } else {
        setPageNumber(0);
        setIsAnnoncsEmpty(true);
      }
    } catch (e) { }
    setIsAnnoncsLoading(false);
  }

  useEffect(() => {
    const fetchInitialAnnouncements = async () => {
      await GetAnnouncements(">=", new Date(0));
    };
    fetchInitialAnnouncements();
  }, []);

  function DateConverter(time: any) {
    return new Date(time.seconds * 1000 + time.nanoseconds / 1e6)
      .toISOString()
      .split("T")[0];
  }

  async function DeleteAnnouncement(token: string) {
    try {
      toast({
        title: "Deleting announcement ...",
        description: "It might take up to 5min",
        style: { background: "#151515", color: "white" },
      });
      await deleteDoc(doc(db, "Announcements", token));
      await GetAnnouncements(">=", new Date(0));
      toast({
        title: "Announcement deleted",
        description: "It is no longer existing",
        style: { background: "#151515", color: "white" },
      });
    } catch (error) { }
  }

  function GetAnnouncementsPaginated(forNext = true) {
    if (forNext) {
      GetAnnouncements(">", dateMax, "asc");
    } else {
      GetAnnouncements("<", dateMin, "desc");
    }
  }

  const [annoncsTitle, setAnnoncsTitle] = useState("")
  const [annoncsDescription, setAnnoncsDescription] = useState("")
  const [annoncsLink, setAnnoncsLink] = useState("")
  const [annoncsPublishState, setAnnoncsPublishState] = useState(false)
  async function PublishAnnouncements() {
    if (annoncsPublishState == true) {
      toast({
        title: "Announcement publishing ...",
        description: "It might take up to 5min",
        style: { background: "#151515", color: "white" },
      });
      return;
    }
    if (annoncsTitle.replace(" ", "").length < 1 || annoncsDescription.replace(" ", "").length < 1) {
      toast({
        title: "Can't publish announcements",
        description: "Fill all fields",
        style: { background: "#151515", color: "white" }
      });
      return;
    }
    setAnnoncsPublishState(true);
    const newAnnonc = {
      "title": annoncsTitle,
      "description": annoncsDescription,
      "date": serverTimestamp(),
      "link": annoncsLink
    }

    await setDoc(doc(db, "Announcements", crypto.randomUUID()),
      {
        ...newAnnonc
      }).then(e => {
        toast({
          title: "New announcement published",
          description: "now its visible by all users",
          style: { background: "#151515", color: "white" }
        });
        GetAnnouncements(">=", new Date(0));
        setAnnoncsDescription("");
        setAnnoncsLink("");
        setAnnoncsTitle("");
        setAnnoncsPublishState(false);
      }).catch(e => {
        toast({
          title: "Publish failed",
          description: "Something went wrong",
          style: { background: "#151515", color: "white" }
        });
      })
  }

  return (
    <div className='h-100'>
      <h1>This is your control panel</h1>
      <div className='d-flex flex-column h-[90%] w-50'>
        <div className="d-flex gap-x-4">
          <h3>Announcements</h3>
          {!isAnnoncsLoading && (
            <div className='d-flex items-center gap-x-4'>
              <Button onClick={() => { GetAnnouncementsPaginated(true) }} variant={'ghost'} title='Previous Page'><ChevronLeftIcon /></Button>
              {pageNumber}
              <Button onClick={() => { GetAnnouncementsPaginated(false) }} variant={'ghost'} title='Next Page'><ChevronRightIcon /></Button>
            </div>
          )}
        </div>

        <Accordion type="single" collapsible>
          <AccordionItem value='item-1' className='border-none p-0 m-0'>
            <AccordionTrigger className='cursor-pointer text-xl p-1 m-0 bg-[#252525] d-flex justify-between items-center rounded-tl-lg rounded-tr-lg w-100'>
              Publish new one
              <div className='text-sm'>(because you cant edit)</div>
            </AccordionTrigger>
            <AccordionContent>
              <div className='d-flex flex-column bg-[#151515] p-2 rounded-bl-lg rounded-br-lg'>
                <h6>Title *</h6>
                <input value={annoncsTitle} onChange={(e) => setAnnoncsTitle(e.target.value)} placeholder='Type Title' className='w-100 p-2 rounded-3' maxLength={64} />
                <h6>Description *</h6>
                <textarea value={annoncsDescription} onChange={(e) => setAnnoncsDescription(e.target.value)} placeholder='Type Description' className='w-100 p-2 rounded-3' maxLength={128} />
                <h6>Link</h6>
                <input value={annoncsLink} onChange={(e) => setAnnoncsLink(e.target.value)} placeholder='Type Title' className='w-100 p-2 rounded-3' maxLength={64} />
                <button className='mt-2 btn btn-success' onClick={() => { PublishAnnouncements() }}>Publish</button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <div className='h-100 mt-2 d-flex flex-column gap-y-2'>
          {isAnnoncsLoading && (<div className='bg-[#252525] rounded-3 mb-3 p-2 animate-pulse text-3xl'>Fetching announcements...</div>)}
          {!isAnnoncsLoading && (Announcements.length == 0 || isAnnoncsEmpty) && (
            <div className='alert alert-warning d-flex gap-x-2 items-center'>
              <i className='fas fa-warning'></i>
              No Announcements existing
            </div>
          )}
          {Announcements.map((e, i) => (
            <div key={i} className='d-flex flex-col gap-y-2 bg-[#151515] rounded-3 p-1'>
              <h5 className='m-0'>{e.title}</h5>
              <p className='m-0 p-0'>{e.description}</p>
              <mark className='bg-[#101010] p-1 rounded-3 d-flex items-center justify-between'>
                <div className='hover:bg-[#303030] rounded-3 active:bg-[#151515] p-2' onClick={() => { DeleteAnnouncement(e.id) }} style={{ transition: "0.3s" }}>
                  <Trash2Icon className='text-danger cursor-grab active:cursor-grabbing ' />
                </div>
                {DateConverter(e.date)}
                {e.link && (<a href={`${e.link}`} className='d-flex items-center gap-x-2' target='_blank'>Link <SquareArrowOutUpRight /></a>)}
              </mark>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
