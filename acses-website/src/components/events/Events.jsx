import { useState, useEffect } from "react";
import Calendar from "./Calendar";
import { format, parseISO, isFuture, isValid } from "date-fns";
import { motion } from "framer-motion";
import { CalendarIcon, Clock, MapPin, ArrowRight, Users } from "lucide-react";
import { events } from "../../data/events";
import EventCard from "./EventCard"; // Import the EventCard component

const Events = () => {
  const [selectedDateEvents, setSelectedDateEvents] = useState([]);
  const [nextEvent, setNextEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null); // State to hold the selected event

  useEffect(() => {
    const formatDateToISO = (date) => {
      const [day, month, year] = date.split("-");
      return `${year}-${month}-${day}`;
    };

    const futureEvents = events
      .flatMap((day) =>
        day.events.map((event) => ({
          ...event,
          date: formatDateToISO(day.date),
        }))
      )
      .filter((event) => isFuture(parseISO(event.date)))
      .sort((a, b) => parseISO(a.date) - parseISO(b.date));

    if (futureEvents.length > 0) {
      setNextEvent(futureEvents[0]);
    }
  }, []);

  const handleDateSelect = (date) => {
    if (isValid(date)) {
      const formattedDate = format(date, "dd-MM-yyyy");
      const dayEvents = events.find((event) => event.date === formattedDate);
      setSelectedDateEvents(dayEvents ? dayEvents.events : []);
    } else {
      setSelectedDateEvents([]);
    }
  };

  const handleViewDetails = (event) => {
    setSelectedEvent(event); // Set the selected event when "View Details" is clicked
  };

  return (
    <section id="events" className="w-full py-16 md:py-24 bg-grey-100">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Upcoming Events
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join us for exciting events and activities. Stay connected with our
            community.
          </p>
        </motion.div>

        {nextEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="bg-acses-green-500 rounded-2xl shadow-xl overflow-hidden">
              <div className="p-8 md:p-12">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="space-y-4">
                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 text-white backdrop-blur-sm">
                      <CalendarIcon className="w-5 h-5 mr-2" />
                      <span>Upcoming Event</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      {nextEvent.title}
                    </h3>
                    <div className="flex flex-wrap gap-4 text-white/90">
                      <span className="flex items-center gap-2">
                        <CalendarIcon className="w-5 h-5" />
                        {nextEvent.date}
                      </span>
                      <span className="flex items-center gap-2">
                        <Clock className="w-5 h-5" />
                        {nextEvent.time}
                      </span>
                      <span className="flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        {nextEvent.location}
                      </span>
                      <span className="flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Limited Spots
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      className="bg-white text-acses-green-500 px-6 py-2 rounded-md font-semibold hover:bg-gray-100 transition-colors"
                      onClick={() => window.open(nextEvent.link, "_blank")}
                    >
                      Add to Calendar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-[1fr_350px] gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {selectedDateEvents.length > 0 ? (
              selectedDateEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-gray-900">
                        {event.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-gray-600">
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </span>
                      </div>
                      <p className="text-gray-600 line-clamp-2">
                        {event.description.slice(0, 85)}{event.description.length > 85 ? "..." : ""}
                      </p>
                    </div>
                    <button
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-acses-green-500 text-white rounded-lg font-semibold hover:bg-acses-green-600  transition-colors group"
                      onClick={() => handleViewDetails(event)} // Trigger the modal
                    >
                      View Details
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl shadow-md p-12 text-center"
              >
                <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-acses-green-500" />
                <h3 className="text-2xl font-bold mb-4 text-gray-900">
                  No Events Scheduled
                </h3>
                <p className="text-gray-600 text-lg mb-8">
                  There are no events scheduled for this date. You can check other dates.
                </p>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Calendar onDateSelect={handleDateSelect} />
          </motion.div>
        </div>
      </div>

      {/* Render the EventCard modal if an event is selected */}
      {selectedEvent && (
        <EventCard
          eventDetails={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </section>
  );
};

export default Events;