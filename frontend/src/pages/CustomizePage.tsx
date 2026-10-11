import { useState, useRef, useCallback } from 'react';
import { Button } from '../components/ui';

interface DesignElement {
  id: string;
  type: 'text' | 'image';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  content: string;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
}

interface HistoryState {
  elements: DesignElement[];
  productColor: string;
}

const FONTS = ['Inter', 'Fraunces', 'Georgia', 'Courier New', 'Arial'];
const PRODUCT_COLORS = [
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#1C1B1A' },
  { name: 'Heather Grey', hex: '#B0AAA0' },
  { name: 'Navy', hex: '#2C3E50' },
  { name: 'Sage', hex: '#8B9E8B' },
  { name: 'Cream', hex: '#F5F0E8' },
];

export default function CustomizePage() {
  const [elements, setElements] = useState<DesignElement[]>([]);
  const [productColor, setProductColor] = useState(PRODUCT_COLORS[0]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryState[]>([{ elements: [], productColor: '#FFFFFF' }]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'text' | 'image' | 'color'>('text');
  const [textInput, setTextInput] = useState('');
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [textColor, setTextColor] = useState('#1C1B1A');
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Push state to history
  const pushHistory = useCallback((newElements: DesignElement[], newColor: string) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ elements: newElements, productColor: newColor });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Undo
  const undo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setElements(prev.elements);
      setProductColor(PRODUCT_COLORS.find(c => c.hex === prev.productColor) || PRODUCT_COLORS[0]);
      setHistoryIndex(historyIndex - 1);
    }
  };

  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setElements(next.elements);
      setProductColor(PRODUCT_COLORS.find(c => c.hex === next.productColor) || PRODUCT_COLORS[0]);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // Add text element
  const addText = () => {
    if (!textInput.trim()) return;
    const newElement: DesignElement = {
      id: `el-${Date.now()}`,
      type: 'text',
      x: 150,
      y: 200,
      width: 200,
      height: 50,
      rotation: 0,
      content: textInput,
      fontSize: 24,
      fontFamily: selectedFont,
      color: textColor,
    };
    const newElements = [...elements, newElement];
    setElements(newElements);
    setSelectedElement(newElement.id);
    pushHistory(newElements, productColor.hex);
    setTextInput('');
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const newElement: DesignElement = {
        id: `el-${Date.now()}`,
        type: 'image',
        x: 100,
        y: 100,
        width: 150,
        height: 150,
        rotation: 0,
        content: ev.target?.result as string,
      };
      const newElements = [...elements, newElement];
      setElements(newElements);
      setSelectedElement(newElement.id);
      pushHistory(newElements, productColor.hex);
    };
    reader.readAsDataURL(file);
  };

  // Handle drag
  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.preventDefault();
    const element = elements.find(el => el.id === elementId);
    if (!element || !canvasRef.current) return;
    setSelectedElement(elementId);
    setDragging(elementId);
    const rect = canvasRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left - element.x,
      y: e.clientY - rect.top - element.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffset.x;
    const newY = e.clientY - rect.top - dragOffset.y;
    setElements(prev => prev.map(el =>
      el.id === dragging ? { ...el, x: Math.max(0, newX), y: Math.max(0, newY) } : el
    ));
  };

  const handleMouseUp = () => {
    if (dragging) {
      pushHistory(elements, productColor.hex);
      setDragging(null);
    }
  };

  // Update element property
  const updateElement = (id: string, updates: Partial<DesignElement>) => {
    const newElements = elements.map(el => el.id === id ? { ...el, ...updates } : el);
    setElements(newElements);
  };

  // Delete element
  const deleteElement = (id: string) => {
    const newElements = elements.filter(el => el.id !== id);
    setElements(newElements);
    setSelectedElement(null);
    pushHistory(newElements, productColor.hex);
  };

  // Reset
  const resetDesign = () => {
    setElements([]);
    setSelectedElement(null);
    setProductColor(PRODUCT_COLORS[0]);
    pushHistory([], PRODUCT_COLORS[0].hex);
  };

  const selectedEl = elements.find(el => el.id === selectedElement);

  return (
    <main className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-2xl lg:text-3xl font-light text-ink">Design Studio</h1>
          <p className="text-sm text-muted mt-1">Create your custom design</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-2 border border-border rounded-[var(--radius-sm)] hover:bg-ink/5 disabled:opacity-30 transition-colors"
            aria-label="Undo"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 10h13a4 4 0 010 8H9" /><path d="M3 10l4-4M3 10l4 4" />
            </svg>
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-2 border border-border rounded-[var(--radius-sm)] hover:bg-ink/5 disabled:opacity-30 transition-colors"
            aria-label="Redo"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10H8a4 4 0 000 8h7" /><path d="M21 10l-4-4M21 10l-4 4" />
            </svg>
          </button>
          <button
            onClick={resetDesign}
            className="px-3 py-2 text-xs border border-border rounded-[var(--radius-sm)] hover:bg-ink/5 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Canvas Area */}
        <div className="order-2 lg:order-1">
          <div
            ref={canvasRef}
            className="relative aspect-[3/4] max-h-[600px] bg-paper rounded-[var(--radius-card)] border border-border overflow-hidden cursor-crosshair mx-auto"
            style={{ backgroundColor: productColor.hex === '#FFFFFF' ? '#F5F0E8' : productColor.hex }}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* T-shirt outline */}
            <div className="absolute inset-8 border-2 border-dashed border-ink/10 rounded-lg flex items-center justify-center">
              <svg width="200" height="240" viewBox="0 0 200 240" fill="none" className="opacity-10">
                <path d="M50 20h100l30 40-20 10v160H40V70L20 60l30-40z" stroke="currentColor" strokeWidth="2"/>
                <path d="M75 20c0 14 11 25 25 25s25-11 25-25" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </div>

            {/* Design elements */}
            {elements.map((el) => (
              <div
                key={el.id}
                className={`absolute cursor-move select-none ${selectedElement === el.id ? 'ring-2 ring-vermilion' : ''}`}
                style={{
                  left: el.x,
                  top: el.y,
                  width: el.width,
                  height: el.height,
                  transform: `rotate(${el.rotation}deg)`,
                }}
                onMouseDown={(e) => handleMouseDown(e, el.id)}
              >
                {el.type === 'text' ? (
                  <span
                    style={{
                      fontSize: el.fontSize,
                      fontFamily: el.fontFamily,
                      color: el.color,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {el.content}
                  </span>
                ) : (
                  <img src={el.content} alt="Uploaded" className="w-full h-full object-contain" />
                )}
              </div>
            ))}

            {/* Empty state */}
            {elements.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-sm text-muted/60">Add text or upload an image to start</p>
                </div>
              </div>
            )}
          </div>

          {/* 3D Preview slot */}
          <div className="mt-4 p-3 bg-surface border border-border border-dashed rounded-[var(--radius-sm)] text-center">
            <p className="text-xs text-muted">
              <span className="font-medium">3D Preview</span> — Coming soon. This slot is reserved for a future 3D product viewer.
            </p>
          </div>
        </div>

        {/* Side Panel / Tools */}
        <div className="order-1 lg:order-2">
          <div className="bg-surface rounded-[var(--radius-card)] border border-border overflow-hidden lg:sticky lg:top-24">
            {/* Tabs */}
            <div className="flex border-b border-border">
              {(['color', 'text', 'image'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 px-4 py-3 text-xs font-medium capitalize transition-colors ${
                    activeTab === tab ? 'text-vermilion border-b-2 border-vermilion' : 'text-muted hover:text-ink'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-4 space-y-4">
              {activeTab === 'color' && (
                <>
                  <h3 className="text-xs font-semibold text-ink uppercase tracking-wider">Product Color</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {PRODUCT_COLORS.map((color) => (
                      <button
                        key={color.hex}
                        onClick={() => {
                          setProductColor(color);
                          pushHistory(elements, color.hex);
                        }}
                        className={`flex flex-col items-center p-2 rounded-[var(--radius-sm)] border transition-all ${
                          productColor.hex === color.hex ? 'border-vermilion bg-vermilion/5' : 'border-border hover:border-ink/30'
                        }`}
                      >
                        <div
                          className="w-8 h-8 rounded-full border border-border mb-1"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-[10px] text-muted">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}

              {activeTab === 'text' && (
                <>
                  <h3 className="text-xs font-semibold text-ink uppercase tracking-wider">Add Text</h3>
                  <input
                    type="text"
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Type your text..."
                    className="w-full px-3 py-2 border border-border rounded-[var(--radius-sm)] text-sm focus:outline-none focus:ring-2 focus:ring-vermilion/30"
                  />
                  <div>
                    <label className="text-xs text-muted block mb-1">Font</label>
                    <select
                      value={selectedFont}
                      onChange={(e) => setSelectedFont(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-[var(--radius-sm)] text-sm focus:outline-none focus:ring-2 focus:ring-vermilion/30"
                    >
                      {FONTS.map((f) => (
                        <option key={f} value={f} style={{ fontFamily: f }}>{f}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1">Text Color</label>
                    <div className="flex gap-2 flex-wrap">
                      {['#1C1B1A', '#FFFFFF', '#E8451E', '#2C3E50', '#8B9E8B', '#722F37'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setTextColor(c)}
                          className={`w-7 h-7 rounded-full border transition-all ${
                            textColor === c ? 'ring-2 ring-vermilion ring-offset-1' : 'border-border'
                          }`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                  </div>
                  <Button onClick={addText} disabled={!textInput.trim()} className="w-full">
                    Add Text
                  </Button>
                </>
              )}

              {activeTab === 'image' && (
                <>
                  <h3 className="text-xs font-semibold text-ink uppercase tracking-wider">Upload Image</h3>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-6 border-2 border-dashed border-border rounded-[var(--radius-sm)] text-center hover:border-vermilion/50 transition-colors"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-muted mb-2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <path d="M17 8l-5-5-5 5" />
                      <path d="M12 3v12" />
                    </svg>
                    <p className="text-xs text-muted">Click to upload an image</p>
                    <p className="text-[10px] text-muted-light mt-1">PNG, JPG up to 5MB</p>
                  </button>
                </>
              )}

              {/* Selected element controls */}
              {selectedEl && (
                <div className="border-t border-border pt-4 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-semibold text-ink uppercase tracking-wider">Selected Element</h3>
                    <button
                      onClick={() => deleteElement(selectedEl.id)}
                      className="text-xs text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                  {selectedEl.type === 'text' && (
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs text-muted block mb-1">Font Size</label>
                        <input
                          type="range"
                          min="12"
                          max="72"
                          value={selectedEl.fontSize || 24}
                          onChange={(e) => updateElement(selectedEl.id, { fontSize: Number(e.target.value) })}
                          className="w-full accent-vermilion"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted block mb-1">Rotation</label>
                        <input
                          type="range"
                          min="-180"
                          max="180"
                          value={selectedEl.rotation}
                          onChange={(e) => updateElement(selectedEl.id, { rotation: Number(e.target.value) })}
                          className="w-full accent-vermilion"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-border space-y-2">
              <Button className="w-full" size="md">
                Save Design
              </Button>
              <Button variant="secondary" className="w-full" size="md">
                Add to Cart
              </Button>
              <p className="text-[10px] text-muted text-center mt-2">
                Prototype — Save & Add to Cart are UI placeholders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
