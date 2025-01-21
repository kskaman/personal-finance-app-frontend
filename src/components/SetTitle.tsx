import { useEffect } from "react";

const SetTitle = ({ title }: { title: string }) => {
  useEffect(() => {
    document.title = title + " | Personal Finance App";
  }, [title]);

  return null;
};

export default SetTitle;
