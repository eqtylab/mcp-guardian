// Monaco editor theme definitions that match the application's cyberpunk styling
// These themes will be registered with Monaco when the editor is initialized

import { editor } from 'monaco-editor';

// Cyberpunk theme for dark mode - glowing neon accents with dark background
export const cyberpunkDarkTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    // Base syntax
    { token: '', foreground: 'e0e0e0' },
    { token: 'invalid', foreground: 'ff3333' },
    { token: 'emphasis', fontStyle: 'italic' },
    { token: 'strong', fontStyle: 'bold' },

    // Comments - subtle cyan
    { token: 'comment', foreground: '56b6c2', fontStyle: 'italic' },
    { token: 'comment.documentation', foreground: '6cd1e0' },
    
    // Variables and identifiers - cyan with glow effect
    { token: 'variable', foreground: '4deeea' },
    { token: 'variable.predefined', foreground: '4deeea' },
    { token: 'constant', foreground: '4deeea' },
    
    // Keywords - bright purple
    { token: 'keyword', foreground: 'bf40ff' },
    { token: 'keyword.control', foreground: 'bf40ff' },
    
    // JSON property names - neon blue
    { token: 'type', foreground: '33ccff' },
    { token: 'entity.name.type', foreground: '33ccff' },
    { token: 'tag', foreground: '33ccff' },
    
    // Strings - bright green
    { token: 'string', foreground: '10b981' },
    { token: 'string.escape', foreground: '10b981' },
    
    // Numbers - hot pink
    { token: 'number', foreground: 'ec4899' },
    { token: 'regexp', foreground: 'ec4899' },
    
    // Booleans and null - orange
    { token: 'keyword.json', foreground: 'ff9e64' },
    
    // Functions - gold/yellow
    { token: 'entity.name.function', foreground: 'ffd700' },
    { token: 'meta.return-type', foreground: 'ffd700' },
    
    // Punctuation - soft white
    { token: 'delimiter', foreground: 'cccccc' },
    { token: 'delimiter.bracket', foreground: 'cccccc' },
    { token: 'delimiter.parenthesis', foreground: 'cccccc' },
    
    // JSON specific - neon colors
    { token: 'property.json', foreground: '33ccff' },  // Property names in neon blue
    { token: 'operator.json', foreground: 'cccccc' },  // Colons in soft white
    { token: 'string.json', foreground: '10b981' },    // String values in neon green
    { token: 'number.json', foreground: 'ec4899' },    // Numbers in hot pink
    { token: 'keyword.json', foreground: 'ff9e64' },   // true/false/null in orange
  ],
  colors: {
    // Editor UI
    'editor.background': '#141424',                   // Dark background with slight purple tint
    'editor.foreground': '#e0e0e0',                   // Bright foreground for contrast
    'editorCursor.foreground': '#bf40ff',             // Neon purple cursor
    'editor.lineHighlightBackground': '#1e1e3a',      // Subtle highlight for current line
    'editor.selectionBackground': '#4d4dff44',        // Semi-transparent selection
    'editor.inactiveSelectionBackground': '#4d4dff22', // More transparent inactive selection
    
    // Editor gutter (line numbers)
    'editorLineNumber.foreground': '#606080',         // Subtle line numbers
    'editorLineNumber.activeForeground': '#bf40ff',   // Active line number in neon purple
    
    // Brackets and matching
    'editorBracketMatch.background': '#4d4dff33',     // Highlight matching brackets
    'editorBracketMatch.border': '#4deeea',           // Cyan border for matched brackets
    
    // Error highlighting
    'editorError.foreground': '#ff3333',              // Red for errors
    'editorWarning.foreground': '#ffcc00',            // Yellow for warnings
    
    // Code lens
    'editorCodeLens.foreground': '#606080',           // Subtle code lens
    
    // Scrollbar
    'scrollbarSlider.background': '#4d4dff22',        // Semi-transparent scrollbar
    'scrollbarSlider.hoverBackground': '#4d4dff44',   // Brighter on hover
    'scrollbarSlider.activeBackground': '#4d4dff66',  // Even brighter when active
    
    // Find/replace
    'editor.findMatchBackground': '#4deeea33',        // Subtle cyan for found matches
    'editor.findMatchHighlightBackground': '#4deeea22', // More subtle for other matches
    
    // Widget and dropdown UI
    'editorWidget.background': '#1a1a2e',             // Slightly lighter for widgets
    'editorWidget.border': '#33ccff',                 // Neon blue borders
    'editorSuggestWidget.background': '#1a1a2e',      // Intellisense background
    'editorSuggestWidget.foreground': '#e0e0e0',      // Intellisense text
    'editorSuggestWidget.selectedBackground': '#4d4dff33', // Intellisense selection
    
    // Diff editor colors
    'diffEditor.insertedTextBackground': '#10b98122', // Green for additions
    'diffEditor.removedTextBackground': '#ec489922',  // Pink for removals
  }
};

// Cyberpunk theme for light mode - softer colors with light background
export const cyberpunkLightTheme: editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: [
    // Base syntax
    { token: '', foreground: '1a1a2e' },
    { token: 'invalid', foreground: 'e11d48' },
    { token: 'emphasis', fontStyle: 'italic' },
    { token: 'strong', fontStyle: 'bold' },

    // Comments - muted blue
    { token: 'comment', foreground: '5871ab', fontStyle: 'italic' },
    { token: 'comment.documentation', foreground: '5871ab' },
    
    // Variables and identifiers - dark cyan
    { token: 'variable', foreground: '0891b2' },
    { token: 'variable.predefined', foreground: '0891b2' },
    { token: 'constant', foreground: '0891b2' },
    
    // Keywords - dark purple
    { token: 'keyword', foreground: '7c3aed' },
    { token: 'keyword.control', foreground: '7c3aed' },
    
    // JSON property names - blue
    { token: 'type', foreground: '3b82f6' },
    { token: 'entity.name.type', foreground: '3b82f6' },
    { token: 'tag', foreground: '3b82f6' },
    
    // Strings - green
    { token: 'string', foreground: '059669' },
    { token: 'string.escape', foreground: '059669' },
    
    // Numbers - magenta
    { token: 'number', foreground: 'c026d3' },
    { token: 'regexp', foreground: 'c026d3' },
    
    // Booleans and null - orange
    { token: 'keyword.json', foreground: 'f97316' },
    
    // Functions - amber
    { token: 'entity.name.function', foreground: 'd97706' },
    { token: 'meta.return-type', foreground: 'd97706' },
    
    // Punctuation - dark gray
    { token: 'delimiter', foreground: '475569' },
    { token: 'delimiter.bracket', foreground: '475569' },
    { token: 'delimiter.parenthesis', foreground: '475569' },
    
    // JSON specific
    { token: 'property.json', foreground: '3b82f6' },  // Property names in blue
    { token: 'operator.json', foreground: '475569' },  // Colons in dark gray
    { token: 'string.json', foreground: '059669' },    // String values in green
    { token: 'number.json', foreground: 'c026d3' },    // Numbers in magenta
    { token: 'keyword.json', foreground: 'f97316' },   // true/false/null in orange
  ],
  colors: {
    // Editor UI
    'editor.background': '#f8f9fc',                   // Very light background
    'editor.foreground': '#1a1a2e',                   // Dark foreground for contrast
    'editorCursor.foreground': '#7c3aed',             // Purple cursor
    'editor.lineHighlightBackground': '#eef2ff',      // Subtle line highlight
    'editor.selectionBackground': '#818cf844',        // Semi-transparent selection
    'editor.inactiveSelectionBackground': '#818cf822', // More transparent inactive selection
    
    // Editor gutter (line numbers)
    'editorLineNumber.foreground': '#94a3b8',         // Subtle line numbers
    'editorLineNumber.activeForeground': '#7c3aed',   // Active line number in purple
    
    // Brackets and matching
    'editorBracketMatch.background': '#818cf833',     // Highlight matching brackets
    'editorBracketMatch.border': '#0891b2',           // Cyan border for matched brackets
    
    // Error highlighting
    'editorError.foreground': '#e11d48',              // Red for errors
    'editorWarning.foreground': '#eab308',            // Yellow for warnings
    
    // Code lens
    'editorCodeLens.foreground': '#94a3b8',           // Subtle code lens
    
    // Scrollbar
    'scrollbarSlider.background': '#818cf822',        // Semi-transparent scrollbar
    'scrollbarSlider.hoverBackground': '#818cf844',   // Brighter on hover
    'scrollbarSlider.activeBackground': '#818cf866',  // Even brighter when active
    
    // Find/replace
    'editor.findMatchBackground': '#0891b233',        // Subtle cyan for found matches
    'editor.findMatchHighlightBackground': '#0891b222', // More subtle for other matches
    
    // Widget and dropdown UI
    'editorWidget.background': '#ffffff',             // White for widgets
    'editorWidget.border': '#3b82f6',                 // Blue borders
    'editorSuggestWidget.background': '#ffffff',      // Intellisense background
    'editorSuggestWidget.foreground': '#1a1a2e',      // Intellisense text
    'editorSuggestWidget.selectedBackground': '#818cf833', // Intellisense selection
    
    // Diff editor colors
    'diffEditor.insertedTextBackground': '#05966922', // Green for additions
    'diffEditor.removedTextBackground': '#c026d322',  // Magenta for removals
  }
};

// Function to define and register the themes
export const defineMonacoThemes = (monaco: any) => {
  // Register dark theme
  monaco.editor.defineTheme('cyberpunkDark', cyberpunkDarkTheme);
  
  // Register light theme
  monaco.editor.defineTheme('cyberpunkLight', cyberpunkLightTheme);
  
  return {
    dark: 'cyberpunkDark',
    light: 'cyberpunkLight'
  };
};