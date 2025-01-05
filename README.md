# ChillBill Project Overview

ChillBill is a personal finance management application designed to help users track, categorize, and save their financial transactions. The project aims to simplify the process of managing one's finances, making it easier to stay on top of expenses and income.

## Features

1. **Transaction Tracking**: Users can record and categorize their financial transactions, including income and expenses.
2. **Budgeting**: The application calculates a user's budget based on their income and expenses, providing a clear picture of their financial situation.
3. **Chatbot Integration**: A built-in chatbot is available to assist users with their financial queries and provide personalized advice.
4. **Contact Us**: A contact form is provided for users to reach out to the ChillBill team with any questions or feedback.

## Technologies Used

1. **Frontend**: The application's frontend is built using Next.js, a popular React-based framework for building server-rendered, statically generated, and performance-optimized websites and applications.
2. **Backend**: The backend is built using Node.js, Express.js, and MongoDB for data storage.
3. **Libraries and Tools**: Additional libraries and tools used include React, React-Lottie-Player, Flowbite, and Google Generative AI for chatbot functionality.

## Project Structure

The project is divided into the following components:

1. **components**: This directory contains reusable React components used throughout the application.
2. **models**: This directory contains MongoDB schema definitions for data models used in the application.
3. **pages**: This directory contains Next.js pages that make up the application's routes.
4. **public**: This directory contains static assets such as images and Lottie animations.
5. **utils**: This directory contains utility functions used throughout the application.

## Installation and Setup

To set up the project locally, follow these steps:

1. Clone the repository: `git clone https://github.com/your-username/chillbill.git`
2. Install dependencies: `npm install` or `yarn install`
3. Create a `.env` file with the following environment variables:
   - `MONGODB_URI`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_GEMINI_API_KEY`
4. Start the development server: `npm run dev` or `yarn dev`
5. Open the application in your web browser: `http://localhost:3000`

## Contributing

Contributions to the ChillBill project are welcome. If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Make your changes and commit them.
4. Push your branch to your forked repository.
5. Submit a pull request to the original repository.

## License

The ChillBill project is licensed under the MIT License.
