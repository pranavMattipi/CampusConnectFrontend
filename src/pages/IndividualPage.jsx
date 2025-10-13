import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const IndividualPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        console.log("Fetching event from:", `${API_BASE_URL}/api/events/${id}`);
        const res = await axios.get(`${API_BASE_URL}/api/events/${id}`);
        console.log("✅ Event fetched:", res.data);

        setEvent(res.data.data || res.data || null);
      } catch (error) {
        console.error("❌ Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  if (loading)
    return <div className="text-center py-10">Loading event...</div>;
  if (!event)
    return <div className="text-center py-10">Event not found</div>;

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      {/* Event Banner */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden mb-12">
        {event.image && (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-96 object-cover"
          />
        )}
        <div className="p-6">
          <h1 className="text-4xl font-bold mb-4">{event.title}</h1>

          {/* Highlights */}
          {event.highlights?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {event.highlights.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Date, Time, Location */}
          <div className="text-gray-700 mb-6 space-y-1">
            {event.date && (
              <p>
                <strong>Date:</strong>{" "}
                {new Date(event.date).toLocaleDateString()}
              </p>
            )}
            {event.time && (
              <p>
                <strong>Time:</strong> {event.time}
              </p>
            )}
            {event.location && (
              <p>
                <strong>Location:</strong> {event.location}
              </p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Link
              to={`/BookTicket/${event._id}`}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition"
            >
              🎟 Book Tickets
            </Link>
          </div>
        </div>
      </div>

      {/* About Section */}
      {event.description && (
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6 mb-12">
          <h2 className="text-2xl font-semibold mb-4">About the Event</h2>
          <p className="text-gray-600 leading-relaxed">{event.description}</p>
        </div>
      )}

      {/* Organizer Info */}
      {(event.organizerName || event.organizerLogo) && (
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6 flex items-center gap-4 mb-12">
          {event.organizerLogo && (
            <img
              src={event.organizerLogo}
              alt="Organizer"
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            <h3 className="font-bold text-lg">{event.organizerName || "Organizer"}</h3>
            <p className="text-gray-600">Leading event organizer</p>
          </div>
        </div>
      )}

      {/* Cast Members */}
      {event.castMembers?.length > 0 && (
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6 mb-12">
          <h2 className="text-2xl font-semibold mb-6">Cast</h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {event.castMembers.map((cast, index) => (
              <div key={index} className="flex-shrink-0 w-28">
                <img
                  src={cast.img}
                  alt={cast.name}
                  className="w-28 h-28 object-cover rounded-full border-2 border-gray-300"
                />
                <p className="mt-2 text-center text-sm">{cast.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default IndividualPage;
