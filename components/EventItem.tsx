"use client";

import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Link from "next/link";

import { Event } from "@/types/Event";

type Props = {
  event: Event;
  isOwnEvent: boolean;
  isSingleEvent?: boolean;
  handleDelete?: any;
};

const EventItem = ({
  event,
  isOwnEvent,
  isSingleEvent,
  handleDelete,
}: Props) => {
  const { id, title, description, category, date, location } = event;

  let formattedDate = new Date(date).toUTCString();

  return (
    <Card
      style={{
        position: "relative",
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent
        style={{ flex: "1 1 auto", display: "flex", flexDirection: "column" }}
      >
        {isOwnEvent && (
          <IconButton
            aria-label="delete"
            onClick={() => handleDelete(id)}
            style={{ position: "absolute", top: 0, right: 0, color: "red" }}
          >
            <DeleteIcon />
          </IconButton>
        )}
        <Typography variant="h5" component="h2">
          {title}
        </Typography>
        <Typography color="textSecondary">
          Date: <span style={{ color: "black" }}>{`${formattedDate}`}</span>
        </Typography>
        <Typography color="textSecondary">
          Location: <span style={{ color: "black" }}>{location}</span>
        </Typography>
        <Typography color="textSecondary" variant="body2" component="p">
          Description:
          <span style={{ color: "black" }}>{description}</span>
        </Typography>
        <Typography color="textSecondary">
          Category:
          <span style={{ color: "black" }}>{category}</span>
        </Typography>
        <div style={{ marginTop: "auto" }}>
          {!isSingleEvent && (
            <Button
              component={Link}
              href={isOwnEvent ? `/event/my/${id}` : `/event/${id}`}
              variant="contained"
              color="primary"
              style={{ marginRight: 20 }}
            >
              Details
            </Button>
          )}
          {isOwnEvent && (
            <Button
              component={Link}
              href={isOwnEvent ? `/event/my/${id}/edit` : `/event/${id}/edit`}
              variant="contained"
              color="primary"
            >
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventItem;
