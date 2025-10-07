import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BookTicketPage = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [contact, setContact] = useState({ phone: "" });
  const [numberEntered, setNumberEntered] = useState(false);
  const [donate, setDonate] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/events/${id}`);
        setEvent(res.data.data || res.data);
      } catch (error) {
        console.error("❌ Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleContactChange = (e) => {
    const { value } = e.target;
    setContact({ phone: value });

    if (value.length < 10 || !/^[0-9]+$/.test(value)) {
      setNumberEntered(false);
    }
  };

  const handleContinue = () => {
    if (!contact.phone || contact.phone.length < 10 || !/^[0-9]+$/.test(contact.phone)) {
      alert("⚠️ Please enter a valid 10-digit mobile number.");
      setNumberEntered(false);
      return;
    }
    setNumberEntered(true);
  };

  const handleChangeNumber = () => {
    setNumberEntered(false);
  };

  const handleSupportClick = () => {
    alert("📩 Our team will check and contact you shortly regarding your payment confirmation.");
  };

  if (loading) return <div className="text-center py-10">⏳ Loading event details...</div>;
  if (!event) return <div className="text-center py-10">❌ Event not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center py-8 px-4">
      <div className="max-w-6xl w-full flex gap-6">
        {/* LEFT SIDE */}
        <div className="flex-1 space-y-4">
          {/* Contact Section */}
          <div className="bg-white rounded shadow">
            <div className="bg-red-500 text-white px-4 py-2 font-semibold">
              Share your Contact Details in order to Pay
            </div>
            <div className="p-4 flex gap-3 items-center flex-wrap">
              <input
                name="phone"
                value={contact.phone}
                onChange={handleContactChange}
                placeholder="Enter your mobile number"
                readOnly={numberEntered}
                className={`w-96 border border-gray-300 rounded px-3 py-2 focus:outline-none ${
                  numberEntered ? "bg-gray-100 cursor-not-allowed" : "focus:ring-1 focus:ring-red-400"
                }`}
              />

              {!numberEntered ? (
                <button
                  onClick={handleContinue}
                  className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 transition"
                >
                  CONTINUE
                </button>
              ) : (
                <button
                  onClick={handleChangeNumber}
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition"
                >
                  Change
                </button>
              )}

              <p className="text-sm text-gray-500 ml-2">
                Use your mobile number you provided above to complete the payment.
              </p>
            </div>
          </div>

          {/* ✅ UPI Payment Section (Visible only after valid number) */}
          {numberEntered && (
            <div className="bg-white rounded shadow p-6 text-center">
              <h3 className="font-semibold mb-4">Pay via UPI</h3>
              <img
                src={event.qrImage || "/images/dummy-qr.png"}
                alt="UPI QR"
                className="w-48 h-48 mx-auto mb-4 rounded shadow"
              />
              <p className="text-sm text-gray-500 mb-2">
                Scan this QR using any UPI app (PhonePe, GPay, Paytm, BHIM, etc.)
                linked to your mobile number that you entered.
              </p>
              <p className="text-sm text-gray-600 mt-4">
                After paying the amount, you will receive a confirmation message on your
                mobile number within <span className="font-semibold">24 hours</span>.{" "}
                <br />
                If not recieved any message,{" "}
                <button
                  onClick={handleSupportClick}
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  click here
                </button>
                .
              </p>
            </div>
          )}
        </div>

        {/* RIGHT SIDE (Order Summary) */}
        {numberEntered && (
          <div className="w-80 bg-white rounded shadow p-4">
            <h3 className="font-semibold mb-4">ORDER SUMMARY</h3>
            <div className="mb-4 text-sm">
              <p className="font-semibold">{event.title || event.name}</p>
              <p>{event.location}</p>
              <p>{event.date} — {event.time}</p>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2 text-sm">
              <span>Sub Total</span>
              <span>Rs. {event.price || 400}.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>+ Convenience fees</span>
              <span>Rs. 59.00</span>
            </div>
            <div className="flex justify-between text-sm mt-2">
              <span>Give to Underprivileged Musicians</span>
              <input
                type="checkbox"
                checked={donate}
                onChange={() => setDonate(!donate)}
              />
            </div>
            <div className="mt-4 border-t border-gray-200 pt-2 font-bold flex justify-between">
              <span>Amount Payable</span>
              <span>
                Rs. {(event.price || 400) + 59 + (donate ? 2 : 0)}.00
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookTicketPage;
