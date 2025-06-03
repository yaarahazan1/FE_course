import React, { useState, useEffect } from "react";
import "../../../styles/AdvancedTools.css";

const StructureImprover = ({ content, documentType, onClose, onApplySuggestion }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [structureAnalysis, setStructureAnalysis] = useState(null);
  const [activeTab, setActiveTab] = useState("analysis");

  useEffect(() => {
    // Simulate API call to structure analysis service
    const timer = setTimeout(() => {
      const analyzeStructure = (text, docType) => {
        // Get paragraphs
        const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);
        
        // Structure template based on document type
        const templateStructure = getTemplateStructure(docType);
        
        // Analyze current document structure
        const currentStructure = getCurrentStructure(paragraphs);
        
        // Identify missing components in structure
        const missingComponents = identifyMissingComponents(currentStructure, templateStructure);
        
        // Generate suggestions for improvement
        const suggestions = generateSuggestions(currentStructure, templateStructure, missingComponents);
        
        // Apply improvements to content
        const improved = applyImprovements(text, currentStructure, suggestions);
        
        // Return analysis
        return {
          paragraphCount: paragraphs.length,
          currentStructure,
          missingComponents,
          suggestions,
          improved
        };
      };
      
      if (content.trim().length > 0) {
        const analysis = analyzeStructure(content, documentType);
        setStructureAnalysis(analysis);
      }
      
      setIsLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [content, documentType]);
  
  // Get template structure based on document type
  const getTemplateStructure = (docType) => {
    switch (docType) {
      case "מאמר אקדמי":
        return [
          { name: "כותרת", status: "required", description: "כותרת המאמר המתארת את נושא המחקר" },
          { name: "תקציר", status: "required", description: "סיכום קצר של עיקרי המאמר" },
          { name: "מבוא", status: "required", description: "הצגת הנושא, רקע, שאלות המחקר" },
          { name: "סקירת ספרות", status: "required", description: "סקירה של המחקר האקדמי הקיים בתחום" },
          { name: "מתודולוגיה", status: "required", description: "שיטות המחקר שנבחרו והרציונל" },
          { name: "ממצאים", status: "required", description: "תוצאות המחקר" },
          { name: "דיון", status: "required", description: "ניתוח הממצאים והשלכותיהם" },
          { name: "סיכום", status: "required", description: "סיכום המחקר, המסקנות והצעות למחקר עתידי" },
          { name: "ביבליוגרפיה", status: "required", description: "רשימת המקורות ששימשו במחקר" }
        ];
      case "תזה / דיסרטציה":
        return [
          { name: "שער", status: "required", description: "שער העבודה הכולל את פרטי העבודה והמוסד" },
          { name: "תקציר", status: "required", description: "סיכום העבודה (בעברית ובאנגלית)" },
          { name: "תוכן עניינים", status: "required", description: "פירוט הפרקים ומספרי העמודים" },
          { name: "מבוא", status: "required", description: "הצגת הנושא, רקע, שאלות המחקר" },
          { name: "סקירת ספרות", status: "required", description: "סקירה מקיפה של המחקר האקדמי הקיים בתחום" },
          { name: "מתודולוגיה", status: "required", description: "פירוט שיטות המחקר, אוכלוסיית המחקר, כלים, הליך" },
          { name: "ממצאים", status: "required", description: "תוצאות המחקר באופן מפורט" },
          { name: "דיון", status: "required", description: "ניתוח הממצאים, תרומת המחקר, מגבלות המחקר" },
          { name: "סיכום", status: "required", description: "סיכום המחקר והצעות למחקר עתידי" },
          { name: "ביבליוגרפיה", status: "required", description: "רשימת המקורות ששימשו במחקר" },
          { name: "נספחים", status: "optional", description: "מידע נוסף התומך במחקר" }
        ];
      case "עבודה סמינריונית":
        return [
          { name: "שער", status: "required", description: "שער העבודה הכולל את פרטי הקורס, המרצה והסטודנט" },
          { name: "תוכן עניינים", status: "required", description: "פירוט הפרקים ומספרי העמודים" },
          { name: "מבוא", status: "required", description: "הצגת הנושא והצגת שאלת המחקר" },
          { name: "סקירת ספרות", status: "required", description: "סקירה של המחקר האקדמי הקיים בתחום" },
          { name: "דיון", status: "required", description: "ניתוח הנושא לאור הספרות" },
          { name: "סיכום", status: "required", description: "סיכום והמלצות" },
          { name: "ביבליוגרפיה", status: "required", description: "רשימת המקורות ששימשו בעבודה" }
        ];
      case "מסמך מחקרי":
        return [
          { name: "כותרת", status: "required", description: "כותרת המסמך" },
          { name: "תקציר", status: "optional", description: "סיכום קצר של עיקרי המסמך" },
          { name: "מבוא", status: "required", description: "הצגת הנושא והמטרות" },
          { name: "רקע תיאורטי", status: "required", description: "הרקע התיאורטי לנושא" },
          { name: "ממצאים", status: "required", description: "ממצאי המחקר" },
          { name: "דיון", status: "required", description: "ניתוח הממצאים" },
          { name: "סיכום", status: "required", description: "סיכום המסמך" },
          { name: "מקורות", status: "required", description: "רשימת המקורות ששימשו במסמך" }
        ];
      default:
        return [
          { name: "מבוא", status: "required", description: "הצגת הנושא" },
          { name: "גוף המסמך", status: "required", description: "תוכן המסמך העיקרי" },
          { name: "סיכום", status: "required", description: "סיכום הנושא" }
        ];
    }
  };
  
  // Analyze current document structure
  const getCurrentStructure = (paragraphs) => {
    // This is a simplified analysis. In a real app, you would use more sophisticated NLP
    const structureComponents = [];
    
    // Keywords to identify different sections
    const sectionKeywords = {
      "תקציר": ["תקציר", "abstract"],
      "מבוא": ["מבוא", "הקדמה", "רקע", "introduction"],
      "סקירת ספרות": ["סקירת ספרות", "סקירה תיאורטית", "literature review"],
      "מתודולוגיה": ["מתודולוגיה", "שיטת המחקר", "methodology", "method"],
      "ממצאים": ["ממצאים", "תוצאות", "findings", "results"],
      "דיון": ["דיון", "analysis", "discussion"],
      "סיכום": ["סיכום", "מסקנות", "conclusion", "conclusions"],
      "ביבליוגרפיה": ["ביבליוגרפיה", "רשימת מקורות", "references", "bibliography"]
    };
    
    // Look for section headers in paragraphs
    paragraphs.forEach((paragraph, index) => {
      const p = paragraph.trim().toLowerCase();
      
      // Check if paragraph looks like a title (short, ends with colon, all caps, etc.)
      const isTitle = p.length < 50;
      
      if (isTitle) {
        // Check which section this might be
        for (const [section, keywords] of Object.entries(sectionKeywords)) {
          if (keywords.some(keyword => p.includes(keyword.toLowerCase()))) {
            structureComponents.push({
              name: section,
              index: index,
              present: true
            });
            break;
          }
        }
      }
    });
    
    return structureComponents;
  };
  
  // Identify missing components
  const identifyMissingComponents = (currentStructure, templateStructure) => {
    return templateStructure.filter(template => {
      if (template.status !== "required") return false;
      return !currentStructure.some(current => current.name === template.name);
    });
  };
  
  // Function to generate contextual description (moved before generateSuggestions)
  const generateContextualDescription = (component, content) => {
    const baseDescription = component.description;
    
    // ניתוח בסיסי של התוכן הקיים
    const hasIntroduction = content.toLowerCase().includes('מבוא') || content.toLowerCase().includes('הקדמה');
    const hasConclusion = content.toLowerCase().includes('סיכום') || content.toLowerCase().includes('מסקנות');
      
    switch (component.name) {
      case "מבוא":
        return hasIntroduction ? 
          "יש לשפר את המבוא הקיים - ודא שהוא מציג את הנושא, המטרות ושאלות המחקר" :
          "הוסף מבוא שיציג את נושא המחקר, חשיבותו ומטרותיו";
          
      case "סיכום":
        return hasConclusion ?
          "יש לשפר את הסיכום הקיים - ודא שהוא מסכם את העיקרים והמסקנות" :
          "הוסף סיכום שיכלול את המסקנות העיקריות והצעות למחקר עתידי";
          
      default:
        return `הוסף חלק "${component.name}": ${baseDescription}`;
    }
  };
  
  // Generate suggestions for improvement
  const generateSuggestions = (currentStructure, templateStructure, missingComponents) => {
    const suggestions = [];
    
    missingComponents.forEach(component => {
      const contextualDescription = generateContextualDescription(component, content, documentType);
      suggestions.push({
        type: "missing_section",
        section: component.name,
        description: contextualDescription,
        priority: 1
      });
    });
    
    // Check for order issues
    const correctOrder = templateStructure.map(t => t.name);
    const currentOrder = currentStructure.map(c => c.name);
    
    let hasOrderIssue = false;
    for (let i = 0; i < currentOrder.length; i++) {
      for (let j = i + 1; j < currentOrder.length; j++) {
        const indexI = correctOrder.indexOf(currentOrder[i]);
        const indexJ = correctOrder.indexOf(currentOrder[j]);
        
        if (indexI > indexJ && indexI !== -1 && indexJ !== -1) {
          hasOrderIssue = true;
          break;
        }
      }
      if (hasOrderIssue) break;
    }
    
    if (hasOrderIssue) {
      suggestions.push({
        type: "order_issue",
        description: "סדר החלקים במסמך אינו תואם את המבנה המקובל",
        correctOrder: templateStructure.filter(t => currentOrder.includes(t.name)).map(t => t.name),
        priority: 2
      });
    }
    
    // Check for balance issues (if some sections are much shorter than others)
    // This would require more text analysis in a real implementation
    
    return suggestions;
  };
  
  // Apply improvements to content
  const applyImprovements = (text, currentStructure, suggestions) => {
    let improved = text;
    
    // Add missing sections at the end
    const missingSections = suggestions.filter(s => s.type === "missing_section");
    
    if (missingSections.length > 0) {
      improved += "\n\n";
      
      missingSections.forEach(section => {
        improved += `\n\n## ${section.section}\n${section.template}\n`;
      });
    }
    
    return improved;
  };
  
  const generateImprovementGuidance = (suggestion) => {
    switch (suggestion.type) {
      case "missing_section": {
        const placement = getSectionPlacement(suggestion.section, documentType);
        return `כדי להוסיף את חלק "${suggestion.section}":\n\n` +
              `1. מצא את המקום המתאים במסמך ${placement}\n` +
              `2. הוסף כותרת: ## ${suggestion.section}\n` +
              `3. כתב תוכן שמתאים לנושא שלך בחלק זה\n\n` +
              `מה צריך לכלול: ${suggestion.description}`;
      }
              
      case "order_issue": {
        return `סדר החלקים הנוכחי לא תואם את הסטנדרט:\n\n` +
              `הסדר המומלץ: ${suggestion.correctOrder.join(" → ")}\n\n` +
              `העבר את החלקים למקומות הנכונים בעריכה ידנית`;
      }
              
      default:
        return "המלצה זו דורשת עריכה ידנית של התוכן";
    }
  };
  
  // Get template text for each section
  const getTemplateText = (sectionName) => {
    const templates = {
      "תקציר": "תקציר המחקר מציג את מטרות המחקר, השיטה והממצאים העיקריים בקצרה.",
      "מבוא": "מבוא המחקר מציג את הנושא, חשיבותו ומטרות המחקר.",
      "סקירת ספרות": "חלק זה יסקור את הספרות האקדמית הרלוונטית לנושא המחקר.",
      "מתודולוגיה": "חלק זה יתאר את שיטת המחקר, האוכלוסייה, הכלים והליך המחקר.",
      "ממצאים": "חלק זה יציג את תוצאות המחקר בצורה ברורה ומאורגנת.",
      "דיון": "חלק זה יכלול ניתוח של הממצאים, פרשנותם והשוואתם למחקרים אחרים.",
      "סיכום": "סיכום המחקר, המסקנות העיקריות והצעות למחקר עתידי.",
      "ביבליוגרפיה": "[כאן תופיע רשימת המקורות בפורמט הנדרש]"
    };
    
    return templates[sectionName] || "יש להוסיף תוכן לחלק זה";
  };
    
  const handleApplySuggestion = (suggestion) => {
    const improvementGuidance = generateImprovementGuidance(suggestion, content);
    
    alert(improvementGuidance);
  };

  const getSectionPlacement = (sectionName) => {
    const placements = {
      "תקציר": "(בתחילת המסמך, אחרי הכותרת)",
      "מבוא": "(בתחילת המסמך, אחרי התקציר אם קיים)",
      "סקירת ספרות": "(אחרי המבוא)",
      "מתודולוגיה": "(אחרי סקירת הספרות)",
      "ממצאים": "(אחרי המתודולוגיה)",
      "דיון": "(אחרי הממצאים)",
      "סיכום": "(לקראת סוף המסמך)",
      "ביבליוגרפיה": "(בסוף המסמך)",
      "נספחים": "(בסוף המסמך, אחרי הביבליוגרפיה)"
    };
    
    return placements[sectionName] || "(במקום המתאים לפי סדר החלקים)";
  };
  
  const generateStructureTemplate = () => {
    const template = getTemplateStructure(documentType);
    let templateText = "";
    
    template.forEach(section => {
      templateText += `## ${section.name}\n${getTemplateText(section.name)}\n\n`;
    });
    
    onApplySuggestion(templateText);
  };
  
  return (
    <div className="ai-tool-overlay">
      <div className="ai-tool-panel structure-improver">
        <div className="ai-tool-header">
          <h2>
            <span role="img" aria-label="structure">🏗️</span> שיפור מבנה
          </h2>
          <button className="ai-tool-close" onClick={onClose}>✕</button>
        </div>
        
        <div className="ai-tool-tabs">
          <button 
            className={`ai-tool-tab ${activeTab === "analysis" ? "active" : ""}`}
            onClick={() => setActiveTab("analysis")}
          >
            ניתוח מבנה
          </button>
          <button 
            className={`ai-tool-tab ${activeTab === "template" ? "active" : ""}`}
            onClick={() => setActiveTab("template")}
          >
            תבניות מבנה
          </button>
        </div>
      
        <div className="ai-tool-content">
          {isLoading ? (
            <div className="ai-tool-loading">
              <div className="spinner"></div>
              <p>מנתח את מבנה המסמך...</p>
            </div>
          ) : content.trim().length === 0 ? (
            <div className="ai-tool-empty">
              <p>אין מספיק טקסט לניתוח.</p>
              <p>אנא הוסף תוכן או בחר באפשרות התבניות להתחיל עם מבנה מוכן.</p>
            </div>
          ) : activeTab === "analysis" ? (
            <div className="structure-analysis">
              <div className="analysis-summary">
                <h3>ניתוח מבנה למסמך מסוג: {documentType}</h3>
                <p>
                  {structureAnalysis.paragraphCount > 0 
                    ? `המסמך כולל ${structureAnalysis.paragraphCount} פסקאות.` 
                    : "המסמך אינו כולל פסקאות מובחנות."}
                </p>
                
                {structureAnalysis.missingComponents.length > 0 ? (
                  <div className="missing-components warning">
                    <p>
                      <strong>חסרים {structureAnalysis.missingComponents.length} רכיבי מבנה חיוניים:</strong>
                    </p>
                    <ul>
                      {structureAnalysis.missingComponents.map((component, index) => (
                        <li key={index}>{component.name} - {component.description}</li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="complete-structure success">
                    <p>מבנה המסמך כולל את כל הרכיבים החיוניים! 👍</p>
                  </div>
                )}
              </div>
              
              {structureAnalysis.suggestions.length > 0 && (
                <div className="structure-suggestions">
                  <h3>המלצות לשיפור המבנה</h3>
                  <ul className="suggestions-list">
                    {structureAnalysis.suggestions.map((suggestion, index) => (
                      <li key={index} className="suggestion-item">
                        <div>
                          <strong>{suggestion.description}</strong>
                          {suggestion.type === "order_issue" && (
                            <p>סדר מומלץ: {suggestion.correctOrder.join(" → ")}</p>
                          )}
                        </div>
                        <button 
                          className="show-guidance-button"
                          onClick={() => handleApplySuggestion(suggestion)}
                        >
                          הצג הדרכה
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="structure-preview">
                <h3>מבנה המסמך הנוכחי</h3>
                <ul className="current-structure-list">
                  {structureAnalysis.currentStructure.length > 0 ? (
                    structureAnalysis.currentStructure.map((section, index) => (
                      <li key={index} className="structure-item present">
                        <span className="structure-item-icon">✓</span>
                        {section.name}
                      </li>
                    ))
                  ) : (
                    <li className="structure-item missing">
                      <span className="structure-item-icon">⚠️</span>
                      לא זוהו חלקי מבנה ברורים במסמך
                    </li>
                  )}
                  
                  {structureAnalysis.missingComponents.map((section, index) => (
                    <li key={index} className="structure-item missing">
                      <span className="structure-item-icon">✗</span>
                      {section.name} (חסר)
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="structure-templates">
              <h3>תבניות מבנה לפי סוג מסמך</h3>
              <div className="template-info">
                <h4>תבנית מבנה למסמך: {documentType}</h4>
                <p>הוספת התבנית תיצור מבנה בסיסי למסמך שלך עם הסברים לכל חלק.</p>
                <ol className="template-sections">
                  {getTemplateStructure(documentType).map((section, index) => (
                    <li key={index} className={section.status}>
                      <strong>{section.name}</strong>
                      {section.status === "required" ? " (חובה)" : " (אופציונלי)"}
                      <p>{section.description}</p>
                    </li>
                  ))}
                </ol>
                
                <button 
                  className="apply-template-button"
                  onClick={generateStructureTemplate}
                >
                  הוסף תבנית מבנה למסמך
                </button>
              </div>
              
              <div className="template-tips">
                <h4>טיפים למבנה מיטבי</h4>
                <ul>
                  <li>שמור על עקביות בפורמט הכותרות והתתי-כותרות</li>
                  <li>ודא שכל חלק מתחבר באופן לוגי לחלק שלפניו ושאחריו</li>
                  <li>שמור על איזון סביר בין אורך החלקים השונים</li>
                  <li>המבוא והסיכום צריכים להיות תמציתיים אך מקיפים</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StructureImprover;