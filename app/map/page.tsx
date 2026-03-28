"use client";
import withAuth from "@/hocs/withAuth";
import React, { useEffect, useState } from "react";
import { Event } from "@/types/Event";
import axiosInterceptor from "@/interceptors/axiosInterceptor";
import Map, { Marker } from "@/components/Map";
import { Status, Wrapper } from "@googlemaps/react-wrapper";

const render = (status: Status) => {
  return <h1>{status}</h1>;
};

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

const Page = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [zoom, setZoom] = React.useState(6); // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: 49.3794,
    lng: 31.1656,
  });
  const onIdle = (m: google.maps.Map) => {
    setZoom(m.getZoom()!);
    setCenter(m.getCenter()!.toJSON());
  };

  useEffect(() => {
    fetchEvents()
      .then((events) => {
        setEvents(events.data);
      })
      .then(() => setIsLoading(false));
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);

    return await axiosInterceptor.get("/events");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ flex: "1 1 auto", display: "flex", flexDirection: "column" }}>
      {/*<Grid container style={{ minWidth: "100%", minHeight: "100%" }}>*/}
      {!GOOGLE_MAPS_API_KEY ? (
        <div>
          Google Maps key is not configured. Set
          NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.
        </div>
      ) : (
        <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={render}>
          <Map
            center={center}
            onIdle={onIdle}
            zoom={zoom}
            style={{ flexGrow: "1", height: "100%" }}
          >
            {events.map((event) => {
              return (
                <Marker
                  key={event.id}
                  position={{ lat: event.lat, lng: event.lng }}
                  event={event}
                />
              );
            })}
          </Map>
        </Wrapper>
      )}
      {/*</Grid>*/}
    </div>
  );
};

export default withAuth(Page);
