import { useState } from "react";

export function TriggerConfig() {
  const [wakeWords, setWakeWords] = useState(['help', 'emergency', 'alert']);
  const [newWord, setNewWord] = useState('');
  const [soundPatterns, setSoundPatterns] = useState({
    gunshots: true,
    glassBreaking: true,
    carScreeching: false,
    babyCrying: true
  });

  const addWakeWord = () => {
    if (newWord.trim() && !wakeWords.includes(newWord.trim().toLowerCase())) {
      setWakeWords([...wakeWords, newWord.trim().toLowerCase()]);
      setNewWord('');
    }
  };

  const removeWakeWord = (word: string) => {
    setWakeWords(wakeWords.filter(w => w !== word));
  };

  const toggleSoundPattern = (pattern: keyof typeof soundPatterns) => {
    setSoundPatterns(prev => ({
      ...prev,
      [pattern]: !prev[pattern]
    }));
  };

  const getSoundPatternLabel = (key: string) => {
    const labels: Record<string, string> = {
      gunshots: 'Gunshots',
      glassBreaking: 'Glass Breaking',
      carScreeching: 'Car Screeching',
      babyCrying: 'Baby Crying'
    };
    return labels[key] || key;
  };

  return (
    <div className="bg-surface rounded-lg border border-surface-variant p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Trigger Configuration</h3>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-on-surface-variant mb-2 block">Wake Words</label>
          <div className="flex flex-wrap gap-2 mb-2">
            {wakeWords.map((word) => (
              <span 
                key={word}
                className="px-3 py-1 bg-primary/20 text-primary text-sm rounded-full border border-primary/30 flex items-center space-x-1"
              >
                <span>{word}</span>
                <button 
                  onClick={() => removeWakeWord(word)}
                  className="ml-1 text-primary/70 hover:text-primary"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <div className="flex space-x-2">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addWakeWord()}
              placeholder="Add new wake word"
              className="flex-1 px-3 py-1 bg-background border border-surface-variant rounded text-sm text-white placeholder-on-surface-variant focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button 
              onClick={addWakeWord}
              className="px-3 py-1 bg-primary hover:bg-blue-600 text-white text-sm rounded transition-colors"
            >
              Add
            </button>
          </div>
        </div>
        
        <div>
          <label className="text-sm text-on-surface-variant mb-2 block">Sound Patterns</label>
          <div className="space-y-2">
            {Object.entries(soundPatterns).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm">{getSoundPatternLabel(key)}</span>
                <button 
                  onClick={() => toggleSoundPattern(key as keyof typeof soundPatterns)}
                  className={`w-6 h-3 rounded-full relative transition-colors ${enabled ? 'bg-success' : 'bg-surface-variant'}`}
                >
                  <div className={`absolute top-0 w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${enabled ? 'transform translate-x-3' : ''}`}></div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
