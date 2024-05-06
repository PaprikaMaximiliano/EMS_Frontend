"use client";
import CreateEventForm from "@/components/CreateEventForm";
import axiosInterceptor from "@/interceptors/axiosInterceptor";
import React, { useEffect, useState } from "react";
import customToast from "@/toast/toast";
import withAuth from "@/hocs/withAuth";
import { Event } from "@/types/Event";

type Props = {
  params: {
    id: string;
  };
};

const EditEventPage = ({ params: { id } }: Props) => {
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

  const handleEventAction = async (data: any, selectedDate: Date,  selectedLocation: any) => {
    let formattedDateToISO8601 = selectedDate.toISOString();
    axiosInterceptor.put(`/events/${id}`, {
      ...data,
      date: formattedDateToISO8601,
      lat: selectedLocation.lat(),
      lng: selectedLocation.lng()
    }).then(() => {
      customToast("success", "Event was successfully updated.");
    }).catch(() => {
      customToast("error", "Oops, something went wrong");
    })

  };

  return (
    <div style={{flex: "1 1 auto", display: "flex", flexDirection: "column"}}>
      <h1>Edit Event</h1>
      <CreateEventForm
          handleEventAction={handleEventAction}
          actionTitle="Edit"
          event={event}
      />
    </div>
  );
};

export default withAuth(EditEventPage);
