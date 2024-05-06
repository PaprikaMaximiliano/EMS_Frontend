"use client";
import CreateEventForm from "@/components/CreateEventForm";
import axiosInterceptor from "@/interceptors/axiosInterceptor";
import customToast from "@/toast/toast";
import withAuth from "@/hocs/withAuth";

const CreateEventPage = () => {
  const handleEventAction = async (data: any, selectedDate: Date, selectedLocation: any) => {
    let formattedDateToISO8601 = selectedDate.toISOString();

    axiosInterceptor.post("/events", {
      ...data,
      date: formattedDateToISO8601,
      lat: selectedLocation.lat(),
      lng: selectedLocation.lng()
    }).then(() => {
        customToast("success", "Event was successfully created.");
    }).catch((_e) => {
      customToast("error", "Oops, something went wrong");

    })

  };

  return (
    <div style={{flex: "1 1 auto", display: "flex", flexDirection: "column"}}>
      <h1>Create Event</h1>
      <CreateEventForm
        handleEventAction={handleEventAction}
        actionTitle="Create"
      />

    </div>
  );
};

export default withAuth(CreateEventPage);
