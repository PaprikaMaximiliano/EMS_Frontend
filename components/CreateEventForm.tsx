import { useForm } from "react-hook-form";
import React, {useEffect, useMemo, useState} from "react";
import { TextField, Button, Grid } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Event } from "@/types/Event";
import customToast from "@/toast/toast";
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import Map, {Marker} from "@/components/Map";

type Props = {
  handleEventAction: Function;
  actionTitle: string;
  event?: Event;
};

const render = (status: Status) => {
    return <h1>{status}</h1>;
};

const CreateEventForm = ({ handleEventAction, actionTitle, event }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: useMemo(() => {
      if (!event) return;
      const { date, ...data } = event;
      return data;
    }, [event]),
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const [eventLocation, setEventLocation] = React.useState<google.maps.LatLng | any>();
  const [zoom, setZoom] = React.useState(6); // initial zoom
  const [center, setCenter] = React.useState<google.maps.LatLngLiteral>({
    lat: 49.3794,
    lng: 31.1656,
  });

  const onClick = (e: google.maps.MapMouseEvent) => {
    // avoid directly mutating state
    console.log("e.latLng", e.latLng)
    setEventLocation(e.latLng!);
  };


  const onIdle = (m: google.maps.Map) => {
    setZoom(m.getZoom()!);
    setCenter(m.getCenter()!.toJSON());
  };

  useEffect(() => {
    if (event) {
      setSelectedDate(new Date(event.date));
      setEventLocation({lat: event.lat, lng: event.lng});

    }
  }, [event]);


  const onSubmit = async (data: any) => {
    if(eventLocation === undefined){
      customToast("warning","Location of event is required. Click on map to set location!")
      return;
    }
    await handleEventAction(data, selectedDate, eventLocation);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "0 20px",
        flex: "1 1 auto",
      }}
    >
      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item lg={3  } xs={12}>
            <TextField
              {...register("title", { required: "Title is required" })}
              label="Title"
              error={!!errors.title}
              helperText={errors.title ? (errors.title.message as string) : ""}
              fullWidth
            />
          </Grid>
          <Grid item lg={3  } xs={12}>
            <TextField
              {...register("category", { required: "Category is required" })}
              label="Category"
              error={!!errors.category}
              helperText={
                errors.category ? (errors.category.message as string) : ""
              }
              fullWidth
            />
          </Grid>
          <Grid item lg={3  } xs={12}>
            <TextField
              {...register("description", {
                required: "Description is required",
              })}
              label="Description"
              error={!!errors.description}
              helperText={
                errors.description ? (errors.description.message as string) : ""
              }
              multiline={true}
              maxRows={3}
              fullWidth
            />
          </Grid>
          <Grid item lg={3} xs={12}>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date as Date)}
              showTimeSelect
              dateFormat="yyyy/MM/dd HH:mm"
              placeholderText="Select date and time"
              required={true}
            />
          </Grid>
        </Grid>
        <div style={{marginTop: 20, flex: "1 1 auto", display: "flex", flexDirection: "column"}}>
            <Wrapper
                apiKey={'AIzaSyD8VhzS53KMGa_aZkfuqX2k7dVZstiIBAA'}
                render={render}
            >
              <Map
                  center={center}
                  onClick={event ? () => {} : onClick}
                  onIdle={onIdle}
                  zoom={zoom}
                  style={{flexGrow: '1', height: '100%'}}
              >
                  <Marker position={eventLocation} draggable={!!event} onDragEnd={onClick}/>
              </Map>
            </Wrapper>
        </div>
        <Grid item xs={12}>
          <Button type="submit" variant="contained" color="primary">
            {actionTitle} Event
          </Button>
        </Grid>
      </div>
    </form>
  );
};

export default CreateEventForm;
