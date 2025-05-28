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
        reference: /^[א-ת].*תש["׳][א-ת]|[א-ת].*\d{4}/gm
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
      'proposal': 'הצעת מחקר'
    };
    return typeNames[docType] || docType || 'לא צוין';
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      analyzeCitations();
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [content, documentSettings]);

  const analyzeCitations = () => {
    const issues = [];
    const suggestionsList = [];
    
    const selectedStyle = documentSettings?.citationStyle;
    const currentStyle = citationStyles[selectedStyle];
    
    const documentType = documentSettings?.documentType;
    const citationRequired = ['research-paper', 'thesis', 'academic-article', 'literature-review'].includes(documentType);
    
    const potentialClaims = findPotentialClaims(content);
    const existingCitations = findExistingCitations(content, currentStyle);
    
    const informalCitations = findInformalCitations(content);
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
    
    const styleSuggestions = generateStyleSuggestions(content, currentStyle, documentType);
    suggestionsList.push(...styleSuggestions);
    
    setCitationIssues(issues);
    setSuggestions(suggestionsList);
    
    let updatedContent = content;
    issues.forEach(issue => {
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
      /מצאו ש/g
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

  const findInformalCitations = (text) => {
    const issues = [];
    
    // Look for informal citation patterns like: כמו שאמר X: "quote"
    const informalPatterns = [
      {
        pattern: /כמו שאמר\s+[^:]+:\s*[""][^""]+[""]/g,
        type: 'informal-quote',
        description: 'ציטוט לא פורמלי - צריך להמיר לפורמט אקדמי'
      },
      {
        pattern: /לפי\s+[^,]+,\s*[""][^""]+[""]/g,
        type: 'informal-attribution',
        description: 'ייחוס לא פורמלי - חסר מידע על מקור'
      },
      {
        pattern: /אמר\s+[^:]+:\s*[""][^""]+[""]/g,
        type: 'direct-speech',
        description: 'ציטוט ישיר ללא מקור אקדמי'
      },
      {
        pattern: /[""][^""]+[""]\s*-\s*[^.!?]+/g,
        type: 'quote-with-dash',
        description: 'ציטוט עם קו מפריד - לא בפורמט אקדמי'
      }
    ];
    
    informalPatterns.forEach(patternObj => {
      const matches = [...text.matchAll(patternObj.pattern)];
      matches.forEach(match => {
        issues.push({
          type: patternObj.type,
          severity: 'high',
          originalText: match[0],
          description: patternObj.description,
          suggestion: `המר לפורמט אקדמי: ${getCurrentStyleExample()}`,
          correction: null // לא ניתן לתקן אוטומטית - צריך מידע נוסף
        });
      });
    });
    
    return issues;
  };

  const getCurrentStyleExample = () => {
    const selectedStyle = documentSettings?.citationStyle || 'APA';
    switch(selectedStyle) {
      case 'APA':
        return '(שם המחבר, שנה, עמ\' X) או שם המחבר (שנה) טוען ש"..."';
      case 'MLA':
        return '(שם המחבר X) או שם המחבר כותב ש"..." (X)';
      case 'Chicago':
        return 'הערת שוליים או שם המחבר כותב ש"..."¹';
      case 'Hebrew':
        return '(שם המחבר, תש"ג) או שם המחבר (תש"ג) כותב ש"..."';
      default:
        return 'פורמט ציטוט אקדמי מתאים';
    }
  };

  const findExistingCitations = (text, style) => {
    const citations = [];
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
          suggestion: `הוסף ציטוט בסוף המשפט: ${claim.text} (שם המחבר, שנה).`,
          correction: null
        });
      }
    });
    
    return issues;
  };

  const checkCitationFormat = (text, style) => {
    const issues = [];
    const citations = [...text.matchAll(style.patterns.inText)];
    
    citations.forEach(citation => {
      const citationText = citation[0];
      
      // Check for common formatting issues
      if (citationText.includes('ע״מ') || citationText.includes('עמ\'')) {
        issues.push({
          type: 'format-error',
          severity: 'medium',
          originalText: citationText,
          description: 'פורמט ציטוט לא תקין - השתמש בפורמט התקני',
          correction: citationText.replace(/ע״מ|עמ'/g, 'עמ\''),
          suggestion: `פורמט נכון לפי ${style.name}: ${style.requirements.inTextFormat}`
        });
      }
      
      // Check for missing year in APA style
      if (style.name.includes('APA') && !/\d{4}/.test(citationText)) {
        issues.push({
          type: 'missing-year',
          severity: 'high',
          originalText: citationText,
          description: 'חסרה שנת פרסום בציטוט',
          suggestion: 'הוסף שנת פרסום: (שם המחבר, 2023)',
          correction: null
        });
      }
    });
    
    return issues;
  };

  const checkBibliography = (text, citations, required) => {
    const hasBibliography = /ביבליוגרפיה|רשימת מקורות|מקורות|רשימת הפניות/.test(text);
    
    if (required && citations.length > 0 && !hasBibliography) {
      return {
        type: 'missing-bibliography',
        severity: 'high',
        description: 'חסרה רשימת מקורות בסוף המסמך',
        suggestion: 'הוסף רשימת מקורות מלאה בסוף המסמך',
        correction: null
      };
    }
    
    return null;
  };

  const generateStyleSuggestions = (text, style, docType) => {
    const suggestions = [];
    
    // Document type specific suggestions
    if (docType === 'thesis') {
      suggestions.push({
        type: 'style-recommendation',
        title: 'המלצה לעבודת גמר',
        description: `בעבודת גמר מומלץ להשתמש ב-${style.requirements.referenceFormat}`,
        action: 'בדוק עקביות הציטוטים לאורך העבודה'
      });
    }
    
    if (docType === 'research-paper') {
      suggestions.push({
        type: 'style-recommendation',
        title: 'המלצה למאמר מחקר',
        description: 'ודא שכל הטענות המחקריות מגובות בציטוטים מתאימים',
        action: 'בדוק שיש לפחות 10-15 מקורות במאמר מחקרי'
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
    
    // Apply only corrections that have actual correction text
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
                <p><strong>סגנון ציטוט נבחר:</strong> {citationStyles[documentSettings?.citationStyle || 'APA'].name}</p>
                <p><strong>סוג מסמך:</strong> {getDocumentTypeDisplayName(documentSettings?.documentType)}</p>
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
                                  <em>טקסט מקורי:</em> "{issue.originalText}"
                                </div>
                              )}
                              <div className="suggestion-text">
                                {issue.suggestion}
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
                    {['research-paper', 'thesis', 'academic-article', 'literature-review'].includes(documentSettings?.documentType)
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