"use client";
import CreateEventForm from "@/components/CreateEventForm";
import axiosInterceptor from "@/interceptors/axiosInterceptor";
import customToast from "@/toast/toast";
import withAuth from "@/hocs/withAuth";

const CreateEventPage = () => {
  const handleEventAction = async (data: any, selectedDate: Date) => {
    let formattedDateToISO8601 = selectedDate.toISOString();

    const response = await axiosInterceptor.post("/events", {
      ...data,
      date: formattedDateToISO8601,
    });
    if (response.status === 201) {
      customToast("success", "Event was successfully created.");
    } else {
      customToast("error", "Oops, something went wrong");
    }
  };

  return (
    <div>
      <h1>Create Event</h1>
      <CreateEventForm
        handleEventAction={handleEventAction}
        actionTitle="Create"
      />
    </div>
  );
};

export default withAuth(CreateEventPage);
