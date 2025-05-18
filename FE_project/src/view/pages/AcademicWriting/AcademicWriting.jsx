import React, { useState, useEffect } from "react";
import "./AcademicWriting.css";
import SpellChecker from "./components/SpellChecker";
import CitationHelper from "./components/CitationHelper";
import PlagiarismChecker from "./components/PlagiarismChecker";
import StructureImprover from "./components/StructureImprover";

const AcademicWriting = () => {
  const [documentType, setDocumentType] = useState("מאמר אקדמי");
  const [citationStyle, setCitationStyle] = useState("APA");
  const [content, setContent] = useState("");
  const [analysis, setAnalysis] = useState([]);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [activeAITool, setActiveAITool] = useState(null);

  // Analyze text whenever content changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (content.trim().length > 0) {
        analyzeText(content);
      } else {
        setAnalysis([]);
      }
      
      // Update word count
      setWordCount(content.trim() ? content.trim().split(/\s+/).length : 0);
    }, 1000);

    return () => clearTimeout(timer);
  }, [content, documentType, citationStyle]);

  // AI analysis function - in a real app, this would call an AI service
  const analyzeText = (text) => {
    setIsAnalyzing(true);
    
    // Reset previous analysis
    const newAnalysis = [];
    
    // Get the paragraphs
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
    
    // Check for long sentences
    const longSentences = text.split(/[.!?]+/).filter(s => {
      const words = s.trim().split(/\s+/);
      return words.length > 20;
    });
    
    if (longSentences.length > 0) {
      newAnalysis.push({
        type: "warning",
        title: "משפטים ארוכים מדי",
        description: `נמצאו ${longSentences.length} משפטים ארוכים מדי. שקול לפצל אותם למשפטים קצרים יותר.`,
        icon: "⚠️"
      });
    }
    
    // Check paragraph length balance
    if (paragraphs.length > 1) {
      const avgLength = paragraphs.reduce((sum, p) => sum + p.length, 0) / paragraphs.length;
      const unbalanced = paragraphs.some(p => p.length < avgLength * 0.5 || p.length > avgLength * 2);
      
      if (unbalanced) {
        newAnalysis.push({
          type: "info",
          title: "חוסר איזון באורכי פסקאות",
          description: "ישנן פסקאות קצרות או ארוכות מדי ביחס לממוצע. שקול לאזן את אורך הפסקאות.",
          icon: "ℹ️"
        });
      }
    }
    
    // Check for non-academic language
    const nonAcademicWords = ["מדהים", "נהדר", "גרוע", "נורא", "סבבה", "בסדר"];
    const foundNonAcademic = nonAcademicWords.some(word => text.includes(word));
    
    if (foundNonAcademic) {
      newAnalysis.push({
        type: "warning",
        title: "שימוש בשפה לא אקדמית",
        description: "זוהו מילים שאינן מתאימות לכתיבה אקדמית. שקול להחליף ביטויים אלו בשפה פורמלית יותר.",
        icon: "⚠️"
      });
    }
    
    // Check for claims that might need backing
    const claimPhrases = ["אני טוען", "אני חושב", "לדעתי", "ניתן לומר ש", "ברור ש"];
    let claimFound = false;
    
    for (const phrase of claimPhrases) {
      if (text.includes(phrase)) {
        claimFound = true;
        break;
      }
    }
    
    if (claimFound) {
      newAnalysis.push({
        type: "suggestion",
        title: "טענות הדורשות ביסוס",
        description: "זוהו טענות שעשויות להצריך ביסוס אקדמי. שקול להוסיף מקורות או אסמכתאות.",
        icon: "📚"
      });
    }
    
    // Document type specific checks
    if (documentType === "מאמר אקדמי" && !text.toLowerCase().includes("מבוא") && !text.toLowerCase().includes("סיכום")) {
      newAnalysis.push({
        type: "structure",
        title: "מבנה המסמך",
        description: "במאמר אקדמי מומלץ לכלול חלקי מבוא וסיכום ברורים.",
        icon: "🏗️"
      });
    }
    
    // Citation style checks
    if (text.includes("(") && citationStyle === "APA") {
      const apaPattern = /\([^)]*\d{4}[^)]*\)/;
      const hasCitation = apaPattern.test(text);
      
      if (!hasCitation) {
        newAnalysis.push({
          type: "citation",
          title: "בעיות בסגנון ציטוט",
          description: `נראה שיש ציטוטים שאינם תואמים את סגנון ${citationStyle}. בדוק את מבנה הציטוטים.`,
          icon: "📄"
        });
      }
    }
    
    // Make sure we don't overwhelm with too many suggestions at once
    setAnalysis(newAnalysis.slice(0, 4));
    setIsAnalyzing(false);
  };

  const handleApplySuggestion = (suggestion) => {
    // Here we would implement specific logic for each suggestion type
    // For now, we'll just acknowledge the action
    alert(`יישום הצעה: ${suggestion.title}`);
  };

  // Handler for activating AI tools
  const handleActivateAITool = (toolName) => {
    setActiveAITool(toolName);
  };
  
  // Handler for closing active AI tool
  const handleCloseAITool = () => {
    setActiveAITool(null);
  };
  
  // Function to apply AI tool suggestions to content
  const handleApplyAIToolSuggestion = (updatedContent) => {
    setContent(updatedContent);
    handleCloseAITool();
  };

  // Render the appropriate AI tool component
  const renderActiveTool = () => {
    const toolProps = {
      content,
      documentType,
      citationStyle,
      onClose: handleCloseAITool,
      onApplySuggestion: handleApplyAIToolSuggestion
    };

    switch (activeAITool) {
      case "spellCheck":
        return <SpellChecker {...toolProps} />;
      case "citations":
        return <CitationHelper {...toolProps} />;
      case "plagiarism":
        return <PlagiarismChecker {...toolProps} />;
      case "structure":
        return <StructureImprover {...toolProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="academic-writing-container">
      <section className="main-title">
        <h1>🖋️ כלי לכתיבה אקדמית</h1>
        <p>כתוב, ערוך וטקסט בצורה מקצועית בהתאם לכללי הכתיבה האקדמית המקובלים</p>
      </section>

      <section className="content-area">
        <aside className="sidebar">
          <div className="card">
            <h4>אפשרויות יצוא</h4>
            <label><input type="radio" name="export" /> PDF</label>
            <label><input type="radio" name="export" /> Word</label>
            <label><input type="radio" name="export" /> LaTeX</label>
            <button className="export-btn">יצוא מסמך</button>
          </div>

          <div className="card">
            <h4>שמירה בענן</h4>
            <label><input type="radio" name="cloud" /> Google Drive</label>
            <label><input type="radio" name="cloud" /> OneDrive</label>
            <button className="cloud-btn">שמירה בענן</button>
          </div>

          <div className="card">
            <h4>שיתוף</h4>
            <button className="share-btn">שיתוף למרצה וחברים</button>
          </div>
          
          <button 
            className="ai-help-btn" 
            onClick={() => setShowAIPanel(!showAIPanel)}
          >
            <span role="img" aria-label="AI">🤖</span>
            עזרה חכמה
          </button>
        </aside>

        <main className="writing-panel">
          <div className="selectors">
            <div>
              <label>סוג המסמך</label>
              <select 
                value={documentType} 
                onChange={(e) => setDocumentType(e.target.value)}
              >
                <option>מאמר אקדמי</option>
                <option>תזה / דיסרטציה</option>
                <option>עבודה סמינריונית</option>
                <option>מסמך מחקרי</option>
              </select>
            </div>
            <div>
              <label>מבנה מסמך</label>
              <select>
                <option>תבנית בסיסית</option>
                <option>תבנית מורחבת</option>
                <option>מבנה מחקר אמפירי</option>
                <option>מבנה סקירת ספרות</option>
              </select>
            </div>
            <div>
              <label>סגנון ציטוט</label>
              <select 
                value={citationStyle} 
                onChange={(e) => setCitationStyle(e.target.value)}
              >
                <option>APA</option>
                <option>MLA</option>
                <option>Chicago</option>
                <option>Harvard</option>
                <option>IEEE</option>
              </select>
            </div>
          </div>

          <textarea
            className="text-editor"
            placeholder="התחל לכתוב את המסמך שלך כאן..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="word-count">
            <span>מילים: {wordCount}</span>
            {isAnalyzing && <span>מנתח טקסט...</span>}
          </div>
        </main>
      </section>

      {/* Smart Analysis Panel - Only shows if there's content */}
      {content.trim().length > 0 && analysis.length > 0 && (
        <section className="auto-detect-section">
          <div className="auto-detect-section-title">
            זיהוי אוטומטי {isAnalyzing && "(מנתח...)"}
          </div>
          
          {analysis.map((item, index) => (
            <div 
              key={index}
              className={`detect-item ${item.type}-item`}
            >
              <div>
                <div className="detect-item-icon">{item.icon}</div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
              <button 
                className="detect-item-button"
                onClick={() => handleApplySuggestion(item)}
              >
                יישם הצעה
              </button>
            </div>
          ))}
        </section>
      )}
      
      {/* AI Help Panel */}
      {showAIPanel && (
        <div className="ai-panel-overlay">
          <div className="ai-panel">
            <div className="ai-panel-header">
              <h2 className="ai-panel-title">
                <span role="img" aria-label="AI">🤖</span> ניתוח חכם
              </h2>
              <button 
                className="ai-panel-close"
                onClick={() => setShowAIPanel(false)}
              >
                ✕
              </button>
            </div>
            
            {content.trim().length > 0 ? (
              <div>
                <div className="ai-panel-section">
                  <h3>ניתוח כללי</h3>
                  <p>
                    הטקסט שלך ({wordCount} מילים) הוא{" "}
                    {wordCount < 100 ? "קצר מאוד, שקול להרחיב" : 
                     wordCount < 300 ? "בינוני באורכו" : "באורך טוב"}.
                    {documentType === "מאמר אקדמי" && 
                      " למאמר אקדמי מומלץ להגיע ל-1500 עד 5000 מילים, בהתאם לדרישות המדויקות."}
                    {documentType === "תזה / דיסרטציה" && 
                      " לתזה או דיסרטציה מומלץ להגיע לפחות ל-20,000 מילים, בהתאם לדרישות המחלקה והמנחה."}
                  </p>
                </div>
                
                <div className="ai-panel-section">
                  <h3>המלצות לשיפור</h3>
                  <ul>
                    {analysis.map((item, i) => (
                      <li key={i}>
                        <strong>{item.title}:</strong> {item.description}
                      </li>
                    ))}
                    <li>
                      <strong>ציטוטים והפניות:</strong> בסגנון {citationStyle}, וודא שכל טענה מגובה במקור אקדמי מתאים.
                    </li>
                    <li>
                      <strong>מבנה מסמך:</strong> במסמך מסוג {documentType} יש להקפיד על {documentType === "מאמר אקדמי" ? "מבוא, גוף המאמר וסיכום" : "פרקים מובנים בהתאם לדרישות המחקר"}.
                    </li>
                  </ul>
                </div>
                
                <div className="ai-panel-section">
                  <h3>כלים מתקדמים</h3>
                  <div className="ai-tools-grid">
                    <button 
                      className="ai-tool-button"
                      onClick={() => handleActivateAITool("spellCheck")}
                    >
                      <span role="img" aria-label="spell check">🔍</span>
                      בדיקת איות ודקדוק
                    </button>
                    <button 
                      className="ai-tool-button"
                      onClick={() => handleActivateAITool("citations")}
                    >
                      <span role="img" aria-label="citations">📚</span>
                      עזרה בציטוטים
                    </button>
                    <button 
                      className="ai-tool-button"
                      onClick={() => handleActivateAITool("plagiarism")}
                    >
                      <span role="img" aria-label="plagiarism">⚠️</span>
                      בדיקת מקוריות
                    </button>
                    <button 
                      className="ai-tool-button"
                      onClick={() => handleActivateAITool("structure")}
                    >
                      <span role="img" aria-label="structure">🏗️</span>
                      שיפור מבנה
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-panel-message">
                <p>התחל לכתוב את המסמך שלך כדי לקבל ניתוח חכם</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Render active AI tool if one is selected */}
      {activeAITool && renderActiveTool()}
    </div>
  );
};

export default AcademicWriting;
