import React, { useEffect, useState } from "react";
import EventItem from "@/components/EventItem";
import {
  Grid,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Input,
} from "@mui/material";
import axiosInterceptor from "@/interceptors/axiosInterceptor";
import Link from "next/link";
import customToast from "@/toast/toast";
import { Event } from "@/types/Event";

type EventsComponentProps = {
  apiEndpoint: string;
  isUserEvents?: boolean;
};

const EventsComponent: React.FC<EventsComponentProps> = ({
  apiEndpoint,
  isUserEvents = false,
}) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventsToShow, setEventsToShow] = useState<Event[]>([]);

  const [fieldSort, setFieldSort] = useState<keyof Event | null>(null);
  const [order, setOrder] = useState<"ASC" | "DESC" | null>(null);

  const [fieldFilter, setFieldFilter] = useState<keyof Event | null>(null);
  const [query, setQuery] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchEvents()
      .then((events) => {
        setEvents(events.data);
        setEventsToShow(events.data);
      })
      .then(() => setIsLoading(false));
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    return await axiosInterceptor.get(apiEndpoint);
  };

  const handleFieldChange = (event: any) => {
    setFieldSort(event.target.value);
  };

  const handleOrderChange = (event: any) => {
    setOrder(event.target.value);
  };

  const handleFilterByChange = (event: any) => {
    setFieldFilter(event.target.value);
  };

  const handleQueryChange = (event: any) => {
    setQuery(event.target.value);
  };

  const handleDeleteEvent = async (id: number) => {
    const eventToDelete = events.find((el) => el.id === id);
    if (!eventToDelete) return;
    const isSure = confirm(
      `Are you sure you want to delete event ${eventToDelete.title}?`
    );
    if (!isSure) return;
    const response = await axiosInterceptor.delete(`/events/${id}`);
    if (response.status === 200) {
      customToast("success", `Event ${eventToDelete.title} was deleted.`);
    } else {
      customToast("error", "Oops, something went wrong");
    }
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id));
    setEventsToShow((prevEvents) =>
      prevEvents.filter((event) => event.id !== id)
    );
  };

  const handleClickSort = async () => {
    if (!fieldSort || !order) {
      customToast(
        "warning",
        "Please, fill all of the inputs before sorting events."
      );
      return;
    }

    const response = await axiosInterceptor.get(
      `${apiEndpoint}?field=${fieldSort}&order=${order}`
    );

    if (response.status === 200) {
      customToast("success", "Events were sorted.");
    } else {
      customToast("error", "Oops, something went wrong");
    }

    setEventsToShow(response.data);
  };

  const handleClickFilter = async () => {
    if (!fieldFilter || !query) {
      customToast(
        "warning",
        "Please, fill all of the inputs before filtering events."
      );
      return;
    }

    const response = await axiosInterceptor.get(
      `${apiEndpoint}?field=${fieldFilter}&query=${query}`
    );

    if (response.status === 200) {
      customToast("success", "Events were filtered.");
    } else {
      customToast("error", "Oops, something went wrong");
    }

    setEventsToShow(response.data);
  };

  const resetFilter = () => {
    setEventsToShow(events);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const renderMessage = () => {
    if (events.length === 0 && isUserEvents) {
      return (
        <div>Seems that you do not have events. Do you want to add some?</div>
      );
    }

    if (events.length === 0 && !isUserEvents) {
      return <div>There are no available events.</div>;
    }

    if (eventsToShow.length === 0) {
      return <div>There are no events that match your wishes.</div>;
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Grid container alignItems="center" style={{ maxWidth: "100%" }}>
        <Grid container style={{ marginBottom: 20 }} direction="row">
          <Grid container xs={12} sm={4} md={4} lg={3} alignItems="center">
            <Grid item xs={12}>
              <Button
                component={Link}
                href="/event/new"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                Add New Event
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                onClick={resetFilter}
                variant="contained"
                color="primary"
                fullWidth
                size="large"
              >
                Reset filter
              </Button>
            </Grid>
          </Grid>
          <Grid container xs={12} sm={8} md={8} lg={9}>
            <Grid
              item
              spacing={2}
              container
              justifyContent="flex-end"
              alignItems="center"
            >
              <Grid item xs={4} sm={3} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Sort By</InputLabel>
                  <Select
                    defaultValue=""
                    onChange={handleFieldChange}
                    label="Sort By"
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="category">Category</MenuItem>
                    <MenuItem value="date">Date</MenuItem>
                    <MenuItem value="description">Description</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4} sm={3} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Order</InputLabel>
                  <Select
                    defaultValue=""
                    label="Order"
                    onChange={handleOrderChange}
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="ASC">Ascending</MenuItem>
                    <MenuItem value="DESC">Descending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4} sm={3} md={3}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  size="small"
                  onClick={handleClickSort}
                >
                  Sort
                </Button>
              </Grid>
            </Grid>
            <Grid
              item
              spacing={2}
              container
              justifyContent="flex-end"
              alignItems="center"
              paddingTop={"16px"}
            >
              <Grid item xs={4} sm={3} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Filter By</InputLabel>
                  <Select
                    defaultValue=""
                    onChange={handleFilterByChange}
                    label="Filter By"
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="title">Title</MenuItem>
                    <MenuItem value="category">Category</MenuItem>
                    <MenuItem value="description">Description</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={4} sm={3} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Search Filter</InputLabel>
                  <Input onChange={handleQueryChange} />
                </FormControl>
              </Grid>
              <Grid item xs={4} sm={3} md={3}>
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  size="small"
                  onClick={handleClickFilter}
                >
                  Filter
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {renderMessage()}
        <Grid container spacing={2}>
          {eventsToShow.map((event) => (
            <Grid item key={event.id} xs={12} sm={6} md={4} lg={3} spacing={10}>
              <EventItem
                event={event}
                isOwnEvent={isUserEvents}
                handleDelete={isUserEvents ? handleDeleteEvent : null}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </div>
  );
};

export default EventsComponent;
