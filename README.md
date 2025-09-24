# Attendo - Attendance Management Web App

A comprehensive web-based attendance management system for educational institutions.

## Features

- **Dashboard**: Overview of daily attendance statistics
- **Mark Attendance**: Record student attendance by subject and date
- **Student Management**: Add, edit, and manage student records
- **Email Notifications**: Automatic absence notifications to students
- **Export Data**: Download attendance data as CSV files
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Backend**: Node.js with Express.js
- **Frontend**: HTML, CSS (Tailwind), JavaScript
- **Template Engine**: EJS
- **Email Service**: Nodemailer
- **Storage**: Local storage for attendance data

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm package manager

### Installation

1. Clone the repository
```bash
git clone <your-repo-url>
cd attendo
```

2. Install dependencies
```bash
npm install
```

3. Configure email settings
   - Update the email credentials in `backend/server.js`
   - Use environment variables for production:
     - `EMAIL_USER`: Your email address
     - `EMAIL_PASS`: Your app password

4. Start the application
```bash
npm start
```

5. Open your browser and navigate to `http://localhost:3004`

## Deployment

This app is ready for deployment on platforms like Render, Heroku, or Railway.

### Environment Variables for Production
- `EMAIL_USER`: Gmail address for sending notifications
- `EMAIL_PASS`: Gmail app password
- `PORT`: Server port (automatically set by hosting platform)

## Usage

1. **Dashboard**: View daily attendance statistics and charts
2. **Mark Attendance**: Select date and subject, then mark students as present/absent
3. **Send Notifications**: Click "Send Absentee Emails" to notify absent students
4. **Manage Students**: Add new students or edit existing records
5. **Export Data**: Download attendance reports in CSV format

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

ISC License

## Author

Created by Anuj Kumar Thakur