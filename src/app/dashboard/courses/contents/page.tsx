import Link from 'next/link'
import React from 'react'

export default function contents() {
  return (
    <div>
      <h3>Listing</h3>
      <Link href="/dashboard/courses/contents/add">
        <i className="fa-solid fa-plus"></i>
        Add new content</Link>
    </div>
  )
}
