# 🏢 Employee Leave Management System

This is a **full-stack leave management application** for employees and managers.

It lets:

- Employees request leaves, check balances, and see approval status.
- Managers approve/reject requests, comment, and reset balances.
- Managers view a leave calendar for their team.

### Deployment:

**🌐 Live Demo:** [https://employee-leave-management-system-alpha.vercel.app/](https://employee-leave-management-system-alpha.vercel.app/)  


---

## ⚙️ **Tech Stack**

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Auth:** JWT (JSON Web Tokens)
- **API Client:** Axios
- **Deployment-ready:** Docker & Docker Compose
- **Deployment:** Render (API) + Vercel (Frontend)

---

## ✨ **Features**

✔️ Employee login/register  
✔️ JWT-based secure auth  
✔️ Submit & manage leave requests  
✔️ Manager dashboard to approve/reject  
✔️ Reset employee leave balances  
✔️ Team leave calendar  
✔️ Mobile-friendly & responsive  
✔️ Fully containerized with Docker  
✔️ Easy to deploy anywhere

---

## 📁 **Project Structure**
    ```
        employee-leave-management-system/
        ├── client/ # React frontend (Vite)
        ├── server/ # Express backend
        ├── docker-compose.yml
        ├── .env
        ├── README.md
    ```

---

### Getting Started:

---

## ✅ Run Locally (With Docker-Compose)

1. **Clone the repository**
   ```sh
   git clone https://github.com/kumar-aryan083/Employee-Leave-Management-System.git
   cd Employee-Leave-Management-System
   ```
2. Create an `.env` file at the root level where `docker-compose.yml` is present following the format given in `.env.example`.
3. Start the containers:
   ```sh
    docker-compose up --build
   ```
4. Visit the app
    ```sh
    Frontend: http://localhost
    Backend API: http://localhost:5000/api
    ```
---

## ✅ Run Locally (Without Docker)

1. **Clone the repository**
   ```sh
   git clone https://github.com/kumar-aryan083/Employee-Leave-Management-System.git
   cd Employee-Leave-Management-System
   ```
2. Create an `.env` file in both `client` and `server` directories, following the format given in `.env.example`.
3. Install dependencies:
   ```sh
    # Install backend dependencies
    cd server
    npm install
   ```
   ```sh
    # Install frontend dependencies
    cd ../client
    npm install
    ```

4. Run both servers:
    ```sh
    #Terminal 1
    cd server
    npm start

    #Terminal 2
    cd client
    npm run dev
    ```

5. Visit the app
    ```sh
    Frontend: http://localhost:5173
    Backend API: http://localhost:5000/api
    ```