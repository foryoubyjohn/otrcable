# OTR Cable Construction Website

A modern, responsive website for OTR Cable Construction, built with Next.js, React, and Tailwind CSS.

## Features

- **Modern UI/UX** with responsive design
- **Contact Form** with form validation and database storage
- **Services Showcase** to display company services
- **Project Portfolio** to showcase completed work
- **Admin Dashboard** for managing content (coming soon)
- **Blog** for company updates and industry news (coming soon)

## Prerequisites

- Node.js 18.0.0 or later
- npm or yarn
- MySQL or PostgreSQL database
- Git

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/otr-cable-construction.git
   cd otr-cable-construction
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Update the `.env.local` file with your database credentials and other settings.

4. **Set up the database**
   ```bash
   # Run database migrations
   npx prisma migrate dev --name init
   
   # Generate Prisma Client
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npx prisma studio` - Open Prisma Studio to manage your database

## Project Structure

```
otr-cable-construction/
├── .next/                 # Next.js build output
├── node_modules/          # Dependencies
├── prisma/                # Prisma schema and migrations
│   └── schema.prisma      # Database schema
├── public/                # Static files
├── src/
│   ├── app/               # App router
│   │   ├── api/           # API routes
│   │   ├── contact/       # Contact page
│   │   ├── services/      # Services page
│   │   └── page.jsx       # Home page
│   ├── components/        # Reusable components
│   │   ├── ui/            # UI components
│   │   └── layout/        # Layout components
│   ├── lib/               # Utility functions
│   └── styles/            # Global styles
├── .env.example          # Example environment variables
├── .eslintrc.json        # ESLint configuration
├── .gitignore           # Git ignore file
├── next.config.js       # Next.js configuration
├── package.json         # Project dependencies
├── postcss.config.js    # PostCSS configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## Database

This project uses Prisma as the ORM. The database schema is defined in `prisma/schema.prisma`.

### Running Migrations

After making changes to your schema, run:

```bash
# Create and apply a new migration
npx prisma migrate dev --name your_migration_name

# Apply pending migrations in production
npx prisma migrate deploy
```

### Prisma Studio

To view and edit your database in a GUI, run:

```bash
npx prisma studio
```

## Styling

This project uses Tailwind CSS for styling. Custom styles can be added in `src/styles/globals.css`.

### Adding New Styles

1. **Utility-First**: Use Tailwind's utility classes directly in your components.
2. **Custom Components**: Create reusable components in `src/components/ui`.
3. **Custom Styles**: Add custom styles in `src/styles/globals.css`.

## Deployment

### Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

### Other Platforms

You can also deploy to other platforms like Netlify, Heroku, or your own server. Make sure to set up the required environment variables in your deployment environment.

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or feedback, please contact us at [support@otrcable.com](mailto:support@otrcable.com).
