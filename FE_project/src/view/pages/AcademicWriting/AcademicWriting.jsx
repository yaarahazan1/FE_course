import React, { useState, useEffect } from "react";
import "./AcademicWriting.css";
import SpellChecker from "../../components/AcademicWritingHelper/SpellChecker";
import CitationHelper from "../../components/AcademicWritingHelper/CitationHelper";
import PlagiarismChecker from "../../components/AcademicWritingHelper/PlagiarismChecker";
import StructureImprover from "../../components/AcademicWritingHelper/StructureImprover";
import { getDocumentStructureRequirements } from "../../utils/textAnalysis";

const AcademicWriting = () => {
  const [documentType, setDocumentType] = useState("מאמר אקדמי");
  const [documentStructure, setDocumentStructure] = useState("תבנית בסיסית"); // הוספת state חדש
  const [citationStyle, setCitationStyle] = useState("APA");
  const [content, setContent] = useState("");
  const [analysis, setAnalysis] = useState([]);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [activeAITool, setActiveAITool] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (content.trim().length > 0) {
        analyzeText(content);
      } else {
        setAnalysis([]);
      }

      setWordCount(content.trim() ? content.trim().split(/\s+/).length : 0);
    }, 1000);
    return () => clearTimeout(timer);
  }, [content, documentType, documentStructure, citationStyle]); 
  const analyzeText = (text) => {
    setIsAnalyzing(true);
    
    const newAnalysis = [];
    
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
    const sentenceAnalysis = analyzeSentenceStructure(text);
    if (sentenceAnalysis.hasIssues) {
      newAnalysis.push({
        type: "warning",
        title: sentenceAnalysis.title,
        description: sentenceAnalysis.description,
        icon: "⚠️"
      });
    }

    if (paragraphs.length > 1) {
      const paragraphAnalysis = analyzeParagraphBalance(paragraphs);
      if (paragraphAnalysis.isUnbalanced) {
        newAnalysis.push({
          type: "info",
          title: paragraphAnalysis.title,
          description: paragraphAnalysis.description,
          icon: "ℹ️"
        });
      }
    }
    
    const formalityAnalysis = analyzeTextFormality(text);
    if (formalityAnalysis.isInformal) {
      newAnalysis.push({
        type: "warning",
        title: formalityAnalysis.title,
        description: formalityAnalysis.description,
        icon: "⚠️"
      });
    }
    
    const claimAnalysis = analyzeClaimsAndEvidence(text);
    if (claimAnalysis.hasUnsupportedClaims) {
      newAnalysis.push({
        type: "suggestion",
        title: claimAnalysis.title,
        description: claimAnalysis.description,
        icon: "📚"
      });
    }
    
    const structureRequirements = getDocumentStructureRequirements(documentType, documentStructure); // העברת שני הפרמטרים
    const structureAnalysis = analyzeDocumentStructure(text, structureRequirements);
    if (structureAnalysis.hasMissingElements) {
      newAnalysis.push({
        type: "structure",
        title: structureAnalysis.title,
        description: structureAnalysis.description,
        icon: "🏗️"
      });
    }
    
    const citationAnalysis = analyzeCitations(text, citationStyle);
    if (citationAnalysis.hasIssues) {
      newAnalysis.push({
        type: "citation",
        title: citationAnalysis.title,
        description: citationAnalysis.description,
        icon: "📄"
      });
    }
    
    setAnalysis(newAnalysis.slice(0, 4));
    setIsAnalyzing(false);
  };

  const analyzeSentenceStructure = (text) => {
    const sentences = text.split(/[.!?]+/);
    const longSentences = sentences.filter(s => {
      const words = s.trim().split(/\s+/);
      return words.length > 20;
    });
    
    return {
      hasIssues: longSentences.length > 0,
      title: "מבנה משפטים",
      description: longSentences.length > 0 
        ? `נמצאו ${longSentences.length} משפטים ארוכים מדי. שקול לפצל אותם למשפטים קצרים יותר.`
        : ""
    };
  };

  const analyzeParagraphBalance = (paragraphs) => {
    if (paragraphs.length <= 1) return { isUnbalanced: false };
    
    const lengths = paragraphs.map(p => p.length);
    const avg = lengths.reduce((sum, len) => sum + len, 0) / lengths.length;
    const stdDev = Math.sqrt(
      lengths.reduce((sum, len) => sum + Math.pow(len - avg, 2), 0) / lengths.length
    );
    
    const outliers = lengths.filter(len => Math.abs(len - avg) > stdDev * 1.5).length;
    const isUnbalanced = outliers > Math.max(1, paragraphs.length * 0.2);
    
    return {
      isUnbalanced,
      title: "חוסר איזון באורכי פסקאות",
      description: isUnbalanced 
        ? "ישנן פסקאות שאורכן חורג משמעותית מהממוצע. שקול לאזן את אורך הפסקאות."
        : ""
    };
  };

  // Analyze text formality using NLP techniques
  const analyzeTextFormality = (text) => {
    // In a real implementation, this would use language models or NLP libraries
    // to detect informal language patterns
    
    // For demo purposes, we'll implement a simple detection 
    // that looks at common informal patterns in Hebrew and English
    const informalityIndicators = [
      /\bמדהים\b/i, /\bנהדר\b/i, /\bגרוע\b/i, /\bנורא\b/i, /\bסבבה\b/i, /\bבסדר\b/i,
      /\bdon't\b/i, /\bwon't\b/i, /\bcan't\b/i, /\bgonna\b/i, /\bwanna\b/i,
      /!!+/,
      /[\u{1F300}-\u{1F6FF}]/u
    ];
    
    let informalCount = 0;
    for (const pattern of informalityIndicators) {
      const matches = text.match(pattern);
      if (matches) informalCount += matches.length;
    }
    
    const wordCount = text.split(/\s+/).length;
    const normalizedThreshold = Math.max(1, Math.floor(wordCount / 100));
    
    return {
      isInformal: informalCount > normalizedThreshold,
      title: "שימוש בשפה לא אקדמית",
      description: informalCount > normalizedThreshold
        ? "זוהו ביטויים שאינם מתאימים לכתיבה אקדמית. שקול להחליף ביטויים אלו בשפה פורמלית יותר."
        : ""
    };
  };

  const analyzeClaimsAndEvidence = (text) => {
    
    const claimIndicators = [
      /אני טוען/i, /אני חושב/i, /לדעתי/i, /ניתן לומר ש/i, /ברור ש/i,
      /I believe/i, /I think/i, /in my opinion/i, /clearly/i, /obviously/i,
      /מוכיח ש/i, /מראה ש/i, /must be/i, /should be/i, /יש להניח/i
    ];
    
    let claimCount = 0;
    for (const pattern of claimIndicators) {
      const matches = text.match(pattern);
      if (matches) claimCount += matches.length;
    }
    
    const evidenceIndicators = [
      /\(\d{4}\)/,  
      /לפי /i, /על פי/i, /\(.*\d+.*\)/,  
      /מחקרים הראו/i, /studies show/i
    ];
    
    let evidenceCount = 0;
    for (const pattern of evidenceIndicators) {
      const matches = text.match(pattern);
      if (matches) evidenceCount += matches.length;
    }
    
    return {
      hasUnsupportedClaims: claimCount > 0 && claimCount > evidenceCount,
      title: "טענות הדורשות ביסוס",
      description: claimCount > 0 && claimCount > evidenceCount
        ? "זוהו טענות שעשויות להצריך ביסוס אקדמי. שקול להוסיף מקורות או אסמכתאות."
        : ""
    };
  };

  const analyzeDocumentStructure = (text, requirements) => {
    if (!requirements || !requirements.sections) {
      return { hasMissingElements: false };
    }
    
    const missingElements = [];
    
    for (const section of requirements.sections) {
      const sectionPattern = new RegExp(`\\b${section}\\b`, 'i');
      if (!sectionPattern.test(text)) {
        missingElements.push(section);
      }
    }
    
    return {
      hasMissingElements: missingElements.length > 0,
      title: "מבנה המסמך",
      description: missingElements.length > 0
        ? `מומלץ לכלול את החלקים הבאים ב${requirements.documentType}: ${missingElements.join(', ')}.`
        : ""
    };
  };

  const analyzeCitations = (text, style) => {
    const citationPatterns = {
      "APA": {
        inText: /\([^)]*\d{4}[^)]*\)/,
        reference: /^[A-Za-z].*\(\d{4}\)/m
      },
      "MLA": {
        inText: /\([^)]*\d+[^)]*\)/,
        reference: /^[A-Za-z].*\d+\./m
      },
      "Chicago": {
        inText: /\d+/,
        footnote: /^\d+\./m
      },
      "Harvard": {
        inText: /\([^)]*\d{4}[^)]*\)/,
        reference: /^[A-Za-z].*\(\d{4}\)/m
      },
      "IEEE": {
        inText: /\[\d+\]/,
        reference: /^\[\d+\]/m
      }
    };
    
    const pattern = citationPatterns[style];
    if (!pattern) return { hasIssues: false };
    
    const hasCitations = text.includes("(") || text.includes("[") || /\d+/.test(text);
    const hasCorrectFormat = pattern.inText.test(text);
    
    const hasIssues = hasCitations && !hasCorrectFormat;
    
    return {
      hasIssues,
      title: "בעיות בסגנון ציטוט",
      description: hasIssues
        ? `נראה שיש ציטוטים שאינם תואמים את סגנון ${style}. בדוק את מבנה הציטוטים.`
        : ""
    };
  };

  const handleActivateAITool = (toolName) => {
    setActiveAITool(toolName);
  };
  
  const handleCloseAITool = () => {
    setActiveAITool(null);
  };
  
  const handleApplyAIToolSuggestion = (updatedContent) => {
    setContent(updatedContent);
    handleCloseAITool();
  };

  const renderActiveTool = () => {
    const toolProps = {
      content,
      documentType,
      documentStructure, // הוספת פרמטר חדש
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

  // Provide a dynamic analysis of the document based on its characteristics
  const getAIAnalysisContent = () => {
    if (!content.trim().length) {
      return (
        <div className="empty-panel-message">
          <p>התחל לכתוב את המסמך שלך כדי לקבל ניתוח חכם</p>
        </div>
      );
    }
    
    // Get appropriate word count recommendation based on document type
    const wordCountRecommendation = getWordCountRecommendation(documentType, wordCount);
    
    return (
      <div>
        <div className="ai-panel-section">
          <h3>ניתוח כללי</h3>
          <p>{wordCountRecommendation}</p>
          <p>מבנה נבחר: {documentStructure}</p> {/* הצגת המבנה הנבחר */}
        </div>
        
        <div className="ai-panel-section">
          <h3>המלצות לשיפור</h3>
          <ul>
            {analysis.map((item, i) => (
              <li key={i}>
                <strong>{item.title}:</strong> {item.description}
              </li>
            ))}
            {analysis.length === 0 && (
              <li>לא זוהו בעיות כרגע. המשך לכתוב לקבלת המלצות נוספות.</li>
            )}
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
    );
  };

  // Helper function to get dynamic word count recommendations
  const getWordCountRecommendation = (docType, count) => {
    const recommendations = {
      "מאמר אקדמי": {
        min: 1500,
        max: 5000,
        message: "למאמר אקדמי מומלץ להגיע ל-1500 עד 5000 מילים, בהתאם לדרישות המדויקות."
      },
      "תזה / דיסרטציה": {
        min: 20000,
        max: 100000,
        message: "לתזה או דיסרטציה מומלץ להגיע לפחות ל-20,000 מילים, בהתאם לדרישות המחלקה והמנחה."
      },
      "עבודה סמינריונית": {
        min: 3000,
        max: 8000,
        message: "לעבודה סמינריונית מומלץ להגיע ל-3,000 עד 8,000 מילים, בהתאם לדרישות הקורס."
      },
      "מסמך מחקרי": {
        min: 2000,
        max: 10000,
        message: "למסמך מחקרי מומלץ להגיע ל-2,000 עד 10,000 מילים, בהתאם לסוג המחקר והיקפו."
      }
    };
    
    const rec = recommendations[docType] || { min: 1000, max: 5000, message: "" };
    
    let lengthAssessment;
    if (count < 100) {
      lengthAssessment = "קצר מאוד, שקול להרחיב";
    } else if (count < rec.min * 0.2) {
      lengthAssessment = "קצר מאוד ביחס לדרישות הצפויות";
    } else if (count < rec.min * 0.5) {
      lengthAssessment = "קצר ביחס לדרישות הצפויות";
    } else if (count < rec.min) {
      lengthAssessment = "מתקרב לאורך המינימלי המומלץ";
    } else if (count > rec.max * 1.5) {
      lengthAssessment = "ארוך מאוד, שקול לקצר";
    } else if (count > rec.max) {
      lengthAssessment = "ארוך מהמומלץ";
    } else {
      lengthAssessment = "באורך טוב";
    }
    
    return `הטקסט שלך (${count} מילים) ${lengthAssessment}. ${rec.message}`;
  };

  return (
    <div className="academic-writing-container">
      <section className="main-title">
        <h1>🖋️ כלי לכתיבה אקדמית</h1>
        <p>כתוב, ערוך וטקסט בצורה מקצועית בהתאם לכללי הכתיבה האקדמית המקובלים</p>
      </section>

      <section className="content-area">
        <aside className="sidebar">
          <div className="side-card">
            <h4>אפשרויות יצוא</h4>
            <label><input type="radio" name="export" /> PDF</label>
            <label><input type="radio" name="export" /> Word</label>
            <label><input type="radio" name="export" /> LaTeX</label>
            <button className="export-btn">יצוא מסמך</button>
          </div>
          <div className="side-card">
            <h4>שמירה בענן</h4>
            <label><input type="radio" name="cloud" /> Google Drive</label>
            <label><input type="radio" name="cloud" /> OneDrive</label>
            <button className="cloud-btn">שמירה בענן</button>
          </div>
          <div className="side-card">
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
              <select 
                value={documentStructure} 
                onChange={(e) => setDocumentStructure(e.target.value)}
              >
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
            
            {/* Dynamic content based on the current state */}
            {getAIAnalysisContent()}
          </div>
        </div>
      )}
      
      {/* Render active AI tool if one is selected */}
      {activeAITool && renderActiveTool()}
    </div>
  );
};

export default AcademicWriting;