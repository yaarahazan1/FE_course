import React, { useState, useEffect } from "react";
import "../styles/AdvancedTools.css";

const SpellChecker = ({ content, onClose, onApplySuggestion }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [spellErrors, setSpellErrors] = useState([]);
  const [correctedContent, setCorrectedContent] = useState(content);
  
  useEffect(() => {
    // Simulate API call to spell check service
    const timer = setTimeout(() => {
      const mockSpellCheck = () => {
        // Common spelling and grammar errors in Hebrew academic writing
        const commonErrors = [
          { 
            type: "spelling", 
            errorText: "אנליזה", 
            suggestion: "אנליזה", 
            correctedText: "אנליזה", 
            description: "בעברית תקנית: 'ניתוח'"
          },
          { 
            type: "spelling", 
            errorText: "קונספט", 
            suggestion: "קונספט", 
            correctedText: "קונספט", 
            description: "בעברית תקנית: 'רעיון' או 'מושג'"
          },
          { 
            type: "grammar", 
            errorText: "מחקרים שהוכיחו ש", 
            suggestion: "מחקרים שהוכיחו כי", 
            correctedText: "מחקרים שהוכיחו כי", 
            description: "בכתיבה אקדמית, עדיף להשתמש ב'כי' במקום 'ש'"
          },
          { 
            type: "grammar", 
            errorText: "בשביל", 
            suggestion: "לשם", 
            correctedText: "לשם", 
            description: "בכתיבה אקדמית, עדיף 'לשם', 'עבור', 'למען' במקום 'בשביל'"
          }
        ];
        
        // Find actual errors in the provided content
        const errors = commonErrors.filter(error => content.includes(error.errorText));
        
        // If no errors found from common list, generate generic suggestions
        if (errors.length === 0 && content.length > 20) {
          const words = content.split(/\s+/);
          const randomIndex = Math.floor(Math.random() * words.length);
          
          if (words[randomIndex] && words[randomIndex].length > 3) {
            errors.push({
              type: "suggestion",
              errorText: words[randomIndex],
              suggestion: words[randomIndex] + " [אפשרות שיפור]",
              correctedText: words[randomIndex] + " [אפשרות שיפור]",
              description: "שקול להשתמש במונח אקדמי יותר"
            });
          }
        }
        
        return errors;
      };
      
      const errors = mockSpellCheck();
      setSpellErrors(errors);
      setIsLoading(false);
      
      // Apply corrections to the content copy
      let updatedContent = content;
      errors.forEach(error => {
        // Only make changes if errorText is found in content
        if (updatedContent.includes(error.errorText)) {
          updatedContent = updatedContent.replace(
            new RegExp(error.errorText, 'g'), 
            `<span class="highlight">${error.suggestion}</span>`
          );
        }
      });
      
      setCorrectedContent(updatedContent);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [content]);
  
  const handleApplyAll = () => {
    let updatedContent = content;
    spellErrors.forEach(error => {
      updatedContent = updatedContent.replace(
        new RegExp(error.errorText, 'g'), 
        error.correctedText
      );
    });
    
    onApplySuggestion(updatedContent);
  };
  
  const handleApplySingle = (error) => {
    const updatedContent = content.replace(
      new RegExp(error.errorText, 'g'), 
      error.correctedText
    );
    
    onApplySuggestion(updatedContent);
  };
  
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
              {spellErrors.length > 0 ? (
                <div>
                  <div className="ai-tool-summary">
                    <p>נמצאו <strong>{spellErrors.length}</strong> שגיאות או הצעות שיפור בטקסט שלך.</p>
                  </div>
                  
                  <div className="ai-tool-preview">
                    <h3>תצוגה מקדימה של השינויים:</h3>
                    <div 
                      className="content-preview" 
                      dangerouslySetInnerHTML={{ __html: correctedContent }}
                    />
                  </div>
                  
                  <div className="ai-tool-suggestions">
                    <h3>שגיאות והצעות:</h3>
                    <ul className="suggestions-list">
                      {spellErrors.map((error, index) => (
                        <li key={index} className={`suggestion-item ${error.type}-item`}>
                          <div>
                            <strong>{error.errorText}</strong> → {error.suggestion}
                            <p>{error.description}</p>
                          </div>
                          <button 
                            className="apply-suggestion-button"
                            onClick={() => handleApplySingle(error)}
                          >
                            החל שינוי
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="ai-tool-actions">
                    <button 
                      className="apply-all-button"
                      onClick={handleApplyAll}
                    >
                      החל את כל השינויים
                    </button>
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