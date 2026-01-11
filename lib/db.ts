// import { drizzle } from 'drizzle-orm/vercel-postgres';
// import { sql } from '@vercel/postgres';
// import * as schema from '@/shared/schema';

// // Check if we're in a production environment
// const isProduction = process.env.NODE_ENV === 'production';

// // Initialize the database connection
// export const db = drizzle(sql, { schema });

// // Helper function to execute queries with error handling
// export async function executeQuery<T>(queryFn: () => Promise<T>): Promise<T> {
//   try {
//     return await queryFn();
//   } catch (error) {
//     console.error('Database query error:', error);
//     throw new Error('Database operation failed');
//   }
// }

// // Export schema for use in API routes
// export { schema };