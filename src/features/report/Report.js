import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons"
import { useNavigate } from 'react-router-dom'
import { useGetContributionsQuery } from '../contributions/contributionsApiSlice'
import {flexRender, useReactTable, getCoreRowModel} from '@tanstack/react-table'
//import {columnDef} from  './ReportList'
//import ReportList from './ReportList'
import { memo } from 'react'

import React from 'react'

const Report = (contributionId) => {

    const {contribution} = useGetContributionsQuery('contributionsList',{
        selectFromResult: ({data}) => ({
            contribution: data?.entities[contributionId]
        }),
    })
    console.log(contribution)
       // const finalData = React.useMemo(() => contribution, []);
       // const finalColumnDef = React.useMemo(() => columnDef, []);

        const tableInstance = useReactTable({
           // columns: finalColumnDef,
            data: contribution,
            getCoreRowModel: getCoreRowModel(),
          });

  return (
    <>
    {tableInstance.getRowModel().rows.map((rowEl) => {
        return (
          <tr key={rowEl.id}>
            {rowEl.getVisibleCells().map((cellEl) => {
              return (
                <td key={cellEl.id}>
                  {flexRender(
                    cellEl.column.columnDef.cell,
                    cellEl.getContext()
                  )}
                </td>
              );
            })}
          </tr>
        );
      })}
      </>
  )
}

export default Report
