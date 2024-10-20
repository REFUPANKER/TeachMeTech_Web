
import Add_Course from '@/components/add_course'
import React from 'react'

export default function page({ params }: { params: any }) {
    return (
        <div>
            <h2>Edit Course</h2>
            <Add_Course token={params.token} />
        </div>
    )
}
