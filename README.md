# TaskMate: Online Service Booking Application

## Overview

TaskMate is an online service booking application that allows users to book services like plumbing, electrician, carpentry, etc., conveniently through a web interface. The application consists of a Flask backend for handling business logic, a MySQL database for data storage, and a React frontend for user interaction.

## Application Flow

### 1. User Registration and Login

- **Registration:**
  - Users can register by providing their email, password, and other necessary details.
  - Validation checks ensure that unique emails are used for registration.
  - OTP verification using flaskmail module

- **Login:**
  - Registered users can log in using their email and password.

### 2. Service Listings

- **Home Page:**
  - Upon login, users are directed to the home page where they can view a list of available services based on their location.
  - Services are categorized for easy navigation, such as plumbing, electrician, carpentry, etc.

- **Service Details:**
  - Clicking on a service takes the user to the service details page.
  - Details include service description, pricing, availability, and any special offers.

### 3. Booking Services

- **Booking Process:**
  - Users can select a service they want to book.
  - They choose a convenient date and time for the service appointment.
  - Additional options may include selecting specific service providers if available.

- **Confirmation:**
  - After selecting all necessary options, users confirm their booking.
  - Confirmation includes a summary of the booking details and total cost.

### 4. Payment Processing

- **Integration with Payment Gateway:**
  - TaskMate integrates with Stripe payment gateway for secure payment processing.
  - Users can make payments using credit/debit cards.

- **Payment Confirmation:**
  - Upon successful payment, users receive a payment confirmation along with their booking details.

### 5. User Dashboard

- **Profile Management:**
  - Users can view booking history.
    
- **Booking Management:**
  - Users can view upcoming bookings, reschedule or cancel bookings if allowed by the system.

### 6. Admin Panel

- **Dashboard:**
  - They can add/edit/delete services, manage service providers, and view booking reports.

### 7. Error Handling and Security

- **Error Handling:**
  - TaskMate includes robust error handling mechanisms to handle exceptions gracefully.
  - Custom error pages or messages provide a better user experience.

- **Security Measures:**
  - Role-based access control (RBAC) ensures that only authorized users can perform sensitive actions.

## Technologies Used

- **Backend:**
  - Flask: Python web framework for backend development.

- **Frontend:**
  - React: JavaScript library for building user interfaces.
  - React Router: For client-side routing within the React application.

- **Database:**
  - MySQL: Relational database management system for storing application data.
  - SQLAlchemy ORM: Object-Relational Mapping for seamless interaction with MySQL.

- **Payment Processing:**
  - Stripe API: Integration for handling payment processing securely.

## Installation and Setup

1. **Backend Setup:**
   - Clone the backend repository and navigate to the project directory.
   - Install dependencies using `pip install -r requirements.txt`.
   - Configure environment variables for database connection, secret key, etc.

2. **Frontend Setup:**
   - Clone the frontend repository and navigate to the project directory.
   - Install dependencies using `npm install` or `yarn install`.
   - Configure environment variables if needed (e.g., API endpoint URLs).
   - Start the React development server using `npm run dev`.

3. **Database Setup:**
   - Create a MySQL database and configure connection details in the backend environment.

4. **Integration:**
   - Ensure that the frontend and backend are correctly integrated, with API endpoints for data exchange.
   - Test the application thoroughly in development mode before deploying to production.


## Conclusion

TaskMate provides a seamless experience for users to book services online, streamlining the process from service selection to payment and confirmation. With a robust backend, secure authentication, and intuitive frontend, TaskMate is designed to meet the needs of both users and administrators in managing service bookings effectively.
