import React, { Component } from 'react'

import { Editor, EditorState, RichUtils, ContentState, getDefaultKeyBinding, convertFromHTML } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'

import FormLabel from '@material-ui/core/FormLabel'

export default class DraftEditor extends Component {
  constructor (props) {
    super(props)
    // here we create the empty state
    const isServer = (typeof window === 'undefined')
    let editorState = EditorState.createEmpty()

    // if the redux-form field has a value
    if (props.input.value && !isServer) {
      const blocksFromHTML = convertFromHTML(props.input.value)
      const blockState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      )

      editorState = EditorState.createWithContent(blockState)
    }
    // Set the editorState on the state
    this.state = {
      editorState,
    }
  }

  componentDidMount () {
    this.setState({ editor: Editor })
  }

  focus = () => this.editor.focus()

  onChange = (editorState) => {
    const { input } = this.props

    // converting to the raw JSON on change
    input.onChange(stateToHTML(editorState.getCurrentContent()))
    this.setState({ editorState })
  }

  handleKeyCommand = (command, editorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command)
    if (newState) {
      this.onChange(newState)
      return true
    }
    return false
  }

  mapKeyToEditorCommand = (e) => {
    switch (e.keyCode) {
      case 9: // TAB
        const newEditorState = RichUtils.onTab(
          e,
          this.state.editorState,
          4, /* maxDepth */
        )
        if (newEditorState !== this.state.editorState) {
          this.onChange(newEditorState)
        }
        return
    }
    return getDefaultKeyBinding(e)
  }

  toggleBlockType = (blockType) => {
    this.onChange(
      RichUtils.toggleBlockType(
        this.state.editorState,
        blockType
      )
    )
  }

  toggleInlineStyle = (inlineStyle) => {
    this.onChange(
      RichUtils.toggleInlineStyle(
        this.state.editorState,
        inlineStyle
      )
    )
  }

  render () {
    const { editorState, editor } = this.state
    const { label, input } = this.props

    // If the user changes block type before entering any text, we can
    // either style the placeholder or hide it. Let's just hide it now.
    let className = 'RichEditor-editor'
    let contentState = editorState.getCurrentContent()
    if (!contentState.hasText()) {
      if (contentState.getBlockMap().first().getType() !== 'unstyled') {
        className += ' RichEditor-hidePlaceholder'
      }
    }

    return (
      <div>
        <FormLabel>{label}</FormLabel>
        { editor
          ? <div className="RichEditor-root">
            <BlockStyleControls
              editorState={editorState}
              onToggle={this.toggleBlockType}
            />
            <InlineStyleControls
              editorState={editorState}
              onToggle={this.toggleInlineStyle}
            />
            <div className={className} onClick={this.focus}>
              <Editor
                {...input}
                blockStyleFn={getBlockStyle}
                customStyleMap={styleMap}
                editorState={editorState}
                handleKeyCommand={this.handleKeyCommand}
                keyBindingFn={this.mapKeyToEditorCommand}
                onChange={this.onChange}
                placeholder="Tell a story..."
                ref={(ref) => this.editor = ref}
                spellCheck={true}
              />
            </div>
            <style jsx>{`
          .RichEditor-root {
            background: #fff;
            border: 1px solid #ddd;
            font-family: 'Georgia', serif;
            font-size: 14px;
            padding: 15px;
            margin-top: 16px;
          }
          
          .RichEditor-editor {
            border-top: 1px solid #ddd;
            cursor: text;
            font-size: 16px;
            margin-top: 10px;
          }
          
          .RichEditor-editor .public-DraftEditorPlaceholder-root,
          .RichEditor-editor .public-DraftEditor-content {
            margin: 0 -15px -15px;
            padding: 15px;
          }
          
          .RichEditor-editor .public-DraftEditor-content {
            min-height: 100px;
          }
          
          .RichEditor-hidePlaceholder .public-DraftEditorPlaceholder-root {
            display: none;
          }
          
          .RichEditor-editor .RichEditor-blockquote {
            border-left: 5px solid #eee;
            color: #666;
            font-family: 'Hoefler Text', 'Georgia', serif;
            font-style: italic;
            margin: 16px 0;
            padding: 10px 20px;
          }
          
          .RichEditor-editor .public-DraftStyleDefault-pre {
            background-color: rgba(0, 0, 0, 0.05);
            font-family: 'Inconsolata', 'Menlo', 'Consolas', monospace;
            font-size: 16px;
            padding: 20px;
          }
          `}
            </style>
          </div>
          : null
        }
      </div>
    )
  }
}

// Custom overrides for "code" style.
const styleMap = {
  CODE: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
    fontSize: 16,
    padding: 2,
  },
}

function getBlockStyle (block) {
  switch (block.getType()) {
    case 'blockquote': return 'RichEditor-blockquote'
    default: return null
  }
}

class StyleButton extends React.Component {
  constructor () {
    super()
    this.onToggle = (e) => {
      e.preventDefault()
      this.props.onToggle(this.props.style)
    }
  }

  render () {
    return (
      <span
        className={
          this.props.active
            ? 'RichEditor-styleButton RichEditor-activeButton'
            : 'RichEditor-styleButton'
        }
        onMouseDown={this.onToggle}
      >
        {this.props.label}
        <style jsx>{`
          .RichEditor-styleButton {
            color: #999;
            cursor: pointer;
            margin-right: 16px;
            padding: 2px 0;
            display: inline-block;
          }
          
          .RichEditor-activeButton {
            color: #5890ff;
          }
        `}</style>
      </span>
    )
  }
}

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one' },
  { label: 'H2', style: 'header-two' },
  { label: 'H3', style: 'header-three' },
  { label: 'H4', style: 'header-four' },
  { label: 'H5', style: 'header-five' },
  { label: 'H6', style: 'header-six' },
  { label: 'Blockquote', style: 'blockquote' },
  { label: 'UL', style: 'unordered-list-item' },
  { label: 'OL', style: 'ordered-list-item' },
  { label: 'Code Block', style: 'code-block' },
]

const BlockStyleControls = (props) => {
  const { editorState } = props
  const selection = editorState.getSelection()
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType()

  return (
    <div className="RichEditor-controls">
      {BLOCK_TYPES.map((type) =>
        <StyleButton
          key={type.label}
          active={type.style === blockType}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
      <style jsx>{`
        .RichEditor-controls {
          font-family: 'Helvetica', sans-serif;
          font-size: 16px;
          margin-bottom: 8px;
          user-select: none;
        }
      `}
      </style>
    </div>
  )
}

let INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD' },
  { label: 'Italic', style: 'ITALIC' },
  { label: 'Underline', style: 'UNDERLINE' },
  { label: 'Monospace', style: 'CODE' },
]

const InlineStyleControls = (props) => {
  let currentStyle = props.editorState.getCurrentInlineStyle()
  return (
    <div className="RichEditor-controls">
      {INLINE_STYLES.map(type =>
        <StyleButton
          key={type.label}
          active={currentStyle.has(type.style)}
          label={type.label}
          onToggle={props.onToggle}
          style={type.style}
        />
      )}
      <style jsx>{`
        .RichEditor-controls {
          font-family: 'Helvetica', sans-serif;
          font-size: 16px;
          margin-bottom: 8px;
          user-select: none;
        }
      `}
      </style>
    </div>
  )
}
