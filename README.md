---

# KBA Management

Management application.

---

## Installation

1. Clone the repo:
    ```bash
    git clone https://github.com/your-username/your-repository.git
    cd your-repository
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

---

## Usage

Start the development server:
```bash
npm run dev
```

---

## Database Configuration

1. Follow the [Database Configuration Guide](https://docs.google.com/document/d/1bK-qZKDa7lHEBh8XhDYn3pD8SUMjR0oU-fC8R7RYmPE/edit?usp=sharing) to set up the database.

2. Add the database connection string to the `.env` file:
    ```env
    JWT_SECRET="kba"
    DATABASE_URL="your_database_connection_string_here"
    ```

---

## JWT Configuration

The `JWT_SECRET` value is `"kba"` by default, but you can change it in the `.env` file for added security.

---

## License

This project is licensed under the MIT License.

---