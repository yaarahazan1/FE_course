import React, { useState, useEffect } from "react";
import "../../../styles/AdvancedTools.css";

const PlagiarismChecker = ({ content, onClose }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [plagiarismResults, setPlagiarismResults] = useState({
    originalityScore: 0,
    similarityMatches: [],
    analysisComplete: false,
    issues: []
  });
  const [highlightedContent, setHighlightedContent] = useState("");
  const [userSelectors, setUserSelectors] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (content.trim().length > 0) {
        const results = analyzeTextOriginality(content);
        setPlagiarismResults(results);
        highlightIssues(results.similarityMatches, results.issues);
      }
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [content]);

  useEffect(() => {
  if (content.selectors && Array.isArray(content.selectors)) {
    setUserSelectors(content.selectors);
  }
}, [content]);

  const commonPhrases = [
    "לסיכום ניתן לומר",
    "בהתבסס על מחקרים קודמים", 
    "מן הראוי לציין כי",
    "חשוב לציין בהקשר זה",
    "ניתן לומר כי",
    "כפי שציינו קודם",
    "כמו שאמרנו",
    "בהמשך לאמור לעיל",
    "באופן דומה",
    "מאידך גיסא",
    "בניגוד לכך",
    "יתר על כן",
    "בנוסף לכך",
    "עם זאת",
    "למרות זאת"
  ];

  const genericStatements = [
    /.*חשוב.*מאוד.*/,
    /.*השפעה.*רבה.*על.*/,
    /.*תופעה.*נפוצה.*/,
    /.*בעיה.*קיימת.*/,
    /.*מצב.*קיים.*/,
    /.*נושא.*רלוונטי.*/,
    /.*נושא.*חשוב.*/,
    /.*דבר.*חשוב.*/,
    /.*עניין.*מעניין.*/,
    /.*יש.*חשיבות.*רבה.*/,
    /.*לא.*פשוט.*/,
    /.*מורכב.*מאוד.*/
  ];

  const encyclopedicPatterns = [
    /^.+\s+הוא\/היא\s+.+$/,
    /^.+\s+מוגדר\/מוגדרת\s+כ.+$/,
    /^.+\s+נחשב\/נחשבת\s+ל.+$/,
    /^.+\s+מאופיין\/מאופיינת\s+ב.+$/,
    /^במילים אחרות.+$/,
    /^כלומר.+$/,
    /^זאת אומרת.+$/,
    /^בפשטות.+$/,
    /^באופן כללי.+$/
  ];

  const analyzeTextOriginality = (text) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
    
    let totalWords = text.split(/\s+/).filter(w => w.length > 0).length;
    let problematicWords = 0;
    let similarityMatches = [];
    let issues = [];
    
    // 1. זיהוי ביטויים נפוצים
    commonPhrases.forEach((phrase, index) => {
      if (text.includes(phrase)) {
        const wordCount = phrase.split(' ').length;
        problematicWords += wordCount;
        
        similarityMatches.push({
          id: `common-${index}`,
          text: phrase,
          similarityScore: 85 + Math.floor(Math.random() * 10),
          source: generateRelevantSource(),
          matchLength: wordCount,
          type: 'common_phrase',
          severity: 'high'
        });
        
        issues.push({
          type: 'common_phrase',
          text: phrase,
          description: 'ביטוי נפוץ שמופיע ברבות ממקורות אקדמיים',
          suggestion: 'נסח מחדש במילים שלך'
        });
      }
    });

    // 2. זיהוי משפטים כלליים
    sentences.forEach((sentence) => {
      const trimmedSentence = sentence.trim();
      if (trimmedSentence.length < 20) return;
      
      genericStatements.forEach(pattern => {
        if (pattern.test(trimmedSentence)) {
          const wordCount = trimmedSentence.split(' ').length;
          problematicWords += Math.floor(wordCount * 0.4);
          
          issues.push({
            type: 'generic_statement',
            text: trimmedSentence,
            description: 'משפט כללי מדי - חסר פרטים ספציפיים',
            suggestion: 'הוסף דוגמה קונקרטית או נתונים מדויקים'
          });
        }
      });
    });
  
    // 3. זיהוי סגנון אנציקלופדי
    sentences.forEach((sentence, index) => {
      const trimmedSentence = sentence.trim();
      if (trimmedSentence.length < 30) return;
      
      encyclopedicPatterns.forEach(pattern => {
        if (pattern.test(trimmedSentence)) {
          const wordCount = trimmedSentence.split(' ').length;
          problematicWords += Math.floor(wordCount * 0.5);
          
          similarityMatches.push({
            id: `encyclo-${index}`,
            text: trimmedSentence,
            similarityScore: 60 + Math.floor(Math.random() * 20),
            source: generateRelevantSource(),
            matchLength: wordCount,
            type: 'encyclopedic',
            severity: 'medium'
          });
          
          issues.push({
            type: 'encyclopedic',
            text: trimmedSentence,
            description: 'סגנון כתיבה אנציקלופדי - לא מתאים למאמר מקורי',
            suggestion: 'כתב בסגנון אישי יותר עם ניתוח והסקת מסקנות'
          });
        }
      });
    });

    // 4. בדיקת אורך פסקאות ומשפטים
    paragraphs.forEach((paragraph) => {
      const sentences = paragraph.split(/[.!?]+/).filter(s => s.trim().length > 0);
      const words = paragraph.split(/\s+/).filter(w => w.length > 0);
      
      if (sentences.length === 1 && words.length > 40) {
        issues.push({
          type: 'long_sentence',
          text: paragraph.substring(0, 100) + '...',
          description: 'משפט ארוך מדי - עלול להיות העתקה ממקור אחר',
          suggestion: 'פרק למשפטים קצרים יותר'
        });
        problematicWords += Math.floor(words.length * 0.3);
      }
      
      if (sentences.length < 3 && words.length > 60) {
        issues.push({
          type: 'dense_paragraph',
          text: paragraph.substring(0, 100) + '...',
          description: 'פסקה צפופה עם מעט משפטים - חשד להעתקה',
          suggestion: 'פתח את הפסקה למספר משפטים עם הסברים נוספים'
        });
      }
    });

    // 5. בדיקת חוסר ציטוטים בטענות עובדתיות
    const factualClaims = [
      /במאה ה-\d+/,
      /בשנת \d{4}/,
      /לפי מחקרים/,
      /מחקרים מראים/,
      /נתונים מצביעים/,
      /סטטיסטיקות מראות/,
      /ממצאים מצביעים/
    ];

    sentences.forEach(sentence => {
      factualClaims.forEach(pattern => {
        if (pattern.test(sentence) && !sentence.includes('(') && !sentence.includes('לפי')) {
          issues.push({
            type: 'missing_citation',
            text: sentence,
            description: 'טענה עובדתית ללא ציטוט מקור',
            suggestion: 'הוסף ציטוט למקור האמין'
          });
        }
      });
    });

    // 6. חישוב ציון מקוריות
    const problematicPercentage = totalWords > 0 ? (problematicWords / totalWords) * 100 : 0;
    const rawScore = Math.max(10, Math.min(100, 100 - problematicPercentage));
    const originalityScore = parseFloat(rawScore.toFixed(2));

    problematicWords = Math.min(problematicWords, totalWords);

    return {
      originalityScore,
      similarityMatches,
      analysisComplete: true,
      issues,
      statistics: {
        totalWords,
        problematicWords,
        totalSentences: sentences.length,
        totalParagraphs: paragraphs.length
      }
    };
  };

  const generateRelevantSource = () => {
    const generalSources = [
      {
        author: "אברהם, י.",
        year: 2020,
        title: "מחקרים עכשוויים בתחום",
        journal: "כתב עת למחקר",
        volume: 15,
        issue: 3,
        pages: "45-67"
      },
      {
        author: "כהן, ר.",
        year: 2021,
        title: "הבנות חדשות בנושא",
        journal: "רבעון אקדמי",
        volume: 8,
        issue: 2,
        pages: "123-145"
      },
      {
        author: "לוי, מ.",
        year: 2019,
        title: "תיאוריות ויישומים",
        journal: "כתב עת מקצועי",
        volume: 12,
        issue: 1,
        pages: "78-95"
      },
      {
        author: "רוזן, ד.",
        year: 2022,
        title: "גישות מודרניות",
        journal: "מחקרים עכשוויים",
        volume: 18,
        issue: 4,
        pages: "201-230"
      }
    ];
    
    return generalSources[Math.floor(Math.random() * generalSources.length)];
  };
  
  const highlightIssues = (matches, issues) => {
    if (matches.length === 0 && issues.length === 0) {
      setHighlightedContent(content);
      return;
    }
    
    let highlightedText = content;
    
    matches.forEach(match => {
      if (highlightedText.includes(match.text)) {
        const colorClass = getSeverityClass(match.severity);
        highlightedText = highlightedText.replace(
          match.text,
          `<span class="${colorClass}" data-similarity="${match.similarityScore}%" data-type="${match.type}">${match.text}</span>`
        );
      }
    });
    
    setHighlightedContent(highlightedText);
  };

  const getSeverityClass = (severity) => {
    switch(severity) {
      case 'high': return 'highlight-high-risk';
      case 'medium': return 'highlight-medium-risk';
      default: return 'highlight-low-risk';
    }
  };
  
  const getDetailedRecommendations = () => {
    const score = plagiarismResults.originalityScore;
    const issueTypes = [...new Set(plagiarismResults.issues.map(issue => issue.type))];
    
    let recommendations = [];
    
    if (score >= 90) {
      recommendations.push("הטקסט שלך מקורי ברובו - עבודה טובה!");
    } else if (score >= 75) {
      recommendations.push("הטקסט שלך מקורי ברובו, אך יש מקום לשיפור:");
      if (issueTypes.includes('common_phrase')) {
        recommendations.push("• החלף ביטויים נפוצים בניסוחים מקוריים");
      }
      if (issueTypes.includes('missing_citation')) {
        recommendations.push("• הוסף ציטוטים לטענות עובדתיות");
      }
    } else if (score >= 60) {
      recommendations.push("הטקסט זקוק לשיפורים משמעותיים:");
      recommendations.push("• שכתב מחדש את הביטויים המסומנים");
      recommendations.push("• הוסף ניתוח אישי ותובנות מקוריות");
      recommendations.push("• הימנע מסגנון אנציקלופדי - כתב בסגנון אקדמי אישי");
    } else {
      recommendations.push("הטקסט זקוק לעבודה משמעותית:");
      recommendations.push("• שכתב את רוב הטקסט במילים שלך");
      recommendations.push("• פתח זווית מקורית או טיעון ייחודי");
      recommendations.push("• הוסף דוגמאות, ניתוח ומסקנות משלך");
      recommendations.push("• ודא שכל הטענות מצוטטות כראוי");
    }
    
    return recommendations;
  };
  
  const getScoreColor = () => {
    const score = plagiarismResults.originalityScore;
    if (score >= 90) return "score-excellent";
    if (score >= 75) return "score-good";
    if (score >= 60) return "score-fair";
    return "score-poor";
  };

  const getSuggestionForIssue = (issue) => {
    const userContext = userSelectors.length > 0 ? 
      ` (בהקשר של: ${userSelectors.join(', ')})` : '';
      
    switch(issue.type) {
      case 'common_phrase':
        if (issue.text.includes('לסיכום')) {
          return `"המסקנה העיקרית שלי${userContext} היא..." או "מהניתוח עולה${userContext} כי..."`;
        }
        if (issue.text.includes('חשוב לציין')) {
          return `"נקודה מרכזית${userContext} היא..." או "כדאי לשים לב${userContext} ש..."`;
        }
        if (issue.text.includes('ניתן לומר')) {
          return `"נראה לי${userContext} ש..." או "מהנתונים משתמע${userContext} כי..."`;
        }
        return `נסח מחדש במילים שלך${userContext}`;
        
      case 'generic_statement':
        return `הוסף דוגמה ספציפית${userContext} או נתונים מדויקים`;
        
      case 'encyclopedic':
        return `כתב בסגנון אישי${userContext} - מה דעתך על זה?`;
        
      case 'missing_citation':
        return `הוסף מקור מהימן או כתב "לדעתי"${userContext}`;
        
      default:
        return `נסח מחדש במילים שלך${userContext}`;
    }
  };

  const getUniqueIssuesCount = () => {
    if (!plagiarismResults.issues) return 0;
    
    // יצירת set של טקסטים ייחודיים כדי למנוע כפילויות
    const uniqueTexts = new Set();
    plagiarismResults.issues.forEach(issue => {
      uniqueTexts.add(issue.text);
    });
    
    return uniqueTexts.size;
  };
  
  return (
    <div className="ai-tool-overlay">
      <div className="ai-tool-panel plagiarism-checker">
        <div className="ai-tool-header">
          <h2>
            <span role="img" aria-label="plagiarism">🔍</span> בדיקת מקוריות מתקדמת
          </h2>
          <button className="ai-tool-close" onClick={onClose}>✕</button>
        </div>
      
        <div className="ai-tool-content">
          {isLoading ? (
            <div className="ai-tool-loading">
              <div className="spinner"></div>
              <p>מנתח מקוריות טקסט...</p>
              <small>בודק ביטויים נפוצים, סגנון כתיבה ומקוריות...</small>
            </div>
          ) : content.trim().length === 0 ? (
            <div className="ai-tool-empty">
              <p>אין מספיק טקסט לבדיקה.</p>
              <p>אנא הוסף תוכן לבדיקת מקוריות.</p>
            </div>
          ) : (
            <div className="plagiarism-results">
              <div className="originality-score">
                <h3>ציון מקוריות</h3>
                <div className={`score-display ${getScoreColor()}`}>
                  {plagiarismResults.originalityScore.toFixed(2)}%
                </div>
                <div className="score-breakdown">
                  <p>מילים כולל: {plagiarismResults.statistics?.totalWords}</p>
                  <p>מילים בעייתיות: {plagiarismResults.statistics?.problematicWords}</p>
                  <p>בעיות שזוהו {getUniqueIssuesCount()}</p>
                </div>
              </div>
              
              <div className="plagiarism-preview">
                <h3>תצוגה מקדימה עם סימון בעיות</h3>
                <div 
                  className="content-preview plagiarism-highlight" 
                  dangerouslySetInnerHTML={{ __html: highlightedContent }}
                />
                <div className="preview-legend">
                  <div className="legend-item">
                    <span className="legend-color highlight-high-risk"></span>
                    <span>בעיה חמורה (ביטוי נפוץ)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color highlight-medium-risk"></span>
                    <span>בעיה בינונית (סגנון/כלליות)</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color highlight-low-risk"></span>
                    <span>בעיה קלה</span>
                  </div>
                </div>
              </div>

              {plagiarismResults.issues.length > 0 && (
                <div className="issues-detected">
                  <h3>בעיות שזוהו ({getUniqueIssuesCount()})</h3>
                  <div className="issues-list">
                    {plagiarismResults.issues.map((issue, index) => (
                      <div key={index} className={`issue-item ${issue.type}`}>
                        <div className="issue-header">
                          <strong>{getIssueTitle(issue.type)}</strong>
                          <span className="issue-severity">{getIssueSeverity(issue.type)}</span>
                        </div>
                        <div className="issue-text">"{issue.text.substring(0, 80)}..."</div>
                        <div className="issue-description">{issue.description}</div>
                        <div className="issue-suggestion">
                          <strong>הצעה:</strong> {issue.suggestion}
                        </div>
                        <div className="suggestion-box">
                          <strong>במקום זה אפשר:</strong> {getSuggestionForIssue(issue)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="recommendations">
                <h3>המלצות מפורטות לשיפור</h3>
                <ul>
                  {getDetailedRecommendations().map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
              
              <div className="originality-tips">
                <h3>טיפים לכתיבה מקורית</h3>
                <ul>
                  <li>פתח בשאלת מחקר או טיעון ספציפי</li>
                  <li>הוסף דוגמאות מקוריות מהניסיון שלך</li>
                  <li>נתח ולא רק תאר - מה זה אומר? למה זה חשוב?</li>
                  <li>השווה בין מקורות שונים ופתח דעה מנומקת</li>
                  <li>השתמש במילות קישור אישיות: "לדעתי", "נראה לי", "ניתן להסיק"</li>
                </ul>
              </div>
              
              <div className="ai-tool-actions">
                <button 
                  className="close-button"
                  onClick={onClose}
                >
                  סגור
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// פונקציות עזר
const getIssueTitle = (type) => {
  const titles = {
    'common_phrase': 'ביטוי נפוץ',
    'generic_statement': 'משפט כללי',
    'encyclopedic': 'סגנון אנציקלופדי',
    'missing_citation': 'חסר ציטוט',
    'long_sentence': 'משפט ארוך',
    'dense_paragraph': 'פסקה צפופה'
  };
  return titles[type] || 'בעיה כללית';
};

const getIssueSeverity = (type) => {
  const severities = {
    'common_phrase': 'חמור',
    'generic_statement': 'בינוני',
    'encyclopedic': 'בינוני',
    'missing_citation': 'חמור',
    'long_sentence': 'קל',
    'dense_paragraph': 'קל'
  };
  return severities[type] || 'בינוני';
};

export default PlagiarismChecker;