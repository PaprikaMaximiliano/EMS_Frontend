import React, { useEffect, useState } from "react";
import { Event } from "@/types/Event";
import axiosInterceptor from "@/interceptors/axiosInterceptor";
import { Grid } from "@mui/material";
import EventItem from "@/components/EventItem";

type Props = {
  id: string;
};

export function RecommendedEvents({ id }: Props) {
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchRecommended()
      .then((events) => setRecommendedEvents(events.data))
      .then(() => setIsLoading(false));
  }, []);

  const fetchRecommended = async () => {
    setIsLoading(true);
    return await axiosInterceptor.get(`/events/recommended?id=${id}`);
  };

  if (isLoading) {
    return <h3>Loading...</h3>;
  }
  if (recommendedEvents.length === 0) {
    return <h3>Unfortunately, there are no recommended items.</h3>;
  }

  return (
    <>
      <h3>Recommended events:</h3>
      <Grid container spacing={2}>
        {recommendedEvents.map((event) => (
          <Grid item key={event.id} xs={12} sm={6} md={4} lg={3}>
            <EventItem event={event} isOwnEvent={false} handleDelete={null} />
          </Grid>
        ))}
      </Grid>
    </>
  );
}
