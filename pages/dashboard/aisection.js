import Chatbot from '@/components/Chatbot'
import DashboardLayout from '@/components/DashboardLayout'
import { MonthContext } from '@/context/monthContext';
import React, { useContext, useEffect } from 'react'

function aisection() {
  const {monthNumber} = useContext(MonthContext);
  useEffect(() => {
    document.title = 'Ask AI | Dashboard'

  }, [])
  
  return (
    <>
    <DashboardLayout>
<Chatbot monthNumber={monthNumber}  />
    </DashboardLayout>
  </>
  )
}

export default aisection