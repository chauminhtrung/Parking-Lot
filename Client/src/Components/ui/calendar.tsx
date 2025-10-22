"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "./utils";
import { buttonVariants } from "./button";

const Calendar: React.FC<React.ComponentProps<typeof DayPicker>> = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) => {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "p-4 bg-white rounded-xl shadow-lg border border-gray-200",
        className
      )}
      classNames={{
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-4 bg-white",
        caption:
          "flex justify-between items-center py-2 px-2 border-b border-gray-200",
        caption_label: "text-lg font-semibold text-gray-800",
        nav: "flex items-center gap-2",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "p-2 bg-gray-100 hover:bg-gray-200 rounded-md"
        ),
        nav_button_previous: "",
        nav_button_next: "",
        table: "w-full border-collapse mt-2",
        head_row: "flex",
        head_cell: "w-10 text-center text-sm font-medium text-gray-500",
        row: "flex w-full mt-1",
        cell: "w-10 h-10 flex items-center justify-center m-0",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "w-10 h-10 p-0 text-sm rounded-md hover:bg-gray-100 focus:bg-gray-200"
        ),
        day_selected:
          "bg-blue-600 text-white hover:bg-blue-700 focus:bg-blue-700",
        day_today: "bg-blue-100 text-blue-700",
        day_outside: "text-gray-300",
        day_disabled: "text-gray-300 opacity-50",
        day_range_start: "bg-blue-500 text-white rounded-l-full",
        day_range_end: "bg-blue-500 text-white rounded-r-full",
        day_range_middle: "bg-blue-200 text-blue-800",
        ...classNames,
      }}
      components={
        {
          IconLeft: ({
            className,
            ...props
          }: {
            className?: string;
            [key: string]: unknown;
          }) => <ChevronLeft className={cn("w-5 h-5", className)} {...props} />,
          IconRight: ({
            className,
            ...props
          }: {
            className?: string;
            [key: string]: unknown;
          }) => (
            <ChevronRight className={cn("w-5 h-5", className)} {...props} />
          ),
        } as React.ComponentProps<typeof DayPicker>["components"]
      }
      {...props}
    />
  );
};

export { Calendar };
