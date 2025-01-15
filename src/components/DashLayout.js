import React from 'react'
import { Outlet } from 'react-router-dom'
import DashHeader from './DashHeader'
import DashFooter from './DashFooter'

import DashHeader3 from './DashHeader3'

function DashLayout() {
  return (
    <>
            <DashHeader />
            <section className="section section-shaped section-xxl-table">
            <div className="shape shape-style-1 shape-default">
                
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                <span />
                
              </div>
            <div className="dash-container">
                <Outlet />
            </div>
            </section>
            <DashFooter/>
        </>
  )
}

export default DashLayout