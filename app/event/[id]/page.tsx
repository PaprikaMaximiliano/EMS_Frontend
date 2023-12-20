"use client";

import React, { useEffect, useState } from "react";
import withAuth from "@/hocs/withAuth";
import EventComponent from "@/components/EventComponent";
import { RecommendedEvents } from "@/components/RecommendedEvents";

type Props = {
  params: {
    id: string;
  };
};

function Event({ params: { id } }: Props) {
  return (
    <div style={{ margin: 50 }}>
      <EventComponent id={id} isSingleEvent={true} />
      <RecommendedEvents id={id} />
    </div>
  );
}

export default withAuth(Event);
