import { ref, get, child } from 'firebase/database';
import { database } from '../config/firebase';

export const testDatabaseConnection = async () => {
  try {
    console.log('Testing database connection...');
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, '/'));
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('Database content:', data);
      
      // Check if courses node exists
      if (data.courses) {
        console.log('Courses node exists with keys:', Object.keys(data.courses));
        // Log first course if exists
        const firstCourseKey = Object.keys(data.courses)[0];
        if (firstCourseKey) {
          console.log('First course data:', data.courses[firstCourseKey]);
        }
      } else {
        console.log('No courses node found in the database');
      }
      
      return { success: true, data };
    } else {
      console.log('No data available');
      return { success: false, error: 'No data available' };
    }
  } catch (error) {
    console.error('Database test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// Run the test when this file is imported
testDatabaseConnection().then(result => {
  console.log('Database test completed:', result.success ? '✅ Success' : '❌ Failed');
  if (!result.success) {
    console.error('Error details:', result.error);
  }
});
