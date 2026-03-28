import React, { useEffect, useState } from "react";
import { Event } from "@/types/Event";
import axiosInterceptor from "@/interceptors/axiosInterceptor";
import { Button, Grid } from "@mui/material";
import EventItem from "@/components/EventItem";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import getCurrentLocation, {
  CurrentLocation,
  FALLBACK_LOCATION,
} from "@/utils/getCurrentLocation";
import { setCurrentLocation } from "@/lib/features/auth-slice";
import customToast from "@/toast/toast";

type Props = {
  id: string;
};

export function RecommendedEvents({ id }: Props) {
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshingLocation, setIsRefreshingLocation] =
    useState<boolean>(false);
  const dispatch = useAppDispatch();
  const currentLocation = useAppSelector(
    (state) => state.authReducer.currentLocation,
  );

  useEffect(() => {
    loadRecommended();
  }, [id]);

  const fetchRecommended = async (location?: CurrentLocation) => {
    setIsLoading(true);
    const lat = location?.lat ?? currentLocation?.lat ?? FALLBACK_LOCATION.lat;
    const lng = location?.lng ?? currentLocation?.lng ?? FALLBACK_LOCATION.lng;
    return await axiosInterceptor.get(
      `/events/recommended?id=${id}&lat=${lat}&lng=${lng}`,
    );
  };

  const loadRecommended = async (location?: CurrentLocation) => {
    try {
      const events = await fetchRecommended(location);
      setRecommendedEvents(events.data);
    } catch {
      customToast("error", "Could not load recommended events.");
      setRecommendedEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUserLocation = async () => {
    setIsRefreshingLocation(true);
    const locationResult = await getCurrentLocation();

    if (locationResult.ok) {
      dispatch(setCurrentLocation(locationResult.position));
      await loadRecommended(locationResult.position);
      customToast("success", "Location updated.");
    } else {
      customToast("warning", locationResult.reason);
      await loadRecommended();
    }

    setIsRefreshingLocation(false);
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
      <Button
        variant="outlined"
        size="small"
        onClick={refreshUserLocation}
        disabled={isRefreshingLocation}
        sx={{ mb: 2 }}
      >
        {isRefreshingLocation ? "Updating location..." : "Use my location"}
      </Button>
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
