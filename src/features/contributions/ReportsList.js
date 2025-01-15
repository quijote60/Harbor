import { useGetContributionsQuery } from "./contributionsApiSlice"
import {Table, Button} from 'react-bootstrap';
import { useMemo, useRef, useState } from "react";
import useTitle from "../../hooks/useTitle"
import PulseLoader from 'react-spinners/PulseLoader'
import {useReactTable,getCoreRowModel, getGroupedRowModel,getExpandedRowModel,flexRender, getSortedRowModel} from '@tanstack/react-table'
import '/Users/josepadilla/Documents/HarborReactClient/harborreactclient/src/printStyles.css'; // Import the print styles
import { useReactToPrint } from "react-to-print";









const ReportsList = () => {
  const componentRef = useRef();
    useTitle('Harbor Bible: Contributions List')

    const { items,isLoading,
            isSuccess,
            isError,
            error  } = useGetContributionsQuery('contributionsList', {
            selectFromResult: ({ data }) => ({
                items: data && Object.values(data.entities),
            })
          })
          const formattedDate = items.map(item => ({
            ...item,
            date: new Date(item.date).toISOString().slice(0,10)
          }))
          console.log('theone',formattedDate)

        const date = new Date();
        const dateWithoutTime = date.toISOString().split('T')[0];

          
        console.log("this the contribution: ",items)
        let itemsFiltered = formattedDate.filter(item => item.date >= dateWithoutTime)
          console.log("filtrado",itemsFiltered)
          
    let content

    if (isLoading) content = <PulseLoader color={"#FFF"} />

    if (isError) {
        content = <p className="errmsg">{error?.data?.message}</p>
    }
    const finalData = useMemo(() => itemsFiltered, []);

    const groupBy = 'category_name';
    const dateTable = new Date().toLocaleDateString();
    

    const formatAmount = (amount) => {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      }).format(amount);
    };
    const grandTotal = finalData.reduce((sum, row) => sum + row.amount, 0);
    //console.log("total",grandTotal);

    

     const columns =  [
      {
        header: 'Category',
        accessorKey: groupBy,
        cell: ({ getValue }) => getValue(),
        aggregatedCell: ({ getValue }) => `${getValue().length} people`,
        footer: () => <strong>Grand Total</strong>,
        
      },
      {
        header: 'Last Name',
        accessorKey: 'member_last_name',
        
      },
      {
        header: 'Date',
        accessorKey: 'date',
        
      },
      {
        header: 'Amount',
        accessorKey: 'amount',
        cell: ({ getValue }) => formatAmount(getValue()),
        aggregationFn: 'sum',
        aggregatedCell: ({ getValue }) => formatAmount(getValue()),
        footer: () => <strong>{formatAmount(grandTotal)}</strong>,
      },
    ]
    const [grouping, setGrouping] = useState([groupBy]);
    const initialExpanded = useMemo(() => {
      return finalData.reduce((acc, row) => {
        acc[`category_name:${row.groupBy}`] = true;
        return acc;
      }, {});
    }, []); 
    const [expanded, setExpanded] = useState({initialExpanded});
    const tableInstance = useReactTable({
    
        data: finalData,
        columns,
        state: {
          grouping,
          expanded: true,
        },
        onExpandedChange: setExpanded,
        getExpandedRowModel: getExpandedRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        enableExpanding: true,
      });
            //const handlePrint = useReactToPrint({
              //content: () => componentRef.current,
            //});
            const handlePrint = () => {
              window.print();
            };

           
           
            
        content = (
          <div>
            <div ref={componentRef} style={{ width: '100%' }}>
            <Button 
              onClick={() => {
                if (grouping.length) {
                  setGrouping([]);
                  setExpanded({});
                } else {
                  setGrouping([groupBy]);
                  setExpanded(initialExpanded);
                }
              }}
              className="mb-3"
            >
              {grouping.length ? 'Ungroup' : 'Group by Category'}
              </Button>
              <Button onClick={handlePrint} className="mb-3">Print Table</Button>
              
              
            <Table striped bordered hover className="table-to-print">
            
            <thead>
        {tableInstance.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id} onClick={header.column.getToggleSortingHandler()}>
                {flexRender(header.column.columnDef.header, header.getContext())}
                {{
                  asc: ' 🔼',
                  desc: ' 🔽',
                }[header.column.getIsSorted()] ?? null}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
          {tableInstance.getRowModel().rows.map(row => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => {
                  return (
                    <td key={cell.id}>
                      {cell.getIsGrouped() ? (
                        <>
                          <Button
                            onClick={row.getToggleExpandedHandler()}
                            size="sm"
                            variant="light"
                          >
                            {row.getIsExpanded() ? '👇' : '👉'}{' '}
                            Age {flexRender(cell.column.columnDef.cell, cell.getContext())} ({row.subRows.length})
                          </Button>
                        </>
                      ) : cell.getIsAggregated() ? (
                        flexRender(
                          cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      ) : cell.getIsPlaceholder() ? null : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          {tableInstance.getFooterGroups().map(footerGroup => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map(header => (
                <td key={header.id}>
                  {flexRender(
                    header.column.columnDef.footer,
                    header.getContext()
                )}
                </td>
                ))}
            </tr>
          ))}
          </tfoot>
            
            </Table>
            <div ref={componentRef} style={{ width: '100%' }}>
                  <div className="table-title">
				            <div className="row">
					            <div className="col-sm-6">
						            <h2>Contribution <b>Report</b></h2>
					            </div>
					      <div className="col-sm-6">
                   <h2>{dateTable}</h2>				
					</div>
				</div>
			</div>
            </div>
            </div>
            </div>
            
        );
    
 
    return content
}
export default ReportsList