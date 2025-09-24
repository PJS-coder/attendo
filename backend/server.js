// Attendance App Backend - Express server for absentee email notifications
// Save as backend/server.js

import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3004;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors());

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use(express.json());

// Student data moved to the server
const students = [
  { roll: "25CS01", name: "MOHAMMAD SAHIL", email: "sahilansari74808@gmail.com" },
  { roll: "25CS02", name: "NANDNI", email: "nandinibaghel171@gmail.com" },
  { roll: "25CS03", name: "NISHKA KAPOOR", email: "nishka.kap@gmail.com" },
  { roll: "25CS04", name: "SALONI", email: "salonihiyaan@gmail.com" },
  { roll: "25CS05", name: "MAYANK", email: "mayanksharma202722@gmail.com" },
  { roll: "25CS06", name: "ANUJ KUMAR THAKUR", email: "thakuranujtm7@gmail.com" },
  { roll: "25CS07", name: "PRINCE", email: "princekaushik@gmail.com" },
  { roll: "25CS08", name: "VISHAL SINGH", email: "vishalsinghvr2020@gmail.com" },
  { roll: "25CS09", name: "KARTIK GOSWAMI", email: "goswamikartik349@gmail.com" },
  { roll: "25CS10", name: "DEEPAK JOSHI", email: "" },
  { roll: "25CS11", name: "RIYA MENDIRATTA", email: "mendirattariya01@gmail.com" },
  { roll: "25CS12", name: "BHARAT", email: "" },
  { roll: "25CS13", name: "BHARAT BHUSHAN JAIN", email: "lecyjainpg29@gmail.com" },
  { roll: "25CS14", name: "PAYAL", email: "" },
  { roll: "25CS15", name: "PRASHANT SOLANKI", email: "" },
  { roll: "25CS16", name: "MRIDUL", email: "mridultanwar2006@gmail.com" },
  { roll: "25CS17", name: "SAHIL", email: "sahilchoudhary7678472566@gmail.com" },
  { roll: "25CS18", name: "SACHIN KUMAR", email: "jhasachin0661@gmail.com" },
  { roll: "25CS19", name: "PRANT", email: "prantyadav2006@gmail.com" },
  { roll: "25CS20", name: "MOHAMMAD REHAN", email: "rehanali837784@gmail.com" },
  { roll: "25CS21", name: "YASH", email: "yash2007soni@gmail.com" },
  { roll: "25CS22", name: "SACHIN YADAV", email: "sy833225@gmail.com" },
  { roll: "25CS23", name: "DHANANJAY", email: "cy081939@gmail.com" },
  { roll: "25CS24", name: "MADHAV GARG", email: "madhavisborngarg@gmail.com" },
  { roll: "25CS25", name: "DEEPAK AGGARWAL", email: "deepakagg9217@gmail.com" },
  { roll: "25CS26", name: "DIVYANSH GOSWAMI", email: "divyanshgoswami@outlook.in" },
  { roll: "25CS27", name: "PIYUSH SINGH", email: "piyushkhatter27@gmail.com" },
  { roll: "25CS28", name: "MUSKAN KASHYAP", email: "" },
  { roll: "25CS29", name: "PRITIKA SINGH", email: "pritikasingh0705@gmail.com" },
  { roll: "25CS30", name: "RIDHIMA MISHRA", email: "mishraridhima65@gmail.com" },
  { roll: "25CS31", name: "PRANAV KABDAL", email: "kabdalpranav@gmail.com" },
  { roll: "25CS32", name: "MD DANISH HUSSAIN", email: "mdh1236@gmail.com" },
  { roll: "25CS33", name: "UJJWAL", email: "ujjwalbhardwaj179@gmail.com" },
  { roll: "25CS34", name: "KRRISH SHARMA", email: "krrishsharma5132u@gmail.com" },
  { roll: "25CS35", name: "RISHI KUMAR", email: "rishik.1316@gmail.com" },
  { roll: "25CS36", name: "ANVI NIDHI", email: "nidhianvi0@gmail.com" },
  { roll: "25CS37", name: "VARUN KUMAR", email: "kashyappvarun0099@gmail.com" },
  { roll: "25CS38", name: "KARTIK", email: "kartik.kanha01235@gmail.com" },
  { roll: "25CS39", name: "RITIK MOURYA", email: "ritikrajput0509@gmail.com" },
  { roll: "25CS40", name: "AKARSH MANI TRIPATHI", email: "" },
  { roll: "25CS41", name: "RIMJHIM", email: "rairimjhim712@gmail.com" },
  { roll: "25CS42", name: "SAGAR", email: "sagarbhadana2217@gmail.com" },
  { roll: "25CS43", name: "ANGAD DEEP SINGH", email: "angadclg16@gmail.com" },
  { roll: "25CS44", name: "LAKSHYA VASHIST", email: "" },
  { roll: "25CS45", name: "NIKHIL KUNDU", email: "nkundu602@gmail.com" },
  { roll: "25CS46", name: "VIVEK MISHRA", email: "vivek.uk30@gmail.com" },
  { roll: "25CS47", name: "ALOK NATH JHA", email: "aloknathjha77@gmail.com" },
  { roll: "25CS48", name: "ANKIT KUMAR", email: "" },
  { roll: "25CS49", name: "LAWANSHI", email: "rawatpriyanka751@gmail.com" },
  { roll: "25CS50", name: "KRISH", email: "krish1haryana23@gmail.com" },
  { roll: "25CS51", name: "ROHIT SHARMA", email: "pt.rohitgaur0052@gmail.com" },
  { roll: "25CS52", name: "ISHANA SHARMA", email: "ishana.sharma024@gmail.com" },
  { roll: "25CS53", name: "KESHAV KUMAR SHARMA", email: "kksharma7400@gmail.com" },
  { roll: "25CS54", name: "SIDDHI GARG", email: "gargsiddhi.421@gmail.com" },
  { roll: "25CS55", name: "ANURADHA", email: "anusinghanuradha@gmail.com" },
  { roll: "25CS56", name: "QUTUBUDDIN KHAN", email: "qutubsaifi007@gmail.com" },
  { roll: "25CS57", name: "DIKSHA BHATI", email: "dikshabhati2007@gmail.com" },
  { roll: "25CS58", name: "KUNAL SONI", email: "ks9792492@gmail.com" },
  { roll: "25CS59", name: "KHUSHBOO", email: "khushbooaks.899@gmail.com" },
  { roll: "25CS60", name: "PIYUSH GUPTA", email: "piyush789pg@gmail.com" },
  { roll: "R/W", name: "KRANTI CHAUHAN", email: "krantirajput2008@gmail.com" },
  { roll: "R/W", name: "SARTHAK OBEROI", email: "07.sarthak11@gmail.com" },
  { roll: "R/W", name: "RISHABH AGGARWAL", email: "rpaggarwal22@gmail.com" },
  { roll: "R/W", name: "KANISHK KUSHWAHA", email: "kanishkkushwaha0770@gmail.com" }
];

// Configure your email credentials here
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'thakuranujtm6@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'  // Use environment variable in production
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Route to render the main EJS template
app.get('/', (req, res) => {
  res.render('index', { students });
});

// API route to send absentee emails
app.post('/send-absent-mails', async (req, res) => {
  const { date, subject, absentees } = req.body;
  console.log(`\n📧 Email request received for date: ${date}`);
  console.log(`📋 Absentees to email: ${absentees.length} for subject: ${subject}`);
  
  if (!Array.isArray(absentees) || !date || !subject) {
    console.log('❌ Invalid data received - missing required fields');
    return res.status(400).json({ error: 'Missing required fields: date, subject, or absentees' });
  }
  
  if (absentees.length === 0) {
    console.log('ℹ️ No absentees to email');
    return res.json({ sent: [] });
  }
  
  let results = [];
  for (const student of absentees) {
    if (!student.email) {
      console.log(`⚠️ Skipping ${student.name} (${student.roll}) - no email`);
      continue;
    }
    
    try {
      console.log(`📤 Sending email to ${student.name} (${student.email})...`);
      await transporter.sendMail({
        from: 'thakuranujtm6@gmail.com', // Use your actual email
        to: student.email,
        subject: `Absence Notification for ${subject} on ${date}`,
        text: `Dear ${student.name},  
            You were marked absent in ${subject} on ${date}. Please contact your teacher if this is incorrect.  

            Even a single day of absence contributes to your overall attendance record.  
            Repeated absences may result in a shortage of attendance, which can impact your eligibility for examinations.  
            You are advised to ensure regular attendance to avoid any academic difficulties.  

            Subject: ${subject}
            Date: ${date}

            Thank you.`
      });
      console.log(`✅ Email sent successfully to ${student.name}`);
      results.push({ roll: student.roll, status: 'sent' });
    } catch (err) {
      console.error(`❌ Failed to send email to ${student.email}:`, err.message);
      results.push({ roll: student.roll, status: 'error', error: err.message });
    }
  }
  
  console.log(`📊 Email summary: ${results.filter(r => r.status === 'sent').length} sent, ${results.filter(r => r.status === 'error').length} failed`);
  res.json({ sent: results });
});

app.listen(PORT, () => {
  console.log(`Attendance backend running on http://localhost:${PORT}`);
});