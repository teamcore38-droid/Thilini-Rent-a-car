import mongoose from 'mongoose';

// Queries must fail immediately when no database connection is available.
// Every model imports this configured instance before compiling its schema.
mongoose.set('bufferCommands', false);

export default mongoose;
