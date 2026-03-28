import React, { useEffect, useState } from "react";
import { Event } from "@/types/Event";
import axiosInterceptor from "@/interceptors/axiosInterceptor";
import { Grid } from "@mui/material";
import EventItem from "@/components/EventItem";
import { useAppSelector } from "@/lib/hooks";
import { FALLBACK_LOCATION } from "@/utils/getCurrentLocation";

type Props = {
  id: string;
};

export function RecommendedEvents({ id }: Props) {
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const currentLocation = useAppSelector(
    (state) => state.authReducer.currentLocation,
  );

  useEffect(() => {
    fetchRecommended()
      .then((events) => setRecommendedEvents(events.data))
      .then(() => setIsLoading(false));
  }, []);

  const fetchRecommended = async () => {
    setIsLoading(true);
    const lat = currentLocation?.lat ?? FALLBACK_LOCATION.lat;
    const lng = currentLocation?.lng ?? FALLBACK_LOCATION.lng;
    return await axiosInterceptor.get(
      `/events/recommended?id=${id}&lat=${lat}&lng=${lng}`,
    );
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
