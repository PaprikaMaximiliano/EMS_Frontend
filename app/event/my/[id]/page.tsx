"use client";

"use client";

import React, { useEffect, useState } from "react";
import EventItem from "@/components/EventItem";
import {
  Grid,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import axiosInterceptor from "@/interceptors/axiosInterceptor";
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
