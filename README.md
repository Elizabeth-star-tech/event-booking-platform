# Tukio: Event Booking Platform

A responsive web platform for discovering and booking events in Nairobi: concerts, workshops, festivals and seminars. Users can browse and filter events, book tickets, pay, and receive a ticket.

## Features
- Home page with featured upcoming events and a countdown to the next event
- Browse events by category, with a page listing all categories and their events
- Search events by name and filter by category, free or paid, and start date
- Event details page with a link straight to booking
- Booking form with validation (name, phone, email, event, 1 to 10 tickets) and a live total
- Booking reference generated for every booking (for example TK-123456)
- Free events are confirmed immediately; paid events go to the payment page
- Payment page with Card and M-Pesa options, with card number, expiry and phone validation
- Confirmation page with a ticket showing the event, date, venue, reference and status, plus a print button
- Sign up and login page
- Admin dashboard with summary stats, an events table (bookings, tickets sold and revenue per event) and a table of all bookings with their reference, customer, status and total
- Dark mode and light mode toggle
- Mobile-friendly navigation and scroll animations

## Built with
HTML · CSS · JavaScript

## Project structure
- `index.html`: home, events, categories and booking
- `event.html`: event details
- `categories.html`: all categories and their events
- `payment.html`: payment (card or M-Pesa)
- `confirmation.html`: ticket and booking status
- `login.html`: login and sign up
- `admin.html`: admin dashboard
- `css/`: styles
- `js/`: scripts for events, filters, booking, payment, confirmation, theme and more
- `images/`: event and site images

## How to run
1. Download or clone this repository
2. Open `index.html` in your browser

## Notes
This is a front-end project. Events are stored in the code, and bookings, accounts and the theme setting are saved in the browser using localStorage, so there is no backend or database and a booking is only visible in the browser where it was made. Payment is simulated: no real payment is processed and card details are never saved. Please do not enter real card details.

## Screenshots
**Home page**
<img width="1363" height="639" alt="Homepage" src="https://github.com/user-attachments/assets/98b8a3c1-d290-4f79-9039-2137e905068d" />

**Events and filters**
<img width="1365" height="687" alt="Events and filters" src="https://github.com/user-attachments/assets/5cd41629-e421-4161-ad1f-6088726cb6a3" />

**Ticket**
<img width="1360" height="637" alt="ticket" src="https://github.com/user-attachments/assets/2dbdb563-7b56-4b02-83e2-6c763d55ec15" />

## Author
Elizabeth Nangila, built during the SQROCK Web Development Internship.
