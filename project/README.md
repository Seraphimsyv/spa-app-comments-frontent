# SPA Comments app | Frontend

This repository contains a React project built with TypeScript.

## Setup Instructions

1. **Clone the repository:**
    ```bash
    git clone <repository_url>

    cd <project-folder>/project
    ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Start the development server:**
    ```bash
    npm start
    ```
4. **View the app:**
   Open your browser and go to [http://localhost:3000](http://localhost:3000

## Project Structure

- `common/`: Contains common files and utilities.
  - `constant.ts`: File with common constants.
  - `interfaces.ts`: Interfaces describing common data types.
  - `types.ts`: Common custom data types.
  - `utils.ts`: Utilities and helper functions.
- `components/`: Contains React components.
- `providers/`: Providers facilitating access to various services.
  - `auth.provider.ts`: Authentication provider.
  - `comment.provider.ts`: Comment provider.
- `services/`: Services providing interaction with external resources or services.
  - `socket.service.ts`: Socket service for real-time interaction.

## Production Build

- Run `npm run build` to create a production-ready build.
- The optimized build will be located in the `build/` directory.

## Author

[Kiril Hohlov]