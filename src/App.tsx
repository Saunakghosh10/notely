import React, { useState } from 'react';
import { Search, Plus, X, Edit2, Trash2 } from 'lucide-react';

const initialCategories = [
  'Computer science', 'Psychology', 'Machine learning', 'Biology',
  'Economics', 'Math', 'Statistics', 'Sociology', 'Sports'
];

const initialNoteCards = [
  { id: 1, color: 'bg-green-200', year: 2024, title: 'VCHAR: Variance-Aware Human Computation framework with Generative Representation', authors: 'Authors names here', category: 'Machine learning' },
  { id: 2, color: 'bg-yellow-200', year: 2024, title: 'Bridge-like direct programmable amplification of target and donor DNA', authors: 'Authors names here', category: 'Biology' },
  { id: 3, color: 'bg-yellow-200', year: 2017, title: 'A manifesto for reproducible science', authors: 'Authors names here', category: 'Psychology' },
  { id: 4, color: 'bg-pink-200', year: 2020, title: 'Endowment effect', authors: 'Authors names here', category: 'Economics' },
  { id: 5, color: 'bg-pink-200', year: 2019, title: 'The Curious Case of Neural Text Degeneration', authors: 'Authors names here', category: 'Machine learning' },
  { id: 6, color: 'bg-yellow-200', year: 2007, title: 'The Strength Model of Self Control', authors: 'Authors names here', category: 'Psychology' },
];

const NoteCard = ({ note, onEdit, onDelete }) => (
  <div className={`${note.color} p-4 rounded-lg shadow-md relative group`}>
    <div className="text-sm text-gray-600">{note.year}</div>
    <h3 className="font-bold mt-1">{note.title}</h3>
    <p className="text-sm mt-2">{note.authors}</p>
    <p className="text-xs mt-2 text-gray-600">{note.category}</p>
    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <button onClick={() => onEdit(note)} className="p-1 bg-blue-500 text-white rounded-full mr-2 hover:bg-blue-600">
        <Edit2 size={16} />
      </button>
      <button onClick={() => onDelete(note.id)} className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600">
        <Trash2 size={16} />
      </button>
    </div>
  </div>
);

const ItemModal = ({ isOpen, onClose, onSave, item, categories, mode }) => {
  const [title, setTitle] = useState(item?.title || '');
  const [authors, setAuthors] = useState(item?.authors || '');
  const [year, setYear] = useState(item?.year || '');
  const [category, setCategory] = useState(item?.category || categories[0]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ id: item?.id, title, authors, year: parseInt(year), category });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{mode === 'edit' ? 'Edit Item' : 'Add New Item'}</h2>
          <button onClick={onClose}><X size={24} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            className="w-full mb-2 p-2 border rounded"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            className="w-full mb-2 p-2 border rounded"
            placeholder="Authors"
            value={authors}
            onChange={(e) => setAuthors(e.target.value)}
            required
          />
          <input
            className="w-full mb-2 p-2 border rounded"
            placeholder="Year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
          <select
            className="w-full mb-4 p-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          >
            {mode === 'edit' ? 'Save Changes' : 'Add Item'}
          </button>
        </form>
      </div>
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
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingItem, setEditingItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  const addOrUpdateItem = (item) => {
    if (modalMode === 'edit') {
      setNoteCards(noteCards.map(note => note.id === item.id ? { ...note, ...item } : note));
    } else {
      const colorOptions = ['bg-green-200', 'bg-yellow-200', 'bg-pink-200'];
      const newNoteCard = {
        id: noteCards.length + 1,
        color: colorOptions[Math.floor(Math.random() * colorOptions.length)],
        ...item
      };
      setNoteCards([...noteCards, newNoteCard]);
    }
  };

  const deleteNote = (id) => {
    setNoteCards(noteCards.filter(note => note.id !== id));
  };

  const openEditModal = (note) => {
    setEditingItem(note);
    setModalMode('edit');
    setIsItemModalOpen(true);
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
      note.authors.toLowerCase().includes(searchTerm.toLowerCase()))
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
              onClick={() => { setModalMode('add'); setEditingItem(null); setIsItemModalOpen(true); }}
            >
              <Plus size={20} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((card) => (
            <NoteCard key={card.id} note={card} onEdit={openEditModal} onDelete={deleteNote} />
          ))}
        </div>
      </div>

      <ItemModal
        isOpen={isItemModalOpen}
        onClose={() => setIsItemModalOpen(false)}
        onSave={addOrUpdateItem}
        item={editingItem}
        categories={categories}
        mode={modalMode}
      />

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        onSave={addCategory}
      />
    </div>
  );
};

export default NoteTakingApp;