"use client";

import React from "react";
import EventsComponent from "@/components/EventsComponent";
import withAuth from "@/hocs/withAuth";

function MyEvents() {
  return <EventsComponent apiEndpoint={"/events/my"} isUserEvents={true} />;
}

export default withAuth(MyEvents);
