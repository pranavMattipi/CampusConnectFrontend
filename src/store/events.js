import { create } from "zustand";
import { API_BASE_URL } from "../config";

export const useEventStore = create((set) => ({
  events: [],
  setEvents: (events) => set({ events }),

  createEvent: async (newEvent) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/events`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEvent),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, message: data.message || "Failed to create event" };
      }

      set((state) => ({ events: [...state.events, data.data] }));

      return { success: true, message: "Event created successfully" };
    } catch (error) {
      console.error("Error creating event:", error);
      return { success: false, message: "Server error. Please try again later." };
    }
  },
}));
