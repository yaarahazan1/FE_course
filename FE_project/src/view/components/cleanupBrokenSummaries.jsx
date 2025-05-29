import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from '../../firebase/config';

const cleanupBrokenSummaries = async () => {
  try {
    console.log('מתחיל בדיקת סיכומים...');
    
    // קבלת כל הסיכומים מ-Firestore
    const summariesRef = collection(db, "summaries");
    const querySnapshot = await getDocs(summariesRef);
    
    const brokenSummaries = [];
    const workingSummaries = [];
    
    // בדיקה של כל סיכום
    for (const summaryDoc of querySnapshot.docs) {
      const summaryData = summaryDoc.data();
      const fileUrl = summaryData.fileUrl;
      
      if (!fileUrl) {
        console.log(`סיכום ללא URL: ${summaryData.title || summaryDoc.id}`);
        brokenSummaries.push({ id: summaryDoc.id, data: summaryData, reason: 'No URL' });
        continue;
      }
      
      try {
        // בדיקה אם הקובץ קיים ב-Cloudinary
        const response = await fetch(fileUrl, { method: 'HEAD' });
        
        if (response.ok) {
          workingSummaries.push(summaryDoc.id);
          console.log(`✅ סיכום תקין: ${summaryData.title}`);
        } else {
          brokenSummaries.push({ 
            id: summaryDoc.id, 
            data: summaryData, 
            reason: `HTTP ${response.status}`,
            url: fileUrl 
          });
          console.log(`❌ סיכום שבור: ${summaryData.title} (${response.status})`);
        }
      } catch (error) {
        brokenSummaries.push({ 
          id: summaryDoc.id, 
          data: summaryData, 
          reason: error.message,
          url: fileUrl 
        });
        console.log(`❌ שגיאה בבדיקת סיכום: ${summaryData.title} - ${error.message}`);
      }
      
      // המתנה קצרה כדי לא להעמיס על השרת
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('\n=== סיכום התוצאות ===');
    console.log(`סיכומים תקינים: ${workingSummaries.length}`);
    console.log(`סיכומים שבורים: ${brokenSummaries.length}`);
    
    if (brokenSummaries.length > 0) {
      console.log('\n=== סיכומים שבורים ===');
      brokenSummaries.forEach(item => {
        console.log(`- ${item.data.title || 'ללא כותרת'} (${item.reason})`);
        console.log(`  ID: ${item.id}`);
        console.log(`  URL: ${item.url || 'N/A'}`);
        console.log('---');
      });
      
      // שאלה למשתמש אם למחוק
      const shouldDelete = confirm(
        `נמצאו ${brokenSummaries.length} סיכומים שבורים.\n` +
        'האם תרצה למחוק אותם מהמסד נתונים?\n\n' +
        'זה יסיר רק את הרשומות ב-Firestore, לא את הקבצים ב-Cloudinary.'
      );
      
      if (shouldDelete) {
        console.log('\nמוחק סיכומים שבורים...');
        
        for (const brokenSummary of brokenSummaries) {
          try {
            await deleteDoc(doc(db, "summaries", brokenSummary.id));
            console.log(`✅ נמחק: ${brokenSummary.data.title || brokenSummary.id}`);
          } catch (error) {
            console.error(`❌ שגיאה במחיקת ${brokenSummary.id}:`, error);
          }
        }
        
        console.log(`\n🎉 הושלם! נמחקו ${brokenSummaries.length} סיכומים שבורים.`);
      } else {
        console.log('\nמחיקה בוטלה על ידי המשתמש.');
      }
    } else {
      console.log('\n🎉 כל הסיכומים תקינים!');
    }
    
  } catch (error) {
    console.error('שגיאה כללית:', error);
  }
};

// הפעלה
// cleanupBrokenSummaries();

export default cleanupBrokenSummaries;