# SalesPro 9000

## Overview
SalesPro 9000 allows sales people to prove their sales powers without divulging sensitive informative.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Usage](#usage)
5. [Configuration](#configuration)
6. [Running Tests](#running-tests)
7. [Deployment](#deployment)
8. [Contributing](#contributing)
9. [License](#license)
10. [Acknowledgements](#acknowledgements)

## Prerequisites
List the software and tools needed to run your project.
- Node.js (>= version 18.16.x)
- yarn
- Vue CLI (optional, if Vue CLI is used)

## Installation
Detailed steps to install your project.
1. Clone the repository:
    ```sh
    git clone https://github.com/Yangiboev/sales_midnight
    ```
2. Navigate to the project directory:
    ```sh
    cd sales_midnight
    ```
3. Install server dependencies:
    ```sh
    yarn
    ```
4. Navigate to the Vue.js frontend directory:
    ```sh
    cd example/frontend
    ```
5. Install frontend dependencies:
    ```sh
    yarn install
    ```


## Usage
Instructions to run the project for development and production.

### Development
1. Start the backend server:
    ```sh
    npm run dev
    ```
2. Start the Vue.js frontend:
    ```sh
    cd frontend
    npm run serve
    ```

### Production
1. Build the Vue.js application:
    ```sh
    cd frontend
    npm run build
    ```
2. Move the built files to the server directory (assuming a `dist` folder is generated):
    ```sh
    cp -r dist/* ../public/
    ```
3. Start the backend server:
    ```sh
    npm start
    ```


## Configuration
Instructions to configure environment variables and other settings.
- Create a `.env` file in the root directory of your project and add necessary variables:
    ```env
    PORT=3000
    VUE_APP_API_BASE_URL=http://localhost:3001/api
    ```

## Running Tests
Steps to run tests for both the backend and frontend.
1. Backend tests:
    ```sh
    npm test
    ```
2. Frontend tests (inside the `frontend` directory):
    ```sh
    npm run test
    ```

## Contributing
Guidelines for contributing to the project.
- Fork the repository
- Create a new branch (`git checkout -b feature/your-feature`)
- Commit your changes (`git commit -m 'Add some feature'`)
- Push to the branch (`git push origin feature/your-feature`)
- Open a pull request

## License
Apache 

## Acknowledgements
Credits to resources, libraries, or individuals that helped with the project.
- [Vue.js](https://vuejs.org/)
- [Express.js](https://expressjs.com/)
- [Midnight](https://midnight.network/)
