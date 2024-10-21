
import Add_Content from '@/components/add_content'
import React from 'react'

export default function page({ params }: { params: any }) {
    return (
        <div>
            <h2>Edit Content</h2>
            <Add_Content token={params.token} />
        </div>
    )
}
