import Chatbot from "@/components/Chatbot";
import DashboardLayout from "@/components/DashboardLayout";
import React, { useEffect } from "react";

function aisection() {
  useEffect(() => {
    document.title = "Ask AI | Dashboard";
  }, []);

  return (
    <>
      <DashboardLayout>
        <Chatbot />
      </DashboardLayout>
    </>
  );
}

export default aisection;
