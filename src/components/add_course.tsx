"use client"
import React, { useEffect } from 'react'
import { Button } from './ui/button'

export default function Add_Course({ token = "" }) {
    useEffect(() => {
        return () => {
            if (token != "") {
                console.log("Editing the course");
            }
        }
    }, [])

    return (
        <div className='d-flex flex-col md:flex-row gap-4'>
            <div className='d-flex flex-col w-full'>
                <h4>Course Properties</h4>
                <h6>Title</h6>
                <input placeholder='Type Title' className='mb-3 p-2 rounded-3 border-2 border-solid border-[#505050]' maxLength={64} />
                <h6>Description</h6>
                <textarea placeholder='Type Description' className='max-h-[15vh] mb-3 p-2 rounded-3 border-2 border-solid border-[#505050]' maxLength={128} />
                <h6>Category</h6>
                <input placeholder='Type Category' className='mb-3 p-2 rounded-3 border-2 border-solid border-[#505050]' maxLength={32} />
            </div>
            <div className='w-full d-flex flex-col'>
                <h4>Steps</h4>
                <h6>Type content token to import</h6>
                <div className='d-flex items-center gap-x-2'>
                    <input required placeholder='Type Content Token' className='w-100 p-2 rounded-3 border-2 border-solid border-[#505050]' maxLength={32} />
                    <Button variant={"ghost"} className='border-2 border-solid border-[#505050]'>Import</Button>
                </div>
            </div>
        </div>
    )
}
