import React, { useState, useEffect } from 'react';
import { Folder, Plus, Settings, X, Edit2, ArrowLeft } from 'lucide-react';

interface Note {
  id: string;
  year: string;
  category: string;
  title: string;
  authors: string;
  content: string;
}

interface Category {
  id: string;
  name: string;
}

const initialNotes: Note[] = [
  {
    id: '1',
    year: '2024',
    category: 'Machine learning',
    title: 'VCHAR: Variance-Driven Complex Human Activity Recognition framework with Generative Representation',
    authors: 'Shen-Yan, Huang Zeping, Yue Xiao, Pengcheng, Wu Li, Qimeng, Li Minyi',
    content: 'This paper introduces VCHAR, a novel framework for complex human activity recognition...'
  },
  // ... (other initial notes)
];

const initialCategories: Category[] = [
  { id: '1', name: 'Computer science' },
  { id: '2', name: 'Psychology' },
  { id: '3', name: 'Machine learning' },
  // ... (other initial categories)
];

const Categories: React.FC<{
  categories: Category[];
  onAddCategory: (name: string) => void;
  onDeleteCategory: (id: string) => void;
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}> = ({ categories, onAddCategory, onDeleteCategory, selectedCategory, onSelectCategory }) => {
  const [newCategory, setNewCategory] = useState('');

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setNewCategory('');
    }
  };

  return (
    <div className="flex flex-col space-y-1">
      <h3 className="font-semibold text-gray-500 mb-2">My library</h3>
      {categories.map((category) => (
        <div
          key={category.id}
          className={`flex items-center justify-between space-x-2 cursor-pointer ${selectedCategory === category.name ? 'text-blue-500' : 'text-gray-600'
            }`}
        >
          <div
            className="flex items-center space-x-2"
            onClick={() => onSelectCategory(category.name)}
          >
            <Folder size={16} className={selectedCategory === category.name ? 'text-blue-500' : 'text-gray-400'} />
            <span className="text-sm">{category.name}</span>
          </div>
          <button
            onClick={() => onDeleteCategory(category.id)}
            className="text-gray-400 hover:text-red-500"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      <div className="flex items-center space-x-2 mt-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category"
          className="text-sm border rounded px-2 py-1 flex-grow"
        />
        <button onClick={handleAddCategory} className="text-blue-500">
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
};

const NoteCard: React.FC<{
  note: Note;
  onDelete: (id: string) => void;
  onEdit: (note: Note) => void;
}> = ({ note, onDelete, onEdit }) => {
  const bgColors: { [key: string]: string } = {
    'Machine learning': 'bg-green-100',
    'Biology': 'bg-blue-100',
    'Psychology': 'bg-yellow-100',
    'Economics': 'bg-pink-100',
  };

  const truncatedContent = note.content.length > 100
    ? note.content.slice(0, 100) + '...'
    : note.content;

  return (
    <div
      className={`p-4 rounded-lg ${bgColors[note.category] || 'bg-gray-100'} relative cursor-pointer`}
      onClick={() => onEdit(note)}
    >
      <button
        onClick={(e) => { e.stopPropagation(); onDelete(note.id); }}
        className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
      >
        <X size={16} />
      </button>
      <div className="text-xs text-gray-500 mb-1">{note.year} · {note.category}</div>
      <h3 className="font-semibold text-sm mb-2">{note.title}</h3>
      <p className="text-xs text-gray-600 mb-2">{note.authors}</p>
      <p className="text-xs text-gray-700 h-12 overflow-hidden">{truncatedContent}</p>
    </div>
  );
};

const EditNoteModal: React.FC<{
  note: Note | null;
  onClose: () => void;
  onSave: (updatedNote: Note) => void;
  categories: Category[];
}> = ({ note, onClose, onSave, categories }) => {
  const [editedNote, setEditedNote] = useState<Note | null>(note);

  useEffect(() => {
    setEditedNote(note);
  }, [note]);

  if (!editedNote) return null;

  const handleSave = () => {
    if (editedNote) {
      onSave(editedNote);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
            <ArrowLeft size={24} />
          </button>
          <button onClick={handleSave} className="bg-blue-500 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
        <input
          type="text"
          value={editedNote.title}
          onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
          className="w-full text-2xl font-bold mb-4 p-2 border-b"
          placeholder="Title"
        />
        <div className="grid grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            value={editedNote.authors}
            onChange={(e) => setEditedNote({ ...editedNote, authors: e.target.value })}
            className="p-2 border rounded"
            placeholder="Authors"
          />
          <input
            type="number"
            value={editedNote.year}
            onChange={(e) => setEditedNote({ ...editedNote, year: e.target.value })}
            className="p-2 border rounded"
            placeholder="Year"
          />
          <select
            value={editedNote.category}
            onChange={(e) => setEditedNote({ ...editedNote, category: e.target.value })}
            className="p-2 border rounded"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <textarea
          value={editedNote.content}
          onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
          className="w-full h-96 p-2 border rounded"
          placeholder="Note content"
        />
      </div>
    </div>
  );
};

const NoteTakingApp: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  const handleAddCategory = (name: string) => {
    const newCategory: Category = { id: Date.now().toString(), name };
    setCategories([...categories, newCategory]);
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
    // Optionally, you might want to handle notes in the deleted category
    // For example, move them to 'Uncategorized' or delete them
  };

  const handleAddNote = (newNote: Omit<Note, 'id'>) => {
    const noteWithId: Note = { ...newNote, id: Date.now().toString(), content: '' };
    setNotes([noteWithId, ...notes]);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
  };

  const handleSaveNote = (updatedNote: Note) => {
    setNotes(notes.map(note => note.id === updatedNote.id ? updatedNote : note));
    setEditingNote(null);
  };

  const filteredNotes = selectedCategory
    ? notes.filter((note) => note.category === selectedCategory)
    : notes;

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-white p-6 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold">My Library</h2>
          <button className="text-gray-400 hover:text-gray-600">
            <Settings size={20} />
          </button>
        </div>
        <Categories
          categories={categories}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      <div className="flex-1 p-6 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Recent</h1>
          <button
            onClick={() => handleAddNote({ year: new Date().getFullYear().toString(), category: '', title: 'New Note', authors: '', content: '' })}
            className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add Item
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDelete={handleDeleteNote}
              onEdit={handleEditNote}
            />
          ))}
        </div>
      </div>

      {editingNote && (
        <EditNoteModal
          note={editingNote}
          onClose={() => setEditingNote(null)}
          onSave={handleSaveNote}
          categories={categories}
        />
      )}
    </div>
  );
};

export default NoteTakingApp;
