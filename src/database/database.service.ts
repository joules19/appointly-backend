import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection, createConnection } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DatabaseService implements OnModuleInit {
    constructor(@InjectConnection() private readonly connection: Connection) { }

    async onModuleInit() {
        await this.createDatabaseIfNotExists();
        await this.reconnectToDatabase();
        await this.runSchemaScript();
    }

    private async createDatabaseIfNotExists() {
        try {
            // Check if the database exists
            await this.connection.query('USE appointment_system');
        } catch (error) {
            // If the database doesn't exist, create it
            if (error.code === 'ER_BAD_DB_ERROR') {
                await this.connection.query('CREATE DATABASE appointment_system');
                console.log('Database created successfully.');
            } else {
                throw error;
            }
        }
    }

    private async reconnectToDatabase() {
        // Close the existing connection
        await this.connection.close();

        // Reconnect to the newly created database
        const newConnection = await createConnection({
            type: 'mysql',
            host: 'localhost',
            port: 3306,
            username: 'root',
            password: 'Password1',
            database: 'appointment_system', // Specify the database name
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            synchronize: false,
            logging: true,
        });

        console.log('Reconnected to the appointment_system database.');
    }

    private async runSchemaScript() {
        try {
            // Construct the correct path to schema.sql in the src folder
            const schemaPath = path.join(__dirname, '../../src/schema.sql');
            console.log('Schema path:', schemaPath); // Debugging: Log the path

            // Read the schema.sql file
            const schemaScript = fs.readFileSync(schemaPath, 'utf8');

            // Split the script into individual queries
            const queries = schemaScript
                .split(';') // Split by semicolon
                .map((query) => query.trim()) // Remove leading/trailing whitespace
                .filter((query) => query.length > 0); // Remove empty queries

            // Execute each query sequentially
            for (const query of queries) {
                await this.connection.query(query);
            }

            console.log('Database schema initialized successfully.');
        } catch (error) {
            console.error('Failed to initialize database schema:', error);
        }
    }
}