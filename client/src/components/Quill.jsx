import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import 'quill-emoji/dist/quill-emoji.css'

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
  'emoji-toolbar': true,
  'emoji-textarea': true,
  'emoji-shortname': true,
  clipboard: {
    matchVisual: false
  }
}

const Quill = ({ setQuillValue, quillValue, messageRef }) => {
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
      placeholder="Compose a message"
    />
  )
}

export default Quill
