"use client";

import React from "react";
import EventsComponent from "@/components/EventsComponent";
import withAuth from "@/hocs/withAuth";

function Events() {
  return (
    <div>
      <EventsComponent apiEndpoint={"/events"} />
    </div>
  );
}

export default withAuth(Events);
