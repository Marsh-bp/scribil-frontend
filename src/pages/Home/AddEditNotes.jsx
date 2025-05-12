import React, { useState } from 'react';
import TagInput from '../../components/Input/TagInput';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../../utils/axiosInstance';

const AddEditNotes = ({ noteData, type, getAllNotes, onClose }) => {
  const [title, setTitle] = useState(noteData?.title || "");
  const [content, setContent] = useState(noteData?.content || "");
  const [tags, setTags] = useState(noteData?.tags || []);

  const [error, setError] = useState({ title: "", content: "", tags: "", api: "" });

  const validateInputs = () => {
    const newErrors = {};

    if (!title.trim()) {
      newErrors.title = "Title is required.";
    } else if (title.length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    }

    if (!content.trim()) {
      newErrors.content = "Content is required.";
    } else if (content.length < 5) {
      newErrors.content = "Content must be at least 5 characters.";
    }

    const trimmedTags = tags.map(tag => tag.trim()).filter(tag => tag !== "");
    const uniqueTags = new Set(trimmedTags);

    if (trimmedTags.length !== uniqueTags.size) {
      newErrors.tags = "Duplicate tags are not allowed.";
    }

    setError({ ...error, ...newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const addNewNote = async () => {
    try {
      const response = await axiosInstance.post('/add-note', { title, content, tags });

      if (response.data?.note) {
        getAllNotes();
        onClose();
      }
    } catch (error) {
      setError(prev => ({
        ...prev,
        api: error.response?.data?.message || "Something went wrong."
      }));
    }
  };

  const editNote = async () => {
    const noteId = noteData._id;
    try {
      const response = await axiosInstance.put('/edit-note/' + noteId, { title, content, tags });

      if (response.data?.note) {
        getAllNotes();
        onClose();
      }
    } catch (error) {
      setError(prev => ({
        ...prev,
        api: error.response?.data?.message || "Something went wrong."
      }));
    }
  };

  const handleAddNote = () => {
    setError({ title: "", content: "", tags: "", api: "" });

    if (!validateInputs()) return;

    type === 'edit' ? editNote() : addNewNote();
  };

  return (
    <div className='relative'>
      <button
        className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-500'
        onClick={onClose}
      >
        <MdClose className="text-xl text-slate-400" />
      </button>

      <div className='flex flex-col gap-2'>
        <label className='text-xs text-slate-400'>TITLE</label>
        <input
          type="text"
          className='text-2xl text-slate-950 outline-none'
          placeholder='Go To Gym At 5'
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        {error.title && <p className="text-red-500 text-xs">{error.title}</p>}
      </div>

      <div className='flex flex-col gap-2 mt-4'>
        <label className='text-xs text-slate-400'>CONTENT</label>
        <textarea
          type="text"
          className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
          placeholder="Content"
          rows={10}
          value={content}
          onChange={({ target }) => setContent(target.value)}
        />
        {error.content && <p className="text-red-500 text-xs">{error.content}</p>}
      </div>

      <div className='mt-3'>
        <label className='input-label'>TAGS</label>
        <TagInput tags={tags} setTags={setTags} />
        {error.tags && <p className="text-red-500 text-xs">{error.tags}</p>}
      </div>

      {error.api && <p className="text-red-500 text-xs pt-4">{error.api}</p>}

      <button className='btn-primary font-medium mt-5 p-3' onClick={handleAddNote}>
        {type === "edit" ? "UPDATE" : 'ADD'}
      </button>
    </div>
  );
};

export default AddEditNotes;
