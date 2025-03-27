# retro-reel-backend

Retro-Reel - Project README

🎵 Description
CWelcome to the backend of Retro Reel! This server is built with Express and Prisma and provides a RESTful API to handle all the data management for the Retro Reel app, which is focused on films from the 80s and 90s. The backend allows users to save, discover, and organize their favorite films, with full support for user authentication, film CRUD operations, and seamless integration with the frontend.

🔗 Related Repositories

- The backend repository handles API logic, data models, and user management.

- The frontend repository can be found here: Frontend Repo.

🛠️ How to Run the App Locally
Follow the steps below to get the app running on your local machine:

1. Clone the repository
   To get a local copy of the project, open a terminal and run the following command:

git clone https://github.com/PonyTailExpress/retro-reel-backend.git

2. Install dependencies
   Once you have cloned the project, navigate to the project folder and install the necessary dependencies:

- cd retro-reel-backend

- npm install

3. Set up environment variables
   This project requires certain environment variables for API keys or other settings. Here's how to set them up:

Create a .env file in the root directory and add the following variables:

TOKEN_SECRET="xxxx"
OMDB_API_KEY=7ffceb24
PORT=5000
ORIGIN=http://localhost:5173

4. Run the application
   After setting up the environment variables, run the following command to start the development server:

   npm run dev

   The API should now be available at http://localhost:5000

📡 API Endpoints

GET /films: Get all films from the 80s and 90s.

POST /films: Add a new film to the database.

GET /films/:id: Get a specific film by its ID.

PUT /films/:id: Update a specific film's details.

DELETE /films/:id: Remove a film from the database.

🌐 Demo
You can view the live demo of the application at:

https://retro-reel.netlify.app/

📝 License
This project is licensed under the MIT License - see the LICENSE file for details.
