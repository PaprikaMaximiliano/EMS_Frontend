import { useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { TextField, Button, Grid } from "@mui/material";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Event } from "@/types/Event";

type Props = {
  handleEventAction: Function;
  actionTitle: string;
  event?: Event;
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

  useEffect(() => {
    if (event) {
      setSelectedDate(new Date(event.date));
    }
  }, [event]);

  if (event) {
  }

  const onSubmit = async (data: any) => {
    await handleEventAction(data, selectedDate);
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
          alignItems: "center",
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12}>
            <TextField
              {...register("title", { required: "Title is required" })}
              label="Title"
              error={!!errors.title}
              helperText={errors.title ? (errors.title.message as string) : ""}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            <TextField
              {...register("location", {
                required: "Location is required",
              })}
              label="Location"
              error={!!errors.location}
              helperText={
                errors.location ? (errors.location.message as string) : ""
              }
              multiline={true}
              maxRows={3}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
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
