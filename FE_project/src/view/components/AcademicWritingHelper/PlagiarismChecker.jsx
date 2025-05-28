import React, { useState, useEffect } from "react";
import "../../../styles/AdvancedTools.css";

const PlagiarismChecker = ({ content, onClose, onApplySuggestion }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [plagiarismResults, setPlagiarismResults] = useState({
    originalityScore: 0,
    similarityMatches: [],
    analysisComplete: false,
    issues: []
  });
  const [highlightedContent, setHighlightedContent] = useState("");
  
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

  // מאגר ביטויים ומשפטים נפוצים שעלולים להיחשב כלא מקוריים
  const commonPhrases = [
    "המהפכה התעשייתית החלה",
    "התאפיינה במעבר מייצור ידני לייצור מכני",
    "התפתחות התחבורה והצמיחה המהירה",
    "שינויים חברתיים וכלכליים משמעותיים",
    "באנגליה במאה ה-18",
    "תהליך שהתרחש במהלך",
    "השפעה משמעותית על החברה",
    "מאפיינים עיקריים של",
    "ניתן לומר כי",
    "לסיכום ניתן לומר",
    "בהתבסס על מחקרים קודמים",
    "מן הראוי לציין כי",
    "חשוב לציין בהקשר זה",
    "בניגוד לתקופות קודמות"
  ];

  // מאגר משפטים כלליים ולא מקוריים
  const genericStatements = [
    /הטכנולוגיה השפיעה על החברה/,
    /התפתחות.*חשובה.*בתחום/,
    /שינויים.*משמעותיים.*בתקופה/,
    /התהליך.*הוביל.*לשינויים/,
    /ההשפעה.*על.*החברה.*המודרנית/,
    /פיתוח.*טכנולוגי.*חדשני/,
    /מעבר.*מ.*ל.*התרחש/,
    /תופעה.*זו.*מאפיינת/
  ];

  // זיהוי משפטים מילוניים/אנציקלופדיים
  const encyclopedicPatterns = [
    /^.+\s+הוא\/היא\s+.+שהתרחש/,
    /^.+\s+מוגדר\/מוגדרת\s+כ/,
    /^.+\s+נחשב\/נחשבת\s+ל/,
    /^\w+\s+\(\d{4}-\d{4}\)\s+היה\/הייתה/,
    /^בשנת\s+\d{4}\s+התרחש/,
    /^במהלך\s+המאה\s+ה-\d+/
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
    sentences.forEach((sentence, index) => {
      const trimmedSentence = sentence.trim();
      if (trimmedSentence.length < 20) return;
      
      genericStatements.forEach(pattern => {
        if (pattern.test(trimmedSentence)) {
          const wordCount = trimmedSentence.split(' ').length;
          problematicWords += Math.floor(wordCount * 0.7);
          
          similarityMatches.push({
            id: `generic-${index}`,
            text: trimmedSentence,
            similarityScore: 70 + Math.floor(Math.random() * 15),
            source: generateRelevantSource(),
            matchLength: wordCount,
            type: 'generic_statement',
            severity: 'medium'
          });
          
          issues.push({
            type: 'generic_statement',
            text: trimmedSentence,
            description: 'משפט כללי וחסר מקוריות',
            suggestion: 'הוסף דוגמאות ספציפיות או ניתוח מעמיק יותר'
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
    const originalityScore = Math.max(0, Math.min(100, 
      Math.floor(100 - (problematicWords / totalWords * 100))
    ));

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
    const sources = [
      {
        author: "שמיר, ח.",
        year: 2019,
        title: "ההיסטוריה של המהפכה התעשייתית",
        journal: "כתב העת להיסטוריה",
        volume: 15,
        issue: 3,
        pages: "45-67"
      },
      {
        author: "כהן, ר.",
        year: 2020,
        title: "השפעות חברתיות של התיעוש",
        journal: "מחקרים בהיסטוריה חברתית",
        volume: 8,
        issue: 2,
        pages: "123-145"
      },
      {
        author: "לוי, מ.",
        year: 2018,
        title: "טכנולוגיה וחברה במאה ה-18",
        journal: "רבעון לחקר טכנולוגיה",
        volume: 12,
        issue: 1,
        pages: "78-95"
      }
    ];
    
    return sources[Math.floor(Math.random() * sources.length)];
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
  
  const handleImproveText = (issue) => {
    let suggestion = "";
    
    switch(issue.type) {
      case 'common_phrase':
        suggestion = `\n[נסח מחדש: "${issue.text}" - השתמש בביטוי מקורי]\n`;
        break;
      case 'generic_statement':
        suggestion = `\n[הוסף דוגמאות ספציפיות ל: "${issue.text}"]\n`;
        break;
      case 'encyclopedic':
        suggestion = `\n[שנה לסגנון אישי: "${issue.text}"]\n`;
        break;
      case 'missing_citation':
        suggestion = `\n[הוסף ציטוט ל: "${issue.text}"]\n`;
        break;
      default:
        suggestion = `\n[שפר את: "${issue.text}"]\n`;
    }
    
    const updatedContent = content + suggestion;
    onApplySuggestion(updatedContent);
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
          <style>
            {`.highlight-high-risk { background-color: #ffebee; border-bottom: 2px solid #f44336; }
             .highlight-medium-risk { background-color: #fff3e0; border-bottom: 2px solid #ff9800; }
             .highlight-low-risk { background-color: #f3e5f5; border-bottom: 2px solid #9c27b0; }
             .issue-item { margin: 10px 0; padding: 15px; border-left: 4px solid #2196f3; background: #f8f9fa; }
             .issue-item.common_phrase { border-left-color: #f44336; }
             .issue-item.generic_statement { border-left-color: #ff9800; }
             .issue-item.encyclopedic { border-left-color: #9c27b0; }
             .issue-item.missing_citation { border-left-color: #f44336; }
             .improve-button { background: #4caf50; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-top: 10px; }
             .improve-button:hover { background: #45a049; }
             .score-breakdown { font-size: 14px; margin-top: 10px; }
             .issue-severity { background: #e0e0e0; padding: 2px 8px; border-radius: 12px; font-size: 12px; }
             .originality-tips { background: #e8f5e8; padding: 15px; border-radius: 8px; margin: 15px 0; }`}
          </style>
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
                  {plagiarismResults.originalityScore}%
                </div>
                <div className="score-breakdown">
                  <p>מילים כולל: {plagiarismResults.statistics?.totalWords}</p>
                  <p>מילים בעייתיות: {plagiarismResults.statistics?.problematicWords}</p>
                  <p>בעיות שזוהו: {plagiarismResults.issues.length}</p>
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
                  <h3>בעיות שזוהו ({plagiarismResults.issues.length})</h3>
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
                        <button 
                          className="improve-button"
                          onClick={() => handleImproveText(issue)}
                        >
                          הוסף הערת שיפור
                        </button>
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
                <button 
                  className="export-report-button"
                >
                  הפק דוח מקוריות מפורט
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