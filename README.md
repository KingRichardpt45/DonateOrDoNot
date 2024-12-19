# Next.js Crowdfunding Platform

This project is a Next.js application developed as part of a group project to design and build a persuasive crowdfunding platform. The platform leverages modern design principles, gamification, and scalable architecture to encourage user engagement and secure donations for charitable causes.

## Features

- **Campaign Management**: 
  - Verified users can create, edit, and manage campaigns.
  - Support for multimedia uploads (images, videos) to enhance campaign appeal.

- **Progress Visualization**: 
  - Dynamic progress bars showcasing fundraising achievements.
  - Segmented milestones with visual updates to track goals effectively.

- **Persuasive Elements**: 
  - Real-time donation updates and live donor acknowledgments.
  - Integration of testimonials from beneficiaries to build trust.

- **Gamification**: 
  - Earn badges and maintain donation streaks for consistent engagement.
  - Leaderboards to showcase top donors and competitive contributions.

- **Social Sharing**: 
  - Seamless integration with platforms like Facebook, Twitter, and Instagram.
  - Pre-generated shareable content to maximize campaign reach.

- **Analytics Dashboard**: 
  - Detailed insights into campaign performance, donor trends, and engagement metrics.
  - Visual reports to inform and optimize fundraising strategies.

- **WebSocket Support**: 
  - Real-time interaction and updates for seamless user experience.

## Prerequisites

Ensure the following are installed on your system:

- Node.js (16.x or newer)
- npm (8.x or newer)

## Environment Variables

Create a `.env` file in the root of the project directory. Add the required environment variables:

```bash
COOKIE_SECRET=your_password_for_encryption_of_cookies
PW_ENCRYPTION_KEY=password_encryption (32 characters)
SOCKET_IO_HOST=socket_hostname
SOCKET_IO_PORT=socket_port
URL="http://localhost:3000"
```

Replace placeholders with your actual configuration.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/KingRichardpt45/DonateOrDoNot.git
   cd DonateOrDoNot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Compile the `SocketServer.ts` file:
   ```bash
   npx tsc src/SocketServer.ts --downlevelIteration
   ```

## Running the Application

1. Start the development server:
   ```bash
   npm run dev2
   ```

2. In a separate console, run the additional server process:
   ```bash
   npm run dev
   ```

3. Access the app at `http://localhost:3000`.

## Scripts

- `npm run dev`: Starts the main server.
- `npm run dev2`: Starts the sokcetIo main server.

## Project Structure

- `.next/`: Build outputs and Next.js cache.
- `.vscode/`: Configuration files for Visual Studio Code.
- `src/`: Contains the core application source code:
  - `app/`: Next.js app directory for page routing.
  - `core/`: Core utilities and shared functionality.
  - `db/`: Database configuration and migration files.
    - `DonateOrDoNotdev_DB.sqlite3`: SQLite database file.
    - `KnexConnection.ts`: Knex.js connection setup.
  - `models/`: Database models and ORM logic.
  - `services/`: Service layer containing application logic:
    - `SocketServer.ts`: Main WebSocket server file.
  - `migrations/`: Database migration scripts.
- `public/`: Static assets like images and other files.
- `.env`: Environment variable file **not committed to version control**.
