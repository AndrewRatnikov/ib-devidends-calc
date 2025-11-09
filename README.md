# IB Dividends Calculator

This is a web application designed to calculate taxes on dividends from Interactive Brokers (IB). The application takes a OFX file of dividend data, fetches currency exchange rates, and presents a detailed breakdown of dividends and taxes in a clear, tabular format.

## Key Features

- **OFX Upload:** Users can upload a OFX file containing their dividend data.
- **Automatic Currency Conversion:** Fetches daily currency exchange rates (USD to UAH) to accurately calculate income and taxes in the local currency.
- **Detailed Tax Calculation:** Calculates taxes based on the converted income.
- **Data-Rich Table:** Displays a comprehensive table with columns for each step of the calculation, from the initial dividend per share to the final net income.
- **Summary Row:** Provides a summary of all key financial figures in a footer row.

## Tech Stack

- **Framework:** React (with Vite)
- **State Management:** Zustand
- **UI:** Tailwind CSS, shadcn/ui
- **Forms:** React Hook Form & Zod
- **Date & Time:** Day.js
- **Linting & Formatting:** ESLint, Prettier

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1.  Clone the repository.
2.  Navigate to the project directory.
3.  Install the dependencies:
    ```bash
    npm install
    ```

### Running the Application

To start the development server, run:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Project Structure

The project is organized as follows:

- `src/api`: Functions for fetching data from external APIs.
- `src/components`: Reusable React components, including the main `DividendsTable` and UI elements.
- `src/hooks`: Custom hooks for managing component logic and data fetching.
- `src/lib`: Utility and helper functions.
- `src/schemas`: Zod schemas for form validation.
- `src/store`: Zustand store for global state management.
