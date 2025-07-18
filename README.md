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

# Table Structure
<img width="1473" height="645" alt="image" src="https://github.com/user-attachments/assets/908a946b-1d81-4888-9d4a-1bdf00e7b71e" />

# Swagger UI
<img width="1752" height="958" alt="image" src="https://github.com/user-attachments/assets/1a782530-2959-447d-8a1a-077e4ab9a149" />

# Login API-Endpoint
<img width="905" height="927" alt="image" src="https://github.com/user-attachments/assets/1b4605b5-7f76-4aef-b7ff-de5aabf9eff1" />

# Tasks API-Endpoint
<img width="914" height="629" alt="image" src="https://github.com/user-attachments/assets/e16f3075-75ae-4d6a-8543-4739b2427940" />

# Report API-Endpoint
<img width="901" height="623" alt="image" src="https://github.com/user-attachments/assets/91ad3a16-d938-4353-a1db-557b405f1c57" />

# Admin UI
<img width="1887" height="769" alt="image" src="https://github.com/user-attachments/assets/20165779-bc39-4041-8e56-cf60c7911144" />


# Employee UI
<img width="1890" height="618" alt="image" src="https://github.com/user-attachments/assets/31b8c516-93b8-4cd2-b8a5-2dce33a7166c" />






