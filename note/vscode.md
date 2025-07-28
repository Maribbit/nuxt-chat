## The `settings.json` file

While the easiest way to exit [VS Code Settings](https://code.visualstudio.com/docs/configure/settings#_multiple-languagespecific-editor-settings) is the "Settings editor"(`Ctrl + ,`), we are using `.vscode/settings.json` here to directly change its source.

Here are some directions:

- **Open `settings.json` (User or Workspace):**
  - Open the Command Palette (`Ctrl + Shift + P` or `Cmd + Shift + P`).
  - Type "Open User Settings (JSON)" or "Open Workspace Settings (JSON)" and select the appropriate command.
- **IntelliSense in Action:**
  - Once you're in `settings.json`, start typing. VS Code will offer completions for available settings. This is fantastic for discovering settings you might not even know exist\!
  - **For core settings:** Just type a `"`, and you'll see a long list of options like `"editor.fontSize"`, `"files.autoSave"`, etc.
  - **For extension settings:** If you know the extension's common prefix, type that (e.g., `"prettier."` for Prettier settings).
  - **For language-specific settings like `"[vue]"`:**
    - Type `"` and then `[` . VS Code's IntelliSense will suggest language identifiers. For Vue, it's `vue`. So you'd type `"[vue]": {` and then within those curly braces, IntelliSense will offer you all the settings that can be applied specifically to Vue files (both core editor settings and settings contributed by Vue-related extensions).
