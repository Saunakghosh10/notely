import React, { useState, useEffect } from 'react';
import { Search, Plus, X, Edit2, Trash2, Maximize2, Minimize2 } from 'lucide-react';

const initialCategories = [
  'Computer science', 'Psychology', 'Machine learning', 'Biology',
  'Economics', 'Math', 'Statistics', 'Sociology', 'Sports'
];

const initialNoteCards = [
  { id: 1, color: 'bg-green-200', year: 2024, title: 'VCHAR: Variance-Aware Human Computation framework with Generative Representation', authors: 'Authors names here', category: 'Machine learning', content: 'This is a detailed explanation of the VCHAR framework...' },
  { id: 2, color: 'bg-yellow-200', year: 2024, title: 'Bridge-like direct programmable amplification of target and donor DNA', authors: 'Authors names here', category: 'Biology', content: 'In this study, we explore a novel method for DNA amplification...' },
  { id: 3, color: 'bg-yellow-200', year: 2017, title: 'A manifesto for reproducible science', authors: 'Authors names here', category: 'Psychology', content: 'Reproducibility is a cornerstone of scientific progress...' },
  { id: 4, color: 'bg-pink-200', year: 2020, title: 'Endowment effect', authors: 'Authors names here', category: 'Economics', content: 'The endowment effect is a psychological phenomenon...' },
  { id: 5, color: 'bg-pink-200', year: 2019, title: 'The Curious Case of Neural Text Degeneration', authors: 'Authors names here', category: 'Machine learning', content: 'This paper examines the problem of neural text degeneration...' },
  { id: 6, color: 'bg-yellow-200', year: 2007, title: 'The Strength Model of Self Control', authors: 'Authors names here', category: 'Psychology', content: 'Self-control is a critical aspect of human behavior...' },
];

const NoteCard = ({ note, onEdit, onDelete, onFullScreen }) => (
  <div className={`${note.color} p-4 rounded-lg shadow-md relative group`}>
    <div className="text-sm text-gray-600">{note.year}</div>
    <h3 className="font-bold mt-1">{note.title}</h3>
    <p className="text-sm mt-2">{note.authors}</p>
    <p className="text-xs mt-2 text-gray-600">{note.category}</p>
    <div className="mt-2 h-20 overflow-hidden">
      <p className="text-sm">{note.content.substring(0, 100)}...</p>
    </div>
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={() => onFullScreen(note)} className="p-1 bg-green-500 text-white rounded-full mr-2 hover:bg-green-600">
        <Maximize2 size={16} />
      </button>
      <button onClick={() => onEdit(note)} className="p-1 bg-blue-500 text-white rounded-full mr-2 hover:bg-blue-600">
        <Edit2 size={16} />
      </button>
      <button onClick={() => onDelete(note.id)} className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

const FullScreenNote = ({ note, onClose, onSave }) => {
  const [editedNote, setEditedNote] = useState(note);

  const handleSave = () => {
    onSave(editedNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-white z-50 p-8 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{editedNote.title}</h2>
        <button onClick={onClose} className="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
          <Minimize2 size={24} />
        </button>
      </div>
      <input
        className="w-full mb-2 p-2 border rounded text-xl"
        value={editedNote.title}
        onChange={(e) => setEditedNote({ ...editedNote, title: e.target.value })}
      />
      <div className="flex mb-2">
        <input
          className="flex-1 mr-2 p-2 border rounded"
          value={editedNote.authors}
          onChange={(e) => setEditedNote({ ...editedNote, authors: e.target.value })}
        />
        <input
          className="w-24 p-2 border rounded"
          type="number"
          value={editedNote.year}
          onChange={(e) => setEditedNote({ ...editedNote, year: parseInt(e.target.value) })}
        />
      </div>
      <textarea
        className="flex-1 w-full p-2 border rounded mb-4"
        value={editedNote.content}
        onChange={(e) => setEditedNote({ ...editedNote, content: e.target.value })}
      />
      <button
        onClick={handleSave}
        className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
      >
        Save Changes
      </button>
    </div>
  );
};

const CategoryModal = ({ isOpen, onClose, onSave }) => {
  const [newCategory, setNewCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(newCategory);
    setNewCategory('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Category</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full mb-4 p-2 border rounded"
            placeholder="Category Name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
};

const NoteTakingApp = () => {
  const [activeCategory, setActiveCategory] = useState('Recent');
  const [categories, setCategories] = useState(initialCategories);
  const [noteCards, setNoteCards] = useState(initialNoteCards);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [fullScreenNote, setFullScreenNote] = useState(null);

  const addOrUpdateNote = (updatedNote) => {
    setNoteCards(noteCards.map(note =>
      note.id === updatedNote.id ? { ...note, ...updatedNote } : note
    ));
  };

  const deleteNote = (id) => {
    setNoteCards(noteCards.filter(note => note.id !== id));
  };

  const openFullScreenNote = (note) => {
    setFullScreenNote(note);
  };

  const addCategory = (newCategory) => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
  };

  const deleteCategory = (categoryToDelete) => {
    if (categoryToDelete !== 'Recent' && categoryToDelete !== 'Discover') {
      setCategories(categories.filter(cat => cat !== categoryToDelete));
      setNoteCards(noteCards.map(note =>
        note.category === categoryToDelete ? { ...note, category: 'Uncategorized' } : note
      ));
      if (activeCategory === categoryToDelete) {
        setActiveCategory('Recent');
      }
    }
  };

  const startEditCategory = (category) => {
    setEditingCategory(category);
  };

  const finishEditCategory = (oldCategory, newCategory) => {
    if (newCategory && newCategory !== oldCategory && !categories.includes(newCategory)) {
      setCategories(categories.map(cat => cat === oldCategory ? newCategory : cat));
      setNoteCards(noteCards.map(note => note.category === oldCategory ? { ...note, category: newCategory } : note));
      setActiveCategory(cat => cat === oldCategory ? newCategory : cat);
    }
    setEditingCategory(null);
  };

  const filteredNotes = noteCards.filter(note =>
    (activeCategory === 'Recent' || note.category === activeCategory) &&
    (note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h2 className="text-xl font-bold">My Library</h2>
        </div>
        <nav>
          <ul>
            <li
              className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${activeCategory === 'Recent' ? 'bg-gray-200' : ''}`}
              onClick={() => setActiveCategory('Recent')}
            >
              Recent
            </li>
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Discover</li>
            <li className="px-4 py-2 font-semibold">My library</li>
            {categories.map((category, index) => (
              <li key={index} className="flex items-center px-6 py-2 hover:bg-gray-100">
                {editingCategory === category ? (
                  <input
                    className="w-full p-1 border rounded"
                    defaultValue={category}
                    onBlur={(e) => finishEditCategory(category, e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && finishEditCategory(category, e.target.value)}
                    autoFocus
                  />
                ) : (
                  <>
                    <span
                      className={`flex-grow cursor-pointer ${activeCategory === category ? 'font-bold' : ''}`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </span>
                    <button onClick={() => startEditCategory(category)} className="text-gray-500 hover:text-gray-700 mr-1">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deleteCategory(category)} className="text-gray-500 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="px-4 py-2">
          <button
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition duration-200 ease-in-out transform hover:scale-105"
            onClick={() => setIsCategoryModalOpen(true)}
          >
            New Category
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">{activeCategory}</h1>
          <div className="flex items-center">
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Search"
                className="pl-8 pr-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            </div>
            <button
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
              onClick={() => openFullScreenNote({ id: Date.now(), color: 'bg-green-200', year: new Date().getFullYear(), title: '', authors: '', category: activeCategory, content: '' })}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((card) => (
            <NoteCard
              key={card.id}
              note={card}
              onEdit={openFullScreenNote}
              onDelete={deleteNote}
              onFullScreen={openFullScreenNote}
            />
          ))}
        </div>
      </div>

      {fullScreenNote && (
        <FullScreenNote
          note={fullScreenNote}
          onClose={() => setFullScreenNote(null)}
          onSave={addOrUpdateNote}
        />
      )}

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={addCategory}
      />
    </div>
  );
};

export default NoteTakingApp;