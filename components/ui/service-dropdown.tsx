"use client";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";

interface ServiceDropdownProps {
  selectedService?: string;
  onSelect: (serviceId: string) => void;
  services: any[];
}

export function ServiceDropdown({ selectedService, onSelect, services }: ServiceDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className="relative flex h-10 w-full items-center rounded-md border border-input bg-background px-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-accent/10 transition-colors"
          aria-label="Select service"
          onClick={(e) => {
            e.stopPropagation();
            setOpen(!open);
          }}
        >
          <span>{selectedService ? getServiceName(selectedService) : "Select Service"}</span>
          <svg
            className="absolute right-2.5 bottom-1/2 -translate-y-1/2 w-4 h-4 stroke-current"
            viewBox="0 0 12 8"
            aria-hidden="true"
            fill="currentColor"
          >
            <path d="M3 4l3 3 3-3"/>
          </svg>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={4}
        className="w-56 rounded-lg border border-popover bg-popover p-2 shadow-lg z-50"
      >
        {services.map((service) => (
          <DropdownMenuItem
            key={service.id}
            onSelect={() => {
              onSelect(service.id);
              setOpen(false);
            }}
          >
            <div className="flex cursor-default select-none py-2.5 px-3 text-sm rounded-md focus:outline-none focus:bg-accent/5 focus:text-accent-data">
              <span className="line-clamp-1">{service.name}</span>
              {selectedService === service.id && (
                <span className="ml-auto text-xs font-medium text-accent-data">Selected</span>
              )}
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function getServiceName(serviceId: string): string {
  const serviceMap: any = {
    thumbnail: "Thumbnail Creation",
    video_basic: "Video Editing (Basic)",
    video_pro: "Video Editing (Pro)",
    video_premium: "Video Editing (Premium)",
    color_grading: "Color Grading",
    motion_graphics: "Motion Graphics",
  };
  return serviceMap[serviceId] || "Unknown Service";
}