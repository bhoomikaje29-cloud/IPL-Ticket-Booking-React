function Hero() {
  return (
    <section className="hero">
      <h1>Experience The Stadium Energy Live!</h1>

      <p>
        Book your IPL 2026 tickets and support your favourite team.
      </p>

      <button onClick={() => {
        document.getElementById('matches').scrollIntoView({
          behavior: 'smooth'
        })
      }}>
        Book Tickets
      </button>
    </section>
  )
}

export default Hero