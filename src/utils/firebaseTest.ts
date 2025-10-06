import { ref, get, child } from 'firebase/database';
import { database } from '../config/firebase';

export const testFirebaseConnection = async () => {
  try {
    console.log('🧪 Testing Firebase connection...');
    
    const dbRef = ref(database);
    
    // Test basic connection
    const snapshot = await get(child(dbRef, '/'));
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      console.log('✅ Firebase connection successful');
      console.log('📊 Available data keys:', Object.keys(data));
      
      // Check for courses
      const courseKeys = Object.keys(data).filter(key => !isNaN(Number(key)));
      console.log('📚 Found course keys:', courseKeys);
      
      if (courseKeys.length > 0) {
        console.log('📖 Sample course data:', data[courseKeys[0]]);
      }
      
      return {
        success: true,
        totalKeys: Object.keys(data).length,
        courseKeys: courseKeys.length,
        sampleData: courseKeys.length > 0 ? data[courseKeys[0]] : null
      };
    } else {
      console.log('⚠️ Firebase connected but no data found');
      return {
        success: true,
        totalKeys: 0,
        courseKeys: 0,
        sampleData: null
      };
    }
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Call this function to test the connection
if (typeof window !== 'undefined') {
  (window as any).testFirebase = testFirebaseConnection;
}