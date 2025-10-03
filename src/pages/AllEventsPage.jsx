// src/pages/AllEventsPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEventStore } from "../store/events";
import { API_BASE_URL } from "../config";

const AllEventsPage = () => {
  const { events, setEvents } = useEventStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        console.log("Fetching events from:", `${API_BASE_URL}/api/events`);
        const res = await fetch(`${API_BASE_URL}/api/events`);
        if (!res.ok) {
          throw new Error(`Failed to fetch events: ${res.status}`);
        }
        const data = await res.json();
        const eventList = Array.isArray(data) ? data : data.data || [];
        setEvents(eventList);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [setEvents]);

  // ✅ Function to check login before navigating
  const handleViewDetails = (eventId) => {
    const studentName = localStorage.getItem("studentName");
    if (!studentName) {
      // ✅ Show alert first
      alert("Please log in to view event details.");

      // ✅ Scroll to top AFTER user clicks OK
      window.scrollTo({ top: 0, behavior: "smooth" });

      return;
    }
    navigate(`/Individual/${eventId}`);
  };

  return (
    <div className="min-h-screen py-12 px-6 bg-white">
      <h1
        className="text-4xl font-bold text-gray-900 text-center mb-10"
        style={{ fontFamily: "'Poppins', sans-serif" }}
      >
        All Upcoming Events and Clubs
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {events.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">
            No events yet. Be the first to post one!
          </p>
        ) : (
          events.map((event) => (
            <div
              key={event._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition duration-300 flex flex-col"
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-80 object-cover"
                />
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold text-gray-800 mb-2">
                  {event.title}
                </h2>

                <p className="text-sm text-gray-500 mb-4">
                  📅{" "}
                  {event.date
                    ? new Date(event.date).toLocaleDateString()
                    : "No date"}{" "}
                  <br />
                  📍 {event.location || "No location"}
                </p>

                <button
                  onClick={() => handleViewDetails(event._id)}
                  className="mt-auto bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllEventsPage;
