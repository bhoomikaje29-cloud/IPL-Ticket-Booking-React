
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MatchCard from './components/MatchCard'
import './App.css'

const initialMatches = [
  {
    team1: "RCB",
    team2: "CSK",
    date: "25 March 2026",
    venue: "Bengaluru",
    price: "₹1500",
    seats: 120
  },
  {
    team1: "MI",
    team2: "KKR",
    date: "26 March 2026",
    venue: "Mumbai",
    price: "₹2000",
    seats: 85
  },
  {
    team1: "CSK",
    team2: "SRH",
    date: "27 March 2026",
    venue: "Chennai",
    price: "₹1800",
    seats: 60
  }
]

function App() {

  const [matches, setMatches] = useState(() => {
    const savedMatches = localStorage.getItem('matches')
    return savedMatches ? JSON.parse(savedMatches) : initialMatches
  })

  const [bookings, setBookings] = useState(() => {
    const savedBookings = localStorage.getItem('bookings')
    return savedBookings ? JSON.parse(savedBookings) : []
  })

  // Save matches whenever available seats change
  useEffect(() => {
    localStorage.setItem('matches', JSON.stringify(matches))
  }, [matches])

  // Save bookings whenever a new booking is added
  useEffect(() => {
    localStorage.setItem('bookings', JSON.stringify(bookings))
  }, [bookings])

  function handleBooking(matchIndex) {
    const selectedMatch = matches[matchIndex]

    if (selectedMatch.seats > 0) {
      setMatches(currentMatches =>
        currentMatches.map((match, index) =>
          index === matchIndex
            ? { ...match, seats: match.seats - 1 }
            : match
        )
      )

      setBookings(currentBookings => [
        ...currentBookings,
        selectedMatch
      ])
    }
  }

  return (
    <>
      <Navbar />
      <Hero />

      {/* Upcoming Matches */}
      <section id="matches">
        <h2>Upcoming Matches</h2>

        <div className="match-grid">
          {matches.map((match, index) => (
            <MatchCard
              key={index}
              team1={match.team1}
              team2={match.team2}
              date={match.date}
              venue={match.venue}
              price={match.price}
              seats={match.seats}
              onBook={() => handleBooking(index)}
            />
          ))}
        </div>
      </section>

      {/* My Bookings */}
      <section id="bookings">
        <h2>My Bookings</h2>

        {bookings.length === 0 ? (
          <p>No bookings yet. Book your favourite match!</p>
        ) : (
          <div className="match-grid">
            {bookings.map((booking, index) => (
              <div className="match-card" key={index}>
                <h3>{booking.team1} vs {booking.team2}</h3>
                <p>Date: {booking.date}</p>
                <p>Venue: {booking.venue}</p>
                <p>Ticket Price: {booking.price}</p>
                <p>Status: Booking Confirmed</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Guidelines */}
      <section id="guidelines">
        <h2>Ticket Booking Guidelines</h2>

        <ul>
          <li>Book your tickets before the match date.</li>
          <li>Check the match date and venue before booking.</li>
          <li>Each booking confirms one ticket.</li>
          <li>Tickets are subject to availability.</li>
          <li>Please arrive at the stadium early.</li>
        </ul>
      </section>
    </>
  )
}

export default App
