
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import MatchCard from './components/MatchCard'
import { supabase } from './supabase'
import './App.css'

function App() {
  const [matches, setMatches] = useState([])
  const [bookings, setBookings] = useState([])

  // Fetch matches from Supabase
  async function fetchMatches() {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('id')

    if (error) {
      console.error('Error fetching matches:', error.message)
    } else {
      setMatches(data || [])
    }
  }

  // Fetch bookings from Supabase
  async function fetchBookings() {
    const { data, error } = await supabase
      .from('bookings')
      .select('*, matches(*)')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching bookings:', error.message)
    } else {
      setBookings(data || [])
    }
  }

  // Fetch data and subscribe to Realtime changes
  useEffect(() => {
    fetchMatches()
    fetchBookings()

    const channel = supabase
      .channel('matches-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'matches'
        },
        (payload) => {
          console.log('Realtime update received:', payload)
          fetchMatches()
        }
      )
      .subscribe((status) => {
        console.log('Realtime status:', status)
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  // Book one ticket
  async function handleBooking(match) {
    if (match.available_seats <= 0) {
      alert('Sorry! No seats available.')
      return
    }

    // Save booking in Supabase
    const { error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          match_id: match.id,
          customer_name: 'Guest',
          tickets: 1
        }
      ])

    if (bookingError) {
      console.error('Booking error:', bookingError.message)
      alert('Booking failed. Please try again.')
      return
    }

    // Update available seats
    const { error: updateError } = await supabase
      .from('matches')
      .update({
        available_seats: match.available_seats - 1
      })
      .eq('id', match.id)

    if (updateError) {
      console.error('Seat update error:', updateError.message)
      alert('Booking saved, but seat update failed.')
      await fetchBookings()
      return
    }

    await fetchMatches()
    await fetchBookings()

    alert('Ticket booked successfully!')
  }

  return (
    <>
      <Navbar />
      <Hero />

      {/* Upcoming Matches */}
      <section id="matches">
        <h2>Upcoming Matches</h2>

        <div className="match-grid">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              team1={match.team1}
              team2={match.team2}
              date={match.match_date}
              venue={match.venue}
              price={match.price}
              seats={match.available_seats}
              onBook={() => handleBooking(match)}
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
            {bookings.map((booking) => (
              <div className="match-card" key={booking.id}>
                <h3>
                  {booking.matches?.team1} vs {booking.matches?.team2}
                </h3>
                <p>Date: {booking.matches?.match_date}</p>
                <p>Venue: {booking.matches?.venue}</p>
                <p>Ticket Price: {booking.matches?.price}</p>
                <p>Tickets: {booking.tickets}</p>
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
