# Role-Based-Task-Monitoring-Dashboard
### • A full-stack web application built using FastAPI (backend) and React (frontend). 
### • Implements role-based login for Admin and Employees. 
### • Allows employees to view their assigned tasks. 
### • Admins can view overall reports and task status. 
### • Real-time monitoring with auto-refresh and visual reporting.

#  Project Overview
This project is designed to handle task management with clear role-based access control. It features two user roles: Admin and Employee. Employees can only view their assigned tasks, while the Admin has a broader view to monitor and report on all tasks. The data refreshes automatically, making it suitable for real-time monitoring needs

# Key Features
Some key features of the application include secure JWT-based login, separate task tables for Task A, B, and C, role-based views, and a report section with graphs. Admins can use these graphs to track performance across different tasks.

# Technology Stack
I’ve used FastAPI for the backend, React with Axios for the frontend, and Recharts for data visualization. SQLite is used for data storage. 

# How It Works
The app begins with a login screen. Once logged in, Employees see only their tasks—marked as 'Pending' or 'Completed'. Admins can view every task across all users and use filters to generate reports. The UI is simple and updates data in near real-time.

# Conclusion
This system solves the problem of task visibility in role-based teams. It’s scalable—you can add more users or tasks easily. The separation of access ensures security, while graphs give a clear visual of progress. It’s a great fit for small-to-medium teams or internal dashboards.
