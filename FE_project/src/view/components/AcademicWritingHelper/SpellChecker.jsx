import React, { useState, useEffect } from "react";
import "../../../styles/AdvancedTools.css";

const SpellChecker = ({ content, onClose, onApplySuggestion }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [spellErrors, setSpellErrors] = useState([]);
  const [correctedContent, setCorrectedContent] = useState(content);
  
  useEffect(() => {
    const performSpellCheck = () => {
      const errors = [];
      
      // 1. בדיקת רווחים אחרי "ש"
      const spacingRules = [
        { pattern: /ש\s+יש\b/g, suggestion: 'שיש', type: 'spacing', description: 'רווח מיותר אחרי "ש"' },
        { pattern: /ש\s+נוכל\b/g, suggestion: 'שנוכל', type: 'spacing', description: 'רווח מיותר אחרי "ש"' },
        { pattern: /ש\s+הוכיחו/g, suggestion: 'שהוכיחו', type: 'spacing', description: 'רווח מיותר אחרי "ש"' },
        { pattern: /ש\s+קיים/g, suggestion: 'שקיים', type: 'spacing', description: 'רווח מיותר אחרי "ש"' },
        // דפוס כללי לכל מקרה של ש + רווח + מילה עברית
        { 
          // eslint-disable-next-line no-misleading-character-class
          pattern: /ש\s+([\u05D0-\u05EA][\u05D0-\u05EA\u05B0-\u05BD\u05BF\u05C1-\u05C5]*)/g, 
          suggestion: (match, p1) => 'ש' + p1, 
          type: 'spacing', 
          description: 'רווח מיותר אחרי "ש"' 
        }
      ];

      // 2. בדיקת חזרות
      const checkForRepetitions = () => {
        const repetitionErrors = [];
        
        // בדיקה ישירה לחזרות ספציפיות
        const directRepetitions = [
          { pattern: /לכן\s+לכן/g, suggestion: 'לכן', description: 'מילת קישור כפולה' },
          { pattern: /יותר\s+יותר/g, suggestion: 'יותר', description: 'מילה כפולה' },
          { pattern: /נותנת כלים\s+נותנת כלים/g, suggestion: 'נותנת כלים', description: 'ביטוי חוזר' },
          { pattern: /כמו כן\s+כמו כן/g, suggestion: 'כמו כן', description: 'ביטוי כפול' },
          { pattern: /טוב יותר\s+טוב יותר/g, suggestion: 'טוב יותר', description: 'ביטוי כפול' },
          { pattern: /מקיפה יותר\s+יותר/g, suggestion: 'מקיפה יותר', description: 'חזרה מיותרת של "יותר"' }
        ];
        
        directRepetitions.forEach(rule => {
          let match;
          while ((match = rule.pattern.exec(content)) !== null) {
            repetitionErrors.push({
              type: 'repetition',
              errorText: match[0],
              suggestion: rule.suggestion,
              correctedText: rule.suggestion,
              description: rule.description,
              position: match.index
            });
          }
          rule.pattern.lastIndex = 0;
        });
        
        // בדיקה כללית לחזרות מילים (3+ אותיות)
        const generalWordRepetition = /\b(\S{3,})\s+\1\b/g;
        let match;
        while ((match = generalWordRepetition.exec(content)) !== null) {
          // רק אם זה לא כבר נתפס בחזרות הספציפיות
          if (!repetitionErrors.some(e => e.errorText === match[0])) {
            repetitionErrors.push({
              type: 'repetition',
              errorText: match[0],
              suggestion: match[1],
              correctedText: match[1],
              description: 'מילה חוזרת - כנראה שגגה',
              position: match.index
            });
          }
        }
        
        return repetitionErrors;
      };

      // 3. מילים זרות והחלפותיהן העבריות
      const foreignWordReplacements = [
        { pattern: /\bאנליזה\b/g, suggestion: 'ניתוח', type: 'terminology', description: 'המקביל העברי ל"אנליזה" הוא "ניתוח"' },
        { pattern: /\bהאנליזה\b/g, suggestion: 'הניתוח', type: 'terminology', description: 'המקביל העברי ל"אנליזה" הוא "ניתוח"' },
        { pattern: /\bקונספט\b/g, suggestion: 'מושג', type: 'terminology', description: 'המקביל העברי ל"קונספט" הוא "מושג"' },
        { pattern: /\bהקונספט\b/g, suggestion: 'המושג', type: 'terminology', description: 'המקביל העברי ל"קונספט" הוא "מושג"' },
        { pattern: /\bפקטורים\b/g, suggestion: 'גורמים', type: 'terminology', description: 'המקביל העברי ל"פקטורים" הוא "גורמים"' },
        { pattern: /\bהפקטורים\b/g, suggestion: 'הגורמים', type: 'terminology', description: 'המקביל העברי ל"פקטורים" הוא "גורמים"' },
        { pattern: /\bמתודה\b/g, suggestion: 'שיטה', type: 'terminology', description: 'המקביל העברי ל"מתודה" הוא "שיטה"' },
        { pattern: /\bהמתודה\b/g, suggestion: 'השיטה', type: 'terminology', description: 'המקביל העברי ל"מתודה" הוא "שיטה"' },
        { pattern: /\bפרוצס\b/g, suggestion: 'תהליך', type: 'terminology', description: 'המקביל העברי ל"פרוצס" הוא "תהליך"' },
        { pattern: /\bהפרוצס\b/g, suggestion: 'התהליך', type: 'terminology', description: 'המקביל העברי ל"פרוצס" הוא "תהליך"' },
        { pattern: /\bסטטוס\b/g, suggestion: 'מעמד', type: 'terminology', description: 'המקביל העברי ל"סטטוס" הוא "מעמד"' },
        { pattern: /\bהסטטוס\b/g, suggestion: 'המעמד', type: 'terminology', description: 'המקביל העברי ל"סטטוס" הוא "מעמד"' }
      ];

      // 4. כללי דקדוק וסגנון
      const grammarRules = [
        { pattern: /\bבשביל השגת\b/g, suggestion: 'להשגת', type: 'style', description: 'בכתיבה אקדמית עדיף "להשגת"' },
        { pattern: /\bהסיבה שבגללה\b/g, suggestion: 'הסיבה לכך היא ש', type: 'grammar', description: 'ביטוי לא תקין - עדיף "הסיבה לכך היא ש"' },
        { pattern: /\bעל מנת ש\s+נוכל\b/g, suggestion: 'כדי שנוכל', type: 'grammar', description: 'עדיף "כדי שנוכל"' },
        { pattern: /\bולפיכך לכן\b/g, suggestion: 'ולפיכך', type: 'grammar', description: 'כפילות מיותרת - "ולפיכך" כבר מבטא סיבתיות' },
        { pattern: /\bבצורה מקיפה יותר יותר\b/g, suggestion: 'בצורה מקיפה יותר', type: 'grammar', description: 'חזרה מיותרת של "יותר"' }
      ];

      // 5. אותיות סופיות (בדיקה פשוטה יותר)
      const finalLetterRules = [
        { pattern: /\bמ\s/g, suggestion: 'ם ', type: 'spelling', description: 'מ בסוף מילה צריכה להיות ם' },
        { pattern: /\bנ\s/g, suggestion: 'ן ', type: 'spelling', description: 'נ בסוף מילה צריכה להיות ן' },
        { pattern: /\bכ\s/g, suggestion: 'ך ', type: 'spelling', description: 'כ בסוף מילה צריכה להיות ך' },
        { pattern: /\bפ\s/g, suggestion: 'ף ', type: 'spelling', description: 'פ בסוף מילה צריכה להיות ף' },
        { pattern: /\bצ\s/g, suggestion: 'ץ ', type: 'spelling', description: 'צ בסוף מילה צריכה להיות ץ' }
      ];

      // החלת כל הכללים
      const allRules = [
        ...spacingRules,
        ...foreignWordReplacements,
        ...grammarRules,
        ...finalLetterRules
      ];

      allRules.forEach(rule => {
        let match;
        const regex = new RegExp(rule.pattern.source, rule.pattern.flags);
        
        while ((match = regex.exec(content)) !== null) {
          const errorText = match[0];
          let suggestion;
          
          if (typeof rule.suggestion === 'function') {
            suggestion = rule.suggestion(match, match[1], match[2]);
          } else {
            suggestion = rule.suggestion;
          }
          
          if (errorText !== suggestion && suggestion.trim() !== '') {
            errors.push({
              type: rule.type,
              errorText: errorText,
              suggestion: suggestion,
              correctedText: suggestion,
              description: rule.description,
              position: match.index
            });
          }
        }
      });

      // הוספת שגיאות חזרות
      const repetitionErrors = checkForRepetitions();
      errors.push(...repetitionErrors);

      // בדיקת משפטים ארוכים
      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
      sentences.forEach((sentence) => {
        const wordCount = sentence.trim().split(/\s+/).length;
        if (wordCount > 40) {
          errors.push({
            type: 'style',
            errorText: sentence.trim().substring(0, 50) + '...',
            suggestion: 'שקול לפרק למשפטים קצרים יותר',
            correctedText: sentence.trim(),
            description: `משפט ארוך מדי (${wordCount} מילים) - שקול לפרק לכמה משפטים`,
            position: content.indexOf(sentence.trim())
          });
        }
      });

      // הסרת כפילויות
      const uniqueErrors = errors.filter((error, index, self) => 
        index === self.findIndex((e) => 
          e.errorText === error.errorText && 
          e.type === error.type && 
          e.description === error.description
        )
      );

      return uniqueErrors.sort((a, b) => (a.position || 0) - (b.position || 0));
    };
    
    // Simulate API delay for realistic UX
    const timer = setTimeout(() => {
      const errors = performSpellCheck();
      setSpellErrors(errors);
      setIsLoading(false);
      
      // Apply corrections to the content copy for preview
      let updatedContent = content;
      errors.forEach(error => {
        if (updatedContent.includes(error.errorText) && 
            error.type !== 'style' && 
            error.errorText !== error.suggestion) {
          updatedContent = updatedContent.replace(
            new RegExp(escapeRegExp(error.errorText), 'g'), 
            `<span class="highlight">${error.suggestion}</span>`
          );
        }
      });
      
      setCorrectedContent(updatedContent);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [content]);
  
  // Helper function to escape regex special characters
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };
  
  const handleApplyAll = () => {
    let updatedContent = content;
    spellErrors.forEach(error => {
      if (error.errorText !== error.correctedText) {
        updatedContent = updatedContent.replace(
          new RegExp(escapeRegExp(error.errorText), 'g'), 
          error.correctedText
        );
      }
    });
    
    onApplySuggestion(updatedContent);
  };
  
  const handleApplySingle = (error) => {
    if (error.errorText === error.correctedText) return; // No actual change needed
    
    const updatedContent = content.replace(
      new RegExp(escapeRegExp(error.errorText), 'g'), 
      error.correctedText
    );
    
    onApplySuggestion(updatedContent);
  };
  
  // Filter out errors that don't actually make changes
  const actualErrors = spellErrors.filter(error => 
    error.errorText !== error.correctedText || error.type === 'style'
  );
  
  return (
    <div className="ai-tool-overlay">
      <div className="ai-tool-panel">
        <div className="ai-tool-header">
          <h2>
            <span role="img" aria-label="spell check">🔍</span> בדיקת איות ודקדוק
          </h2>
          <button className="ai-tool-close" onClick={onClose}>✕</button>
        </div>
      
        <div className="ai-tool-content">
          {isLoading ? (
            <div className="ai-tool-loading">
              <div className="spinner"></div>
              <p>מנתח את הטקסט...</p>
            </div>
          ) : (
            <>
              {actualErrors.length > 0 ? (
                <div>
                  <div className="ai-tool-summary">
                    <p>נמצאו <strong>{actualErrors.length}</strong> שגיאות או הצעות שיפור בטקסט שלך.</p>
                  </div>
                  
                  {correctedContent !== content && (
                    <div className="ai-tool-preview">
                      <h3>תצוגה מקדימה של השינויים:</h3>
                      <div 
                        className="content-preview" 
                        dangerouslySetInnerHTML={{ __html: correctedContent }}
                      />
                    </div>
                  )}
                  
                  <div className="ai-tool-suggestions">
                    <h3>שגיאות והצעות:</h3>
                    <ul className="suggestions-list">
                      {actualErrors.map((error, index) => (
                        <li key={index} className={`suggestion-item ${error.type}-item`}>
                          <div>
                            <strong>{error.errorText}</strong> 
                            {error.errorText !== error.suggestion && (
                              <> → {error.suggestion}</>
                            )}
                            <p>{error.description}</p>
                          </div>
                          {error.errorText !== error.correctedText && (
                            <button 
                              className="apply-suggestion-button"
                              onClick={() => handleApplySingle(error)}
                            >
                              החל שינוי
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="ai-tool-actions">
                    {spellErrors.some(error => error.errorText !== error.correctedText) && (
                      <button 
                        className="apply-all-button"
                        onClick={handleApplyAll}
                      >
                        החל את כל השינויים
                      </button>
                    )}
                    <button 
                      className="cancel-button"
                      onClick={onClose}
                    >
                      בטל
                    </button>
                  </div>
                </div>
              ) : (
                <div className="ai-tool-empty">
                  <p>לא נמצאו שגיאות בטקסט שלך! 🎉</p>
                  <p>הטקסט נראה תקין מבחינת דקדוק ואיות.</p>
                  <button 
                    className="cancel-button"
                    onClick={onClose}
                  >
                    סגור
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpellChecker;