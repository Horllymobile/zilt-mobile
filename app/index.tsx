import { initDB } from "@/libs/db/database";
import { Redirect } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  useEffect(() => {
    initDB();
  }, []);
  return <Redirect href="/splash" />;
}
