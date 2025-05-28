import React, { useState, useEffect } from "react";
import "../../../styles/AdvancedTools.css";

const CitationHelper = ({ content, onClose, onApplySuggestion, documentSettings }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [citationIssues, setCitationIssues] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [correctedContent, setCorrectedContent] = useState(content);
  
  // Citation styles configuration
  const citationStyles = {
    APA: {
      name: "APA (American Psychological Association)",
      patterns: {
        inText: /\([^)]*\d{4}[^)]*\)/g, // (Author, 2023)
        reference: /^[A-Za-zא-ת].*\(\d{4}\)/gm // Author (2023). Title
      },
      requirements: {
        inTextFormat: "(שם המחבר, שנה)",
        referenceFormat: "שם המחבר (שנה). כותרת המאמר. שם כתב העת, כרך(גיליון), עמודים."
      }
    },
    MLA: {
      name: "MLA (Modern Language Association)",
      patterns: {
        inText: /\([^)]*\d+\)/g, // (Author 123)
        reference: /^[A-Za-zא-ת].*\d{4}/gm
      },
      requirements: {
        inTextFormat: "(שם המחבר עמוד)",
        referenceFormat: "שם המחבר. \"כותרת המאמר.\" שם כתב העת, כרך.גיליון, שנה, עמודים."
      }
    },
    Chicago: {
      name: "Chicago/Turabian",
      patterns: {
        inText: /\d+/g, // Superscript numbers (simplified)
        reference: /^\d+\./gm // 1. Reference format
      },
      requirements: {
        inTextFormat: "מספר הערת שוליים עליון",
        referenceFormat: "מספר. שם המחבר, \"כותרת המאמר,\" שם כתב העת כרך, מס' גיליון (שנה): עמודים."
      }
    },
    Hebrew: {
      name: "תקן ישראלי לציטוט",
      patterns: {
        inText: /\([^)]*תש["׳][א-ת]|[א-ת]{4,}\s+\d{4}\)/g,
        reference: /^[א-ת].*תש["׳"][א-ת]|[א-ת].*\d{4}/gm
      },
      requirements: {
        inTextFormat: "(שם המחבר תש\"ג או שנה לועזית)",
        referenceFormat: "שם המחבר, כותרת הספר/המאמר, מקום הוצאה: הוצאה, תש\"ג או שנה לועזית."
      }
    }
  };

  const getDocumentTypeDisplayName = (docType) => {
    const typeNames = {
      'research-paper': 'מאמר מחקר',
      'thesis': 'עבודת גמר',
      'academic-article': 'מאמר אקדמי',
      'literature-review': 'סקירת ספרות',
      'essay': 'חיבור',
      'report': 'דוח',
      'proposal': 'הצעת מחקר',
      'מאמר אקדמי': 'מאמר אקדמי',
      'תזה / דיסרטציה': 'תזה / דיסרטציה',
      'עבודה סמינריונית': 'עבודה סמינריונית',
      'מסמך מחקרי': 'מסמך מחקרי'
    };
    return typeNames[docType] || docType || 'לא צוין';
  };

  const getDocumentStructureDisplayName = (docStructure) => {
    const structureNames = {
      'תבנית בסיסית': 'תבנית בסיסית',
      'תבנית מורחבת': 'תבנית מורחבת',
      'מבנה מחקר אמפירי': 'מבנה מחקר אמפירי',
      'מבנה סקירת ספרות': 'מבנה סקירת ספרות'
    };
    return structureNames[docStructure] || docStructure || 'לא צוין';
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      analyzeCitations();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [content, documentSettings]);

  // פונקציה חדשה להסרת כפילויות
  const deduplicateIssues = (issues) => {
    const seen = new Map();
    const uniqueIssues = [];
    
    issues.forEach(issue => {
      // יצירת מפתח ייחודי לכל בעיה על בסיס הטקסט המקורי, סוג הבעיה והתיאור
      const key = `${issue.originalText || ''}_${issue.type}_${issue.description}`;
      
      if (!seen.has(key)) {
        seen.set(key, true);
        uniqueIssues.push(issue);
      } else {
        // אם יש כפילות, נבחר את הבעיה עם החומרה הגבוהה יותר
        const existingIndex = uniqueIssues.findIndex(existing => 
          `${existing.originalText || ''}_${existing.type}_${existing.description}` === key
        );
        
        if (existingIndex !== -1) {
          const existing = uniqueIssues[existingIndex];
          const severityOrder = { 'high': 3, 'medium': 2, 'low': 1 };
          
          if (severityOrder[issue.severity] > severityOrder[existing.severity]) {
            uniqueIssues[existingIndex] = issue; // החלף בבעיה החמורה יותר
          }
        }
      }
    });
    
    return uniqueIssues;
  };

  const analyzeCitations = () => {
    const issues = [];
    const suggestionsList = [];
    
    const selectedStyle = documentSettings?.citationStyle || 'APA';
    const currentStyle = citationStyles[selectedStyle];
    
    const documentType = documentSettings?.documentType;
    const documentStructure = documentSettings?.documentStructure;
    const citationRequired = ['research-paper', 'thesis', 'academic-article', 'literature-review', 'מאמר אקדמי', 'תזה / דיסרטציה', 'עבודה סמינריונית', 'מסמך מחקרי'].includes(documentType);
    
    const potentialClaims = findPotentialClaims(content);
    const existingCitations = findExistingCitations(content, currentStyle);
    
    const informalCitations = findInformalCitations(content, selectedStyle);
    issues.push(...informalCitations);
    
    const formatIssues = checkCitationFormat(content, currentStyle);
    issues.push(...formatIssues);
    
    if (citationRequired) {
      const missingCitations = findMissingCitations(potentialClaims, existingCitations);
      issues.push(...missingCitations);
    }
    
    const bibliographyCheck = checkBibliography(content, existingCitations, citationRequired);
    if (bibliographyCheck) {
      issues.push(bibliographyCheck);
    }
    
    // הוספת דדפליקציה - הסרת כפילויות
    const uniqueIssues = deduplicateIssues(issues);
    
    const styleSuggestions = generateStyleSuggestions(content, currentStyle, documentType, documentStructure);
    suggestionsList.push(...styleSuggestions);
    
    setCitationIssues(uniqueIssues); // שימוש ברשימה המסוננת
    setSuggestions(suggestionsList);
    
    let updatedContent = content;
    uniqueIssues.forEach(issue => { // שימוש ברשימה המסוננת
      if (issue.correction && issue.originalText) {
        updatedContent = updatedContent.replace(
          issue.originalText,
          `<span class="highlight citation-highlight">${issue.correction}</span>`
        );
      }
    });
    
    setCorrectedContent(updatedContent);
    setIsLoading(false);
  };

  const findPotentialClaims = (text) => {
    const claimIndicators = [
      /מחקרים מראים/g,
      /עולה מהמחקר/g,
      /הוכח כי/g,
      /נמצא ש/g,
      /לפי המחקר/g,
      /מחקרים רבים/g,
      /נתונים מצביעים/g,
      /ממצאים מראים/g,
      /הראה כי/g,
      /מצאו ש/g,
      /מחקר מצא/g,
      /המחקר הראה/g,
      /על פי המחקר/g,
      /מחקרים מעידים/g
    ];
    
    const claims = [];
    claimIndicators.forEach(pattern => {
      const matches = [...text.matchAll(pattern)];
      matches.forEach(match => {
        const sentence = extractSentence(text, match.index);
        claims.push({
          text: sentence,
          position: match.index,
          indicator: match[0]
        });
      });
    });
    
    return claims;
  };

  const findInformalCitations = (text, selectedStyle) => {
    const issues = [];
    const processedPositions = new Set(); // מעקב אחר מיקומים שכבר עובדו
    
    // תבניות ציטוט לא פורמליות - עודכן לזיהוי טוב יותר
    const informalPatterns = [
      {
        pattern: /כמו שאמר\s+[^:]+:\s*["״"][^""״״]+["״"]/g,
        type: 'informal-quote',
        description: 'ציטוט לא פורמלי - דורש פורמט אקדמי עם שנה ועמוד'
      },
      {
        pattern: /לפי\s+[^,]+,\s*["״"][^""״״]+["״"]/g,
        type: 'informal-attribution',
        description: 'ייחוס לא פורמלי - חסרים פרטי מקור (שנה, עמוד)'
      },
      {
        // זה יתפוס את "משה אמר: שלום לכולם" עם גרשיים
        pattern: /[א-ת]+\s+אמר\s*:\s*["״"][^""״״]+["״"]/g,
        type: 'direct-speech',
        description: 'ציטוט ישיר ללא הפניה אקדמית - חסרים שנת פרסום ומספר עמוד'
      },
      {
        // גם ללא גרשיים - "משה אמר: שלום לכולם"
        pattern: /[א-ת]+\s+אמר\s*:\s*[^.!?""״״\n]+/g,
        type: 'direct-speech-no-quotes',
        description: 'ציטוט ישיר ללא הפניה אקדמית - דורש פורמט מלא עם שנה ועמוד'
      },
      {
        pattern: /["״"][^""״״]+["״"]\s*-\s*[^.!?]+/g,
        type: 'quote-with-dash',
        description: 'ציטוט עם קו מפריד - לא בפורמט אקדמי תקני'
      },
      {
        pattern: /(?:לדברי|לפי דברי|לדעת)\s+[א-ת\s]+(?:,|\s)["״"][^""״״]+["״"]/g,
        type: 'opinion-quote',
        description: 'ציטוט דעה ללא הפניה מלאה - נדרש מקור אקדמי'
      },
      {
        // תוספת: זיהוי "X טוען", "Y סבור" וכדומה
        pattern: /[א-ת]+\s+(?:טוען|סבור|מאמין|חושב)\s*[:]*\s*["״"][^""״״]+["״"]/g,
        type: 'claim-without-source',
        description: 'טענה או דעה ללא מקור אקדמי - נדרש ציטוט'
      }
    ];
    
    informalPatterns.forEach(patternObj => {
      const matches = [...text.matchAll(patternObj.pattern)];
      matches.forEach(match => {
        const position = match.index;
        const endPosition = position + match[0].length;
        
        // בדוק אם המיקום הזה כבר עובד
        let isOverlapping = false;
        for (let pos of processedPositions) {
          if ((position >= pos.start && position <= pos.end) || 
              (endPosition >= pos.start && endPosition <= pos.end)) {
            isOverlapping = true;
            break;
          }
        }
        
        if (!isOverlapping) {
          processedPositions.add({ start: position, end: endPosition });
          issues.push({
            type: patternObj.type,
            severity: 'high',
            originalText: match[0],
            description: patternObj.description,
            suggestion: `המר לפורמט ${selectedStyle}: ${getCurrentStyleExample(selectedStyle)}`,
            correction: null, // לא ניתן לתקן אוטומטית - צריך מידע נוסף
            position: position // הוספת מידע על המיקום
          });
        }
      });
    });
    
    return issues;
  };

  const getCurrentStyleExample = (selectedStyle = 'APA') => {
    switch(selectedStyle) {
      case 'APA':
        return 'לפי משה (2023), "שלום לכולם" (עמ\' 15) או (משה, 2023, עמ\' 15)';
      case 'MLA':
        return 'משה כותב: "שלום לכולם" (15) או "שלום לכולם" (משה 15)';
      case 'Chicago':
        return 'כפי שכתב משה: "שלום לכולם"¹ (הערת שוליים)';
      case 'Hebrew':
        return 'לפי משה (תש"ג): "שלום לכולם" (עמ\' 15)';
      default:
        return 'פורמט ציטוט אקדמי עם שנה ועמוד';
    }
  };

  const findExistingCitations = (text, style) => {
    const citations = [];
    if (!style || !style.patterns) return citations;
    
    const matches = [...text.matchAll(style.patterns.inText)];
    
    matches.forEach(match => {
      citations.push({
        text: match[0],
        position: match.index,
        style: style.name
      });
    });
    
    return citations;
  };

  const findMissingCitations = (claims, citations) => {
    const issues = [];
    
    claims.forEach(claim => {
      const hasCitationNearby = citations.some(citation => 
        Math.abs(citation.position - claim.position) < 200 // Within 200 characters
      );
      
      if (!hasCitationNearby) {
        issues.push({
          type: 'missing-citation',
          severity: 'high',
          originalText: claim.text,
          description: `הטענה "${claim.indicator}" דורשת ציטוט מקור`,
          suggestion: `הוסף ציטוט בסוף המשפט לפי ${documentSettings?.citationStyle || 'APA'}`,
          correction: null
        });
      }
    });
    
    return issues;
  };

  const checkCitationFormat = (text, style) => {
    const issues = [];
    if (!style || !style.patterns) return issues;
    
    const citations = [...text.matchAll(style.patterns.inText)];
    
    citations.forEach(citation => {
      const citationText = citation[0];
      
      // בדיקת בעיות פורמט נפוצות
      if (citationText.includes('ע״מ') || citationText.includes('עמ\'')) {
        issues.push({
          type: 'format-error',
          severity: 'medium',
          originalText: citationText,
          description: 'פורמט עמוד לא תקין',
          correction: citationText.replace(/ע״מ|עמ'/g, 'עמ\''),
          suggestion: `פורמט נכון: ${style.requirements.inTextFormat}`
        });
      }
      
      // בדיקת חוסר שנה בסגנון APA
      if (style.name.includes('APA') && !/\d{4}/.test(citationText)) {
        issues.push({
          type: 'missing-year',
          severity: 'high',
          originalText: citationText,
          description: 'חסרה שנת פרסום בציטוט APA',
          suggestion: 'הוסף שנת פרסום: (שם המחבר, 2023)',
          correction: null
        });
      }

      // בדיקת ציטוטים ללא מחבר
      if (/^\(\s*\d{4}\s*\)/.test(citationText)) {
        issues.push({
          type: 'missing-author',
          severity: 'high',
          originalText: citationText,
          description: 'ציטוט ללא שם מחבר',
          suggestion: 'הוסף שם המחבר: (שם המחבר, 2023)',
          correction: null
        });
      }
    });
    
    return issues;
  };

  const checkBibliography = (text, citations, required) => {
    const hasBibliography = /ביבליוגרפיה|רשימת מקורות|מקורות|רשימת הפניות|References|Bibliography/i.test(text);
    
    if (required && citations.length > 0 && !hasBibliography) {
      return {
        type: 'missing-bibliography',
        severity: 'high',
        description: 'חסרה רשימת מקורות בסוף המסמך',
        suggestion: 'הוסף רשימת מקורות מלאה בסוף המסמך לפי הסגנון הנבחר',
        correction: null
      };
    }
    
    if (required && citations.length === 0) {
      return {
        type: 'no-citations',
        severity: 'high',
        description: 'מסמך אקדמי ללא ציטוטים כלל',
        suggestion: 'הוסף ציטוטים מתאימים לתמיכה בטענות במסמך',
        correction: null
      };
    }
    
    return null;
  };

  const generateStyleSuggestions = (text, style, docType, docStructure) => {
    const suggestions = [];
    
    // המלצות לפי סוג מסמך
    if (docType === 'thesis' || docType === 'תזה / דיסרטציה') {
      suggestions.push({
        type: 'style-recommendation',
        title: 'המלצה לעבודת גמר',
        description: 'ודא עקביות ציטוטים לאורך העבודה ושימוש במינימום 20-30 מקורות',
        action: 'בדוק שכל פרק מכיל ציטוטים רלוונטיים'
      });
    }
    
    if (docType === 'research-paper' || docType === 'מסמך מחקרי' || docType === 'מאמר אקדמי') {
      suggestions.push({
        type: 'style-recommendation',
        title: 'המלצה למאמר מחקר',
        description: 'כל הטענות המחקריות חייבות להיות מגובות בציטוטים',
        action: 'ודא מינימום 10-15 מקורות עדכניים (5 שנים אחרונות)'
      });
    }

    // המלצות לפי מבנה מסמך
    if (docStructure === 'מבנה מחקר אמפירי') {
      suggestions.push({
        type: 'structure-recommendation',
        title: 'המלצה למחקר אמפירי',
        description: 'ודא ציטוטים בכל חלק: רקע תיאורטי, שיטה, ממצאים ודיון',
        action: 'בדוק שכל פרק מכיל ציטוטים מתאימים לתוכן'
      });
    }

    if (docStructure === 'מבנה סקירת ספרות') {
      suggestions.push({
        type: 'structure-recommendation',
        title: 'המלצה לסקירת ספרות',
        description: 'נדרש מספר גבוה של מקורות עדכניים ומגוונים',
        action: 'כלול 30-50 מקורות, 70% עדכניים (5 שנים אחרונות)'
      });
    }

    // המלצות כלליות
    const citationCount = (text.match(/\([^)]*\d{4}[^)]*\)/g) || []).length;
    const wordCount = text.split(/\s+/).length;
    const citationRatio = citationCount / (wordCount / 100); // citations per 100 words

    if (citationRatio < 1 && ['research-paper', 'thesis', 'academic-article', 'מאמר אקדמי', 'תזה / דיסרטציה'].includes(docType)) {
      suggestions.push({
        type: 'citation-density',
        title: 'צפיפות ציטוטים נמוכה',
        description: 'מומלץ על ציטוט אחד לכל 100-150 מילים במסמך אקדמי',
        action: 'הוסף ציטוטים נוספים לתמיכה בטענות'
      });
    }
    
    return suggestions;
  };

  const extractSentence = (text, position) => {
    const before = text.lastIndexOf('.', position);
    const after = text.indexOf('.', position);
    
    const start = before === -1 ? 0 : before + 1;
    const end = after === -1 ? text.length : after + 1;
    
    return text.slice(start, end).trim();
  };

  const handleApplyAll = () => {
    let updatedContent = content;
    
    // החל רק תיקונים שיש להם טקסט תיקון ממשי
    citationIssues.forEach(issue => {
      if (issue.correction && issue.originalText) {
        updatedContent = updatedContent.replace(
          new RegExp(escapeRegExp(issue.originalText), 'g'),
          issue.correction
        );
      }
    });
    
    onApplySuggestion(updatedContent);
  };

  const handleApplySingle = (issue) => {
    if (!issue.correction || !issue.originalText) return;
    
    const updatedContent = content.replace(
      new RegExp(escapeRegExp(issue.originalText), 'g'),
      issue.correction
    );
    
    onApplySuggestion(updatedContent);
  };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#e74c3c';
      case 'medium': return '#f39c12';
      case 'low': return '#3498db';
      default: return '#95a5a6';
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'high': return 'דחוף';
      case 'medium': return 'בינוני';
      case 'low': return 'נמוך';
      default: return '';
    }
  };

  return (
    <div className="ai-tool-overlay">
      <div className="ai-tool-panel">
        <div className="ai-tool-header">
          <h2>
            <span role="img" aria-label="citation">📚</span> מסייע ציטוט אקדמי
          </h2>
          <button className="ai-tool-close" onClick={onClose}>✕</button>
        </div>
      
        <div className="ai-tool-content">
          {isLoading ? (
            <div className="ai-tool-loading">
              <div className="spinner"></div>
              <p>מנתח ציטוטים ומקורות...</p>
            </div>
          ) : (
            <>
              <div className="citation-settings-info">
                <p><strong>סגנון ציטוט:</strong> {citationStyles[documentSettings?.citationStyle || 'APA'].name}</p>
                <p><strong>סוג מסמך:</strong> {getDocumentTypeDisplayName(documentSettings?.documentType)}</p>
                <p><strong>מבנה מסמך:</strong> {getDocumentStructureDisplayName(documentSettings?.documentStructure)}</p>
              </div>

              {citationIssues.length > 0 || suggestions.length > 0 ? (
                <div>
                  <div className="ai-tool-summary">
                    <p>
                      נמצאו <strong>{citationIssues.length}</strong> בעיות ציטוט ו-
                      <strong>{suggestions.length}</strong> הצעות שיפור.
                    </p>
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
                  
                  {citationIssues.length > 0 && (
                    <div className="ai-tool-suggestions">
                      <h3>בעיות ציטוט שנמצאו:</h3>
                      <ul className="suggestions-list">
                        {citationIssues.map((issue, index) => (
                          <li key={index} className={`suggestion-item ${issue.type}-item`}>
                            <div className="citation-issue">
                              <div className="issue-header">
                                <span 
                                  className="severity-badge"
                                  style={{ backgroundColor: getSeverityColor(issue.severity) }}
                                >
                                  {getSeverityText(issue.severity)}
                                </span>
                                <strong>{issue.description}</strong>
                              </div>
                              {issue.originalText && (
                                <div className="original-text">
                                  <em>טקסט בעייתי:</em> "{issue.originalText}"
                                </div>
                              )}
                              <div className="suggestion-text">
                                <strong>פתרון:</strong> {issue.suggestion}
                              </div>
                            </div>
                            {issue.correction && (
                              <button 
                                className="apply-suggestion-button"
                                onClick={() => handleApplySingle(issue)}
                              >
                                החל תיקון
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {suggestions.length > 0 && (
                    <div className="ai-tool-suggestions">
                      <h3>המלצות כלליות:</h3>
                      <ul className="suggestions-list">
                        {suggestions.map((suggestion, index) => (
                          <li key={index} className="suggestion-item recommendation-item">
                            <div>
                              <strong>{suggestion.title}</strong>
                              <p>{suggestion.description}</p>
                              {suggestion.action && (
                                <em>פעולה מומלצת: {suggestion.action}</em>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="ai-tool-actions">
                    {citationIssues.some(issue => issue.correction) && (
                      <button 
                        className="apply-all-button"
                        onClick={handleApplyAll}
                      >
                        החל את כל התיקונים
                      </button>
                    )}
                    <button 
                      className="cancel-button"
                      onClick={onClose}
                    >
                      סגור
                    </button>
                  </div>
                </div>
              ) : (
                <div className="ai-tool-empty">
                  <p>מצוין! לא נמצאו בעיות ציטוט 🎉</p>
                  <p>
                    {['research-paper', 'thesis', 'academic-article', 'literature-review', 'מאמר אקדמי', 'תזה / דיסרטציה', 'עבודה סמינריונית', 'מסמך מחקרי'].includes(documentSettings?.documentType)
                      ? 'הציטוטים במסמך נראים תקינים ועקביים עם הסגנון הנבחר.'
                      : 'לסוג המסמך הנוכחי, רמת הציטוט מתאימה.'
                    }
                  </p>
                  <div className="citation-info">
                    <h4>זכור:</h4>
                    <ul>
                      <li>כל טענה מחקרית צריכה להיות מגובה במקור</li>
                      <li>שמור על עקביות בסגנון הציטוט</li>
                      <li>ודא שרשימת המקורות מלאה ומעודכנת</li>
                    </ul>
                  </div>
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

export default CitationHelper;