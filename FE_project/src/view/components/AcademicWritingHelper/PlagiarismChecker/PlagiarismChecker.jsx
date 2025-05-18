
import React, { useState, useEffect } from "react";
import "../styles/AdvancedTools.css";

const PlagiarismChecker = ({ content, onClose, onApplySuggestion }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [plagiarismResults, setPlagiarismResults] = useState({
    originalityScore: 0,
    similarityMatches: [],
    analysisComplete: false
  });
  const [highlightedContent, setHighlightedContent] = useState("");
  
  useEffect(() => {
    // Simulate API call to plagiarism checking service
    const timer = setTimeout(() => {
      // This is a mock plagiarism detection that would normally call an external API
      const detectPlagiarism = (text) => {
        // Get paragraphs
        const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
        
        // For demo purposes, we'll randomly flag some paragraphs as potentially plagiarized
        // In a real implementation, this would use NLP/ML models or external API
        const potentialMatches = [];
        
        let totalWords = 0;
        let flaggedWords = 0;
        
        paragraphs.forEach((paragraph, index) => {
          if (paragraph.trim().length === 0) return;
          
          const words = paragraph.split(/\s+/);
          totalWords += words.length;
          
          // Randomly decide if this paragraph should be flagged (for demo purposes)
          // In a real app this would be based on actual similarity detection
          if (paragraph.length > 40 && Math.random() < 0.3) {
            // Determine how many words to flag
            const flagWordCount = Math.floor(words.length * (Math.random() * 0.7 + 0.2));
            flaggedWords += flagWordCount;
            
            potentialMatches.push({
              id: index + 1,
              text: paragraph,
              similarityScore: Math.floor(Math.random() * 40 + 60), // 60-99%
              source: generateFakeSource(),
              matchLength: flagWordCount
            });
          }
        });
        
        // Calculate originality score (higher is better)
        const originalityScore = totalWords > 0 
          ? Math.max(0, Math.min(100, Math.floor(100 - (flaggedWords / totalWords * 100))))
          : 100;
        
        return {
          originalityScore,
          similarityMatches: potentialMatches,
          analysisComplete: true
        };
      };
      
      if (content.trim().length > 0) {
        const results = detectPlagiarism(content);
        setPlagiarismResults(results);
        highlightPlagiarism(results.similarityMatches);
      }
      
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [content]);
  
  // Generate fake academic sources for demo purposes
  const generateFakeSource = () => {
    const journals = [
      "כתב העת למדעי החברה",
      "עיונים בחינוך",
      "רבעון לכלכלה",
      "החינוך וסביבו",
      "מגמות"
    ];
    
    const authors = [
      "כהן, א.",
      "לוי, ש.",
      "גולדברג, מ.",
      "שפירא, י.",
      "אברהמי, ל.",
      "אופיר, ד."
    ];
    
    const years = [2018, 2019, 2020, 2021, 2022, 2023];
    
    const titles = [
      "התפתחויות במחקר האקדמי בישראל",
      "היבטים מתודולוגיים במחקר איכותני",
      "אתגרים בחינוך המודרני",
      "תהליכי למידה בעידן הדיגיטלי",
      "מערכות חינוך במאה ה-21"
    ];
    
    const selectedAuthor = authors[Math.floor(Math.random() * authors.length)];
    const selectedYear = years[Math.floor(Math.random() * years.length)];
    const selectedTitle = titles[Math.floor(Math.random() * titles.length)];
    const selectedJournal = journals[Math.floor(Math.random() * journals.length)];
    const volume = Math.floor(Math.random() * 20 + 1);
    const issue = Math.floor(Math.random() * 4 + 1);
    const pages = `${Math.floor(Math.random() * 100 + 1)}-${Math.floor(Math.random() * 100 + 101)}`;
    
    return {
      author: selectedAuthor,
      year: selectedYear,
      title: selectedTitle,
      journal: selectedJournal,
      volume,
      issue,
      pages
    };
  };
  
  // Highlight plagiarized content
  const highlightPlagiarism = (matches) => {
    if (matches.length === 0) {
      setHighlightedContent(content);
      return;
    }
    
    let highlightedText = content;
    
    // Highlight matched paragraphs
    // In a real implementation, this would highlight specifically the matched phrases
    matches.forEach(match => {
      if (highlightedText.includes(match.text)) {
        highlightedText = highlightedText.replace(
          match.text,
          `<span class="highlight-plagiarism" data-similarity="${match.similarityScore}%">${match.text}</span>`
        );
      }
    });
    
    setHighlightedContent(highlightedText);
  };
  
  // Generate recommendations based on results
  const getRecommendations = () => {
    if (plagiarismResults.originalityScore >= 90) {
      return [
        "הטקסט שלך מקורי ברובו, אין צורך בשינויים משמעותיים."
      ];
    } else if (plagiarismResults.originalityScore >= 75) {
      return [
        "שקול ניסוח מחדש של המקטעים המסומנים בצבע.",
        "ודא שציטוטים ישירים מסומנים כהלכה במרכאות ומאוזכרים באופן תקין.",
        "הוסף מקורות לטענות שאינן מקוריות."
      ];
    } else {
      return [
        "מומלץ לשכתב באופן משמעותי את המקטעים המסומנים.",
        "השתמש במילים שלך להסביר את הרעיונות.",
        "הקפד לצטט ולהפנות למקורות באופן מדויק.",
        "שקול להרחיב את הניתוח האישי שלך בנושא."
      ];
    }
  };
  
  // Get score color based on originality score
  const getScoreColor = () => {
    if (plagiarismResults.originalityScore >= 90) return "score-excellent";
    if (plagiarismResults.originalityScore >= 75) return "score-good";
    if (plagiarismResults.originalityScore >= 60) return "score-fair";
    return "score-poor";
  };
  
  // Handle fixing paragraph by paraphrasing suggestion
  const handleParaphrase = (match) => {
    // In a real implementation, this might call an AI service to generate a paraphrase
    // For demo, we'll just add a note to paraphrase
    const updatedContent = content.replace(
      match.text, 
      match.text + "\n[נדרש ניסוח מחדש] "
    );
    
    onApplySuggestion(updatedContent);
  };
  
  // Handle adding citation to flagged paragraph
  const handleAddCitation = (match) => {
    const { author, year } = match.source;
    
    // Add a citation marker at the end of the paragraph
    const updatedContent = content.replace(
      match.text, 
      `${match.text} (${author.split(',')[0]}, ${year})`
    );
    
    onApplySuggestion(updatedContent);
  };
  
  return (
    <div className="ai-tool-overlay">
      <div className="ai-tool-panel plagiarism-checker">
        <div className="ai-tool-header">
          <h2>
            <span role="img" aria-label="plagiarism">⚠️</span> בדיקת מקוריות
          </h2>
          <button className="ai-tool-close" onClick={onClose}>✕</button>
        </div>
      
        <div className="ai-tool-content">
          {isLoading ? (
            <div className="ai-tool-loading">
              <div className="spinner"></div>
              <p>בודק מקוריות טקסט...</p>
              <small>משווה לבסיסי מידע אקדמיים...</small>
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
                <p className="score-description">
                  {plagiarismResults.originalityScore >= 90
                    ? "מצוין! הטקסט שלך מקורי מאוד."
                    : plagiarismResults.originalityScore >= 75
                    ? "טוב. הטקסט שלך מקורי ברובו עם כמה התאמות נדרשות."
                    : plagiarismResults.originalityScore >= 60
                    ? "סביר. נדרשים מספר שינויים לשיפור המקוריות."
                    : "נמוך. נדרשת עבודה משמעותית לשיפור המקוריות."
                  }
                </p>
              </div>
              
              <div className="plagiarism-preview">
                <h3>תצוגה מקדימה</h3>
                <div 
                  className="content-preview plagiarism-highlight" 
                  dangerouslySetInnerHTML={{ __html: highlightedContent }}
                />
                <div className="preview-legend">
                  <div className="legend-item">
                    <span className="legend-color highlight-plagiarism"></span>
                    <span>תוכן דומה למקורות אחרים</span>
                  </div>
                </div>
              </div>
              
              {plagiarismResults.similarityMatches.length > 0 && (
                <div className="similarity-matches">
                  <h3>התאמות שנמצאו ({plagiarismResults.similarityMatches.length})</h3>
                  <ul className="matches-list">
                    {plagiarismResults.similarityMatches.map((match, index) => (
                      <li key={index} className="match-item">
                        <div className="match-header">
                          <strong>התאמה {match.id}</strong>
                          <span className={`similarity-score ${match.similarityScore > 80 ? "high-similarity" : "medium-similarity"}`}>
                            {match.similarityScore}% דמיון
                          </span>
                        </div>
                        
                        <div className="match-source">
                          <strong>מקור אפשרי:</strong> {match.source.author} ({match.source.year}). 
                          {match.source.title}. {match.source.journal}, {match.source.volume}({match.source.issue}), {match.source.pages}.
                        </div>
                        
                        <div className="match-actions">
                          <button 
                            className="paraphrase-button"
                            onClick={() => handleParaphrase(match)}
                          >
                            הצע ניסוח מחדש
                          </button>
                          <button 
                            className="add-citation-button"
                            onClick={() => handleAddCitation(match)}
                          >
                            הוסף ציטוט
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="recommendations">
                <h3>המלצות לשיפור</h3>
                <ul>
                  {getRecommendations().map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
              
              <div className="plagiarism-disclaimer">
                <p>
                  <strong>הערה:</strong> בדיקת המקוריות היא לצורך הדגמה בלבד ובמערכת אמיתית תתבסס על השוואה למאגרי מידע אקדמיים וחיפוש באינטרנט.
                </p>
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
                  הפק דוח מקוריות
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlagiarismChecker;