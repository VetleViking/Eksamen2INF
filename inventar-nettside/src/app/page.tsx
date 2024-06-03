"use client";
import { upload_items } from "@/api/api";
import { use, useEffect, useState } from "react";

export default function Home() {
  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    if (buttonClicked) {
      upload_items();
    }
  }, [buttonClicked]);

  return (
    <div>
      <p>Hello World!</p>
      <button onClick={() => setButtonClicked(true)}>Upload</button>
    </div>
  );
}
