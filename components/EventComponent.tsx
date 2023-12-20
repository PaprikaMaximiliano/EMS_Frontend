import React, { useEffect, useState } from "react";
import axiosInterceptor from "@/interceptors/axiosInterceptor";
import { Grid } from "@mui/material";
import EventItem from "@/components/EventItem";
import { Event } from "@/types/Event";

type Props = {
  id: string;
  isSingleEvent: boolean;
};

export default function EventComponent({ id, isSingleEvent = false }: Props) {
  const [event, setEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchEvent()
      .then((events) => setEvent(events.data))
      .then(() => setIsLoading(false));
  }, []);

  const fetchEvent = async () => {
    setIsLoading(true);
    return await axiosInterceptor.get(`/events/${id}`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div>Oops, this event do not exist.</div>;
  }

  return (
    <div>
      <Grid item key={event.id} xs={12} sm={6} md={4} lg={3}>
        <EventItem
          event={event}
          isOwnEvent={false}
          isSingleEvent={isSingleEvent}
        />
      </Grid>
    </div>
  );
}
