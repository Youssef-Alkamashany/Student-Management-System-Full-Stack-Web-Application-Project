# 🎓 Student Management System
> **A High-Performance Full-Stack Web Application for Streamlined Student Records Management.**

<div align="center">

![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![JSON](https://img.shields.io/badge/JSON-000000?style=for-the-badge&logo=json&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</div>

---

### 🌟 Overview
This project is a **Full-Stack Student Management System** built with a modular architecture. Designed for maximum portability and rapid deployment, it utilizes a **structured JSON file storage system** (flat-file database) instead of traditional SQL, ensuring zero server configuration and fast operations for small-scale applications.

---

### 🚀 Key Features
* ⚡ **Complete CRUD Engine:** Dynamically Create, Read, Update, and Delete student records through an API-driven interface.
* 📂 **Zero-Config Database:** Data is stored in portable `.json` files, allowing the entire application to be moved easily without SQL setups.
* ⚙️ **Modular Configuration:** A dedicated configuration file manages core application settings.
* 📱 **Responsive UI:** Professional design styled with CSS3 Grid and Flexbox for seamless use on all devices (desktop and mobile).

---

### 🛠️ Tech Stack & Architecture

| Layer | Technology Used | Role |
| :--- | :--- | :--- |
| **Frontend** | `HTML5`, `CSS3`, `JS (ES6+)` | User Interface, Styling, and AJAX Interactivity |
| **Backend** | `PHP` | Server-Side API, Data Validation, and JSON File Handling |
| **Data Storage** | `JSON` | Structured Flat-File Database (`data/students.json`) |
| **Environment** | `Apache` | Local Hosting Environment (e.g., XAMPP, WAMP) |

---
### 👤 Author
**Youssef Alkamashany**
* 🚀 **Aspiring MLOps/LLMOps & AI Data Engineer**.
* 💼 Team Leader — Microsoft Data Engineering | Digital Egypt Pioneers Initiative (DEPI).

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/youssef-alkamashany-18261132b)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Youssef-Alkamashany)
----------
### 📂 Project Structure
```text
├── api/                # Core Backend Logic (API Layer)
│   ├── config.php      # Global configuration & core settings (CRITICAL)
│   ├── create.php      # Business logic to add new student entries
│   ├── read.php        # Logic to fetch and retrieve student data
│   ├── update.php      # Logic to modify existing records
│   └── delete.php      # Logic to remove student entries
├── data/               # Persistent Storage Layer
│   └── students.json   # The structured JSON database
├── connection.php      # Data stream management & server bridge
├── index.php           # Main User Interface (Entry Point)
├── script.js           # Client-side logic & AJAX requests
└── Styles.css          # Custom, professional UI styling
