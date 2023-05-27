import ReactQuill, { Quill } from 'react-quill'
import quillEmoji from 'quill-emoji'
import 'react-quill/dist/quill.snow.css'
import 'quill-emoji/dist/quill-emoji.css'

// Required by Edge
Quill.register(
  {
    'formats/emoji': quillEmoji.EmojiBlot,
    'modules/emoji-toolbar': quillEmoji.ToolbarEmoji,
    'modules/emoji-textarea': quillEmoji.TextAreaEmoji,
    'modules/emoji-shortname': quillEmoji.ShortNameEmoji
  },
  true
)

const modules = {
  toolbar: [
    ['emoji'],
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    // [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['clean'],
    ['image']
  ],
  //   'emoji-toolbar': true,
  'emoji-textarea': true,
  'emoji-shortname': true,
  clipboard: {
    matchVisual: false
  }
}

const ReactQuillRte = ({ setQuillValue, quillValue, messageRef }) => {
  const rteChange = (content, delta, source, editor) => {
    console.log(editor.getHTML()) // rich text
    setQuillValue(editor.getHTML())
  }

  return (
    <ReactQuill
      className="react-quill"
      theme="snow"
      modules={modules}
      // formats={formats}
      value={quillValue}
      ref={messageRef}
      onChange={rteChange}
    />
  )
}

export default ReactQuillRte
