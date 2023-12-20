"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import Header from "@/components/Header";

function Home() {
  useEffect(() => {
    redirect("/login");
  }, []);

  return (
    <div>
      <h1>Redirecting to Login...</h1>
    </div>
  );
}

export default Home;
