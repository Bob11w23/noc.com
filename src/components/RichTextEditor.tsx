import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import BulletList from '@tiptap/extension-bullet-list';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  List,
  Image as ImageIcon,
  Link as LinkIcon,
  Highlighter,
  Palette,
} from 'lucide-react';

interface Props {
  content: string;
  onChange: (content: string) => void;
}

export const RichTextEditor: React.FC<Props> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight,
      Image,
      Link,
      BulletList,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt('Enter URL');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex flex-wrap gap-2 p-2 border-b bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
        >
          <Bold className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
        >
          <Italic className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-2 rounded ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
        >
          <UnderlineIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-2 rounded ${
            editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
          }`}
        >
          <Heading1 className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-2 rounded ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
          }`}
        >
          <Heading2 className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
        >
          <List className="w-5 h-5" />
        </button>
        <button onClick={addImage} className="p-2 rounded">
          <ImageIcon className="w-5 h-5" />
        </button>
        <button onClick={addLink} className="p-2 rounded">
          <LinkIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={`p-2 rounded ${editor.isActive('highlight') ? 'bg-gray-200' : ''}`}
        >
          <Highlighter className="w-5 h-5" />
        </button>
        <input
          type="color"
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
          className="w-8 h-8 p-0 border-0"
        />
      </div>
      <EditorContent editor={editor} className="prose max-w-none p-4" />
    </div>
  );
};