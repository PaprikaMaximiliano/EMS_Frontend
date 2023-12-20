"use client";
import React from "react";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Button } from "@mui/material";
import { logOut } from "@/lib/features/auth-slice";
import { useAppDispatch } from "@/lib/hooks";
import { redirect } from "next/navigation";

const navItems = [
  { label: "Events", href: "/event" },
  { label: "My Events", href: "/event/my" },
];

const TheHeader = () => {
  const dispatch = useAppDispatch();

  const handleClickLogOut = () => {
    dispatch(logOut());
  };
  return (
    <header>
      <div></div>
      <Navigation navLinks={navItems} />
      <div style={{ display: "flex", justifySelf: "flex-end" }}>
        <Button variant="contained" onClick={() => handleClickLogOut()}>
          Log out
        </Button>
      </div>
    </header>
  );
};

export default TheHeader;
