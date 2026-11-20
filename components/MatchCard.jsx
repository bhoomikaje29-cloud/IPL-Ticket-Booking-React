
import { useState } from 'react'

function MatchCard({ team1, team2, date, venue, price, seats, onBook }) {
  const [message, setMessage] = useState('')

  function handleClick() {
    onBook()
    setMessage('Ticket booked successfully!')
  }

  return (
    <div className="match-card">
      <h3>{team1} vs {team2}</h3>

      <p>Date: {date}</p>
      <p>Venue: {venue}</p>
      <p>Ticket Price: {price}</p>
      <p>Available Seats: {seats}</p>

      <button onClick={handleClick} disabled={seats === 0}>
        {seats === 0 ? 'Sold Out' : 'Book Now'}
      </button>

      {message && <p className="success-message">{message}</p>}
    </div>
  )
}

export default MatchCard
