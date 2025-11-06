import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Project from './models/Project.js';
import User from './models/User.js';

dotenv.config();

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/eduprojects');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    console.log('Cleared existing data');

    // Create Faculty Users
    const facultyUsers = [
      {
        firstName: 'John',
        lastName: 'Smith',
        collegeId: 'FAC001',
        email: 'john.smith@edu.com',
        password: 'password123',
        role: 'faculty',
        department: 'CSE',
        designation: 'Professor'
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        collegeId: 'FAC002',
        email: 'sarah.johnson@edu.com',
        password: 'password123',
        role: 'faculty',
        department: 'ECE',
        designation: 'Associate Professor'
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        collegeId: 'FAC003',
        email: 'michael.brown@edu.com',
        password: 'password123',
        role: 'faculty',
        department: 'MECH',
        designation: 'Assistant Professor'
      },
      {
        firstName: 'Priya',
        lastName: 'Tirumala',
        collegeId: 'FAC004',
        email: 'priya.tirumala@edu.com',
        password: 'password123',
        role: 'faculty',
        department: 'ECE',
        designation: 'Professor'
      },
      {
        firstName: 'Anitha',
        lastName: 'R',
        collegeId: 'FAC005',
        email: 'anitha.r@edu.com',
        password: 'password123',
        role: 'faculty',
        department: 'CSE',
        designation: 'Associate Professor'
      }
    ];

    const createdFaculty = await User.insertMany(facultyUsers);
    console.log('Created faculty users');

    // Create Student Users
    const studentUsers = [
      {
        firstName: 'Talari',
        lastName: 'Janardhan',
        collegeId: 'RS200766',
        email: 'talari.janardhan@edu.com',
        password: 'password123',
        role: 'student',
        department: 'ECE',
        year: 'Final Year'
      },
      {
        firstName: 'Sarah',
        lastName: 'Chen',
        collegeId: 'STU002',
        email: 'sarah.chen@edu.com',
        password: 'password123',
        role: 'student',
        department: 'CSE',
        year: 'Final Year'
      },
      {
        firstName: 'Alex',
        lastName: 'Rodriguez',
        collegeId: 'STU003',
        email: 'alex.rodriguez@edu.com',
        password: 'password123',
        role: 'student',
        department: 'EEE',
        year: '3rd Year'
      }
    ];

    const createdStudents = await User.insertMany(studentUsers);
    console.log('Created student users');

    // Create Sample Projects
    const sampleProjects = [
      {
        title: 'Surveillance Spy Robot Using ESP32-CAM',
        category: 'Hardware',
        branch: 'ECE',
        shortOverview: 'Smart robot for surveillance with live camera feed and Wi-Fi control',
        description: 'The Surveillance Spy Robot project integrates ESP32-CAM for image capture and real-time transmission. The system uses Wi-Fi to send footage to a web dashboard. The robot includes motion control motors, IR sensors for obstacle avoidance, and a cloud-based recording module.',
        facultyGuide: createdFaculty[3]._id,
        submittedBy: createdStudents[0]._id,
        teamMembers: [
          { name: 'Talari Janardhan', studentId: 'RS200766' },
          { name: 'S Kiran', studentId: 'RS200782' }
        ],
        status: 'approved',
        facultyRemarks: 'Excellent implementation and clear documentation. Suggested improvement: Add night vision camera in future update.',
        approvedAt: new Date('2025-11-05'),
        completedAt: new Date('2025-11-10'),
        finalDocuments: {
          report: {
            filename: 'report-esp32-robot.pdf',
            path: '/uploads/documents/report-esp32-robot.pdf',
            originalname: 'Surveillance_Robot_Report.pdf',
            uploadedAt: new Date('2025-11-10')
          },
          presentation: {
            filename: 'presentation-esp32-robot.pptx',
            path: '/uploads/presentations/presentation-esp32-robot.pptx',
            originalname: 'Surveillance_Robot_Presentation.pptx',
            uploadedAt: new Date('2025-11-10')
          }
        }
      },
      {
        title: 'Work Fission Ecom Food',
        category: 'Software',
        branch: 'CSE',
        shortOverview: 'A MERN-based food ordering system for college events and canteens',
        description: 'Full-stack food ordering platform built with MongoDB, Express, React, and Node.js. Features include user authentication, menu management, cart functionality, and order tracking.',
        facultyGuide: createdFaculty[4]._id,
        submittedBy: createdStudents[1]._id,
        teamMembers: [
          { name: 'Sarah Chen', studentId: 'STU002' },
          { name: 'David Wilson', studentId: 'STU004' }
        ],
        status: 'approved',
        facultyRemarks: 'Well-structured application with good code organization.',
        approvedAt: new Date('2025-10-29'),
        completedAt: new Date('2025-11-05'),
        finalDocuments: {
          report: {
            filename: 'report-ecom-food.pdf',
            path: '/uploads/documents/report-ecom-food.pdf',
            originalname: 'Ecom_Food_Report.pdf',
            uploadedAt: new Date('2025-11-05')
          }
        }
      },
      {
        title: 'Smart Waste Segregation Bin',
        category: 'Hardware',
        branch: 'ECE',
        shortOverview: 'IoT-based bin that detects, sorts, and separates waste using sensors and servo mechanisms',
        description: 'Automated waste segregation system using IoT sensors and machine learning for efficient recycling and waste management.',
        facultyGuide: createdFaculty[0]._id,
        submittedBy: createdStudents[0]._id,
        teamMembers: [
          { name: 'Talari Janardhan', studentId: 'RS200766' }
        ],
        status: 'pending'
      }
    ];

    await Project.insertMany(sampleProjects);
    console.log('Created sample projects');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('Faculty: john.smith@edu.com / password123');
    console.log('Student: talari.janardhan@edu.com / password123');
    console.log('\n🚀 You can now start the application!');
    
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();